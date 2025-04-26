import { Pact } from '@pact-foundation/pact';
import axios from 'axios';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Nuxt Backend Pact Test', () => {
  let provider: Pact;

  beforeAll(async () => {
    provider = new Pact({
      consumer: 'NuxtBackend',
      provider: 'NestJSGraphQL',
      port: 3003, // Pact mock server runs here
      log: path.resolve(process.cwd(), 'pact/logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pact/pacts'),
      spec: 2,
    });

    await provider.setup();
    console.log('✅ Pact mock server running o n http://127.0.0.1:3003');
  });

  afterAll(async () => {
    await provider.finalize();
  });

  describe('GraphQL Query: Get User', () => {
    it('should get a user by ID', async () => {
      await provider.addInteraction({
        state: 'A user with ID 1 exists',
        uponReceiving: 'A request to get user by ID',
        withRequest: {
          method: 'POST',
          path: '/graphql',
          headers: { 'Content-Type': 'application/json' },
          body: {
            operationName: 'GetUser',
            query: `query GetUser($userId: Float!) { user(id: $userId) { id name email } }`,
            variables: { userId: 1 },
          },
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            data: {
              user: {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
              },
            },
          },
        },
      });

      const graphqlQuery = {
        operationName: 'GetUser',
        query: `query GetUser($userId: Float!) { user(id: $userId) { id name email } }`,
        variables: { userId: 1 },
      };

      console.log(
        '📡 Sending GraphQL request:',
        JSON.stringify(graphqlQuery, null, 2),
      );

      const response = await axios.post(
        'http://127.0.0.1:3003/graphql',
        graphqlQuery,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      expect(response.data).toEqual({
        data: {
          user: {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
          },
        },
      });

      await provider.verify();
    });
  });
});

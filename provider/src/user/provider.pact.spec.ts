// provider.pact.test.ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Verifier } from '@pact-foundation/pact';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module'; // Update with your app module
import { User } from './user.entity'; // Update with your entity path

describe('Pact Provider Verification', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const port = 3000; // Different from consumer's mock server

  // 1. Setup NestJS server and database connection
  beforeAll(async () => {
    // Initialize test database connection
    dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 7431,
      username: 'GRAPHQL',
      password: 'manager',
      database: 'postgres',
      entities: [User],
      synchronize: true,
    });

    await dataSource.initialize();

    // Create NestJS application
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`); // Add this line
  });

  // 2. Cleanup after tests
  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  // 3. Pact verification test
  it('verifies the pact with seeded data', async () => {
    const verifier = new Verifier({
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [
        path.resolve(
          process.cwd(),
          '../../frontend/pact/pacts/NuxtBackend-NestJSGraphQL.json',
        ),
      ],
      provider: 'NestJSGraphQL',
      providerVersion: '1.0.0',

      requestFilter: (req, res, next) => {
        if (req.path === '/graphql') {
          console.log('GraphQL Request:', JSON.stringify(req.body, null, 2));
        }
        next();
      },
      // 4. State handler for seeding
      stateHandlers: {
        'A user with ID 1 exists': async () => {
          // Clear existing data
          // await dataSource.getRepository(User).delete({});

          // Seed test user
          await dataSource.getRepository(User).save({
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
          return 'User 1 seeded';
        },
      },
      // Enable logging to see raw requests
      logLevel: 'debug',

      // 5. Database cleanup after each interaction
      beforeEach: async () => {
        await dataSource.getRepository(User).delete({});
      },
    });

    await verifier.verifyProvider();
  });
});

// // import { INestApplication } from '@nestjs/common';
// // import { Test } from '@nestjs/testing';
// // import { Verifier } from '@pact-foundation/pact';
// // import * as path from 'path';
// // import { AppModule } from '../app.module';
// // import { UserService } from './user.service';

// // describe('Pact Verification (NestJS)', () => {
// //   let app: INestApplication;
// //   let userService: UserService; // Add this line to store the service

// //   beforeAll(async () => {
// //     const moduleRef = await Test.createTestingModule({
// //       imports: [AppModule],
// //     }).compile();

// //     app = moduleRef.createNestApplication();
// //     userService = moduleRef.get<UserService>(UserService);
// //     await app.listen(3000); // Run NestJS API locally
// //   });

// //   afterAll(async () => {
// //     await app.close();
// //   });

// //   it('validates the expectations of NuxtBackend', async () => {
// //     // const stateHandlers = {
// //     //   'A user with ID 1 exists': async () => {
// //     //     try {
// //     //       jest.spyOn(userService, 'findOne').mockImplementation((id) => {
// //     //         if (id === '1') {
// //     //           // Cast the plain object to User type
// //     //           return Promise.resolve({
// //     //             id: '1',
// //     //             name: 'John Doe',
// //     //             email: 'johndoe@example.com',
// //     //           } as User);
// //     //         }
// //     //         return Promise.resolve(undefined);
// //     //       });

// //     //       return Promise.resolve('User with ID 1 exists');
// //     //     } catch (error) {
// //     //       console.error('Error in state handler:', error);
// //     //       // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
// //     //       return Promise.reject(
// //     //         `State handler failed: ${error.message || error}`,
// //     //       );
// //     //     }
// //     //   },
// //     // };

// //     // await new Verifier({
// //     //   provider: 'NestJSGraphQL',
// //     //   providerBaseUrl: 'http://localhost:3000',
// //     //   pactUrls: [
// //     //     path.resolve(
// //     //       process.cwd(),
// //     //       '../../frontend/pact/pacts/NuxtBackend-NestJSGraphQL.json',
// //     //     ),
// //     //   ],
// //     //   stateHandlers: stateHandlers,
// //     //   logLevel: 'info',
// //     // }).verifyProvider();
// //     await new Verifier({
// //       provider: 'NestJSGraphQL',
// //       providerBaseUrl: 'http://localhost:3000',
// //       pactUrls: [
// //         path.resolve(
// //           process.cwd(),
// //           '../../frontend/pact/pacts/NuxtBackend-NestJSGraphQL.json',
// //         ),
// //       ],
// //       stateHandlers: {
// //         'A user with ID 1 exists': async () => {
// //           // Simple state setup - we'll handle the response in the requestFilter
// //           return Promise.resolve('State handler executed');
// //         },
// //       },
// //       requestFilter: (req, res, next) => {
// //         // Check if this is the GraphQL request we want to intercept
// //         if (
// //           req.path === '/graphql' &&
// //           req.method === 'POST' &&
// //           req.body &&
// //           req.body.operationName === 'GetUser' &&
// //           req.body.variables &&
// //           req.body.variables.id === '1'
// //         ) {
// //           console.log('Intercepting GraphQL request for user ID 1');
// //           // Return our mock response with the exact format expected by the consumer
// //           res.status(200).json({
// //             data: {
// //               user: {
// //                 id: '1',
// //                 name: 'John Doe',
// //                 email: 'johndoe@example.com',
// //               },
// //             },
// //           });
// //           // Important: return here to stop further processing
// //           return;
// //         }

// //         // For all other requests, continue with normal processing
// //         next();
// //       },
// //       logLevel: 'debug', // Add debug logging to see more details about the requests
// //     }).verifyProvider();
// //   });
// // });

// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { Verifier } from '@pact-foundation/pact';
// import * as path from 'path';
// import { AppModule } from '../app.module';
// import { User } from './user.model';
// import { UserService } from './user.service';

// describe('Pact Verification (NestJS)', () => {
//   let app: INestApplication;
//   let userService: UserService;

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     userService = moduleRef.get<UserService>(UserService);
//     await app.listen(3000);
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   it('validates the expectations of NuxtBackend', async () => {
//     await new Verifier({
//       provider: 'NestJSGraphQL',
//       providerBaseUrl: 'http://localhost:3000',
//       pactUrls: [
//         path.resolve(
//           process.cwd(),
//           '../../frontend/pact/pacts/NuxtBackend-NestJSGraphQL.json',
//         ),
//       ],
//       requestFilter: (req, res, next) => {
//         if (req.path === '/graphql') {
//           console.log('GraphQL Request:', JSON.stringify(req.body, null, 2));
//         }
//         next();
//       },
//       stateHandlers: {
//         'A user with ID 1 exists': async () => {
//           try {
//             // Mock the UserService to return our test user
//             jest
//               .spyOn(userService, 'findOne')
//               .mockImplementation((id: number) => {
//                 if (id === 1) {
//                   // Create a user object that matches your User type
//                   const user = new User();
//                   user.id = 1;
//                   user.name = 'John Doe';
//                   user.email = 'johndoe@example.com';

//                   // Return the user (as a promise or directly, depending on your service)
//                   return Promise.resolve(user);
//                 }
//                 return Promise.resolve(null);
//               });

//             console.log('State handler: User with ID 1 set up successfully');
//             return Promise.resolve('User with ID 1 exists');
//           } catch (error) {
//             console.error('Error in state handler:', error);
//             return Promise.resolve(undefined);
//           }
//         },
//       },
//       logLevel: 'debug',
//     }).verifyProvider();
//   });
// });

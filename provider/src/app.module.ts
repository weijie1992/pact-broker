import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PactStateController } from './pact/pact-state.controller';
import { User } from './user/user.entity';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 7431,
      username: 'GRAPHQL',
      password: 'manager',
      database: 'postgres',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]), // for injecting repository
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false, // disables dark-themed GraphQL Playground
      autoSchemaFile: true, // Auto-generates schema
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  providers: [UserResolver, UserService],
  controllers: [PactStateController],
})
export class AppModule {}

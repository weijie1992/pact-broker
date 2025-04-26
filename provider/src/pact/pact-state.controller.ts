// src/pact/pact-state.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';

@Controller()
export class PactStateController {
  constructor(private dataSource: DataSource) {}

  @Post('/pact-setup')
  async setupState(@Body() body: { state: string }) {
    switch (body.state) {
      case 'A user with ID 1 exists':
        await this.dataSource.getRepository(User).delete({});
        await this.dataSource.getRepository(User).save({
          id: 1,
          name: 'John Doe',
          email: 'johndoe@example.com',
        });
        return { status: 'User seeded' };
      default:
        return { status: 'No setup needed' };
    }
  }
}

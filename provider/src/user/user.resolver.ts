import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: number): Promise<User | null> {
    console.log('🚀 ~ UserResolver ~ user ~ id:', id);
    const res = await this.userService.findOne(id);
    console.log('🚀 ~ UserResolver ~ user ~ res:', res);
    return res;
  }
}

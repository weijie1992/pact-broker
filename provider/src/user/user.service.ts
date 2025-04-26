import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // private userList = [
  //   { id: '1', name: 'John Doe', email: 'johndoe@example.com' },
  //   { id: '2', name: 'Jane Smith', email: 'janesmith@example.com' },
  // ];
  async findOne(id: number): Promise<User | null> {
    // const res = Promise.resolve(this.userList.find((user) => user.id === id));
    // console.log('🚀 ~ UserService ~ findOne ~ res:', res);
    // return res;
    return this.userRepository.findOne({
      where: { id },
    });
  }
}

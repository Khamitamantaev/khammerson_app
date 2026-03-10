import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAll() {
    return [
      { id: '1', name: 'User 1', email: 'user1@test.com' },
      { id: '2', name: 'User 2', email: 'user2@test.com' },
      { id: '3', name: 'User 3', email: 'user3@test.com' },
    ];
  }
}

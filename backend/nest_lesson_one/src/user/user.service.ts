import { Injectable } from '@nestjs/common';

// @Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'Ammar' },
    { id: 2, name: 'Ahmad' },
  ];
  getUserByName(name: string) {
    return this.users.filter((user) => {
      return user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase());
    });
  }
  getUserById(id: Number) {
    return this.users.filter((user) => {
      return user.id == id;
    });
  }
}

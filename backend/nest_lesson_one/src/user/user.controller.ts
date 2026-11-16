import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
  userService = new UserService();
  @Get()
  getAllUsers(@Query('name') name: string): unknown {
    return this.userService.getUserByName(name);
  }
  @Get('/:id')
  getUuserById(@Param('id') id: Number) {
    return this.userService.getUserById(id);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUpdateUserBody } from './dto/create-update-user-body';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/id/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('/email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('/userslist')
  getUsersList() {
    return this.userService.find();
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() body: CreateUpdateUserBody) {
    return this.userService.create(body);
  }

  @Put('/:id')
  @HttpCode(204)
  async updateUser(
    @Param('id') id: string,
    @Body() body: CreateUpdateUserBody,
  ) {
    await this.userService.update(id, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    await this.userService
      .delete(id)
      .catch((err) => new BadRequestException(err));
  }
}

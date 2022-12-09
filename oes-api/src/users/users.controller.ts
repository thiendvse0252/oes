import {
  Controller,
  UseGuards,
  Get,
  Put,
  Body,
  Req,
  Delete,
  Patch,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { AssignSubjectInput } from './dto/assign-subject-input';
import { ChangePasswordInput } from './dto/change-password.input';
import { CreateUserInput } from './dto/create-user.input';
import { SearchUserInput } from './dto/search-user-input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('search')
  async searchUser(@Body() body: SearchUserInput): Promise<User[]> {
    return this.usersService.searchUser(body);
  }

  @Get('me')
  async me(
    @UserEntity() user: User & { displayName: string }
  ): Promise<User & { displayName: string }> {
    user.password = undefined;
    return { ...user, displayName: user.firstname + ' ' + user.lastname };
  }

  @Put('updateProfile')
  async updateProfile(
    @UserEntity() user: User,
    @Body() newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @Put('changePassword')
  changePassword(
    @UserEntity() { id, password }: User,
    @Body() data: ChangePasswordInput
  ) {
    return this.usersService.changePassword(id, password, data);
  }

  @Put('resetPassword')
  resetPassword(@Body() { id }: { id: string }) {
    return this.usersService.resetPassword(id);
  }

  @Put()
  async updateUser(@Body() data: UpdateUserInput & { id: string }) {
    const { id, ...newUserData } = data;
    return this.usersService.updateUser(id, newUserData);
  }

  // @Put()
  // async clearExamination(@Body() { id }: { id: string }) {
  //   return this.usersService.clearExamination(id);
  // }

  // @Put()
  // async appendExamination(@Body() { id }: { id: string }) {
  //   return this.usersService.appendExamination(id);
  // }

  @Post('assignSubject')
  async assignSubject(
    @Body() { id, subjectId }: AssignSubjectInput & { id: string }
  ) {
    return this.usersService.assignSubject(id, subjectId);
  }

  @Post('joinSubject')
  async joinSubject(
    @UserEntity() user: User,
    @Body() { subjectId }: AssignSubjectInput
  ) {
    return this.usersService.assignSubject(user.id, subjectId);
  }

  @Patch()
  async updateMultipleUser(@Body() data: UpdateUserInput & { ids: string[] }) {
    const { ids, ...newUserData } = data;
    return this.usersService.updateMultipleUser(ids, newUserData);
  }

  @Get()
  async getUser(@Req() req: Request): Promise<User> {
    const id = req.query.id as string;
    return this.usersService.getUser(id);
  }

  @Delete()
  async deleteUser(@Req() req: Request): Promise<User> {
    const id = req.query.id as string;
    return this.usersService.deleteUser(id);
  }

  @Post()
  async createUser(@Body() data: CreateUserInput): Promise<User> {
    return this.usersService.createUser(data);
  }
}

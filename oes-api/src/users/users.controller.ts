import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async me(@UserEntity() user: User): Promise<User> {
    user.password = undefined;
    return user;
  }

  @Put('updateProfile')
  async updateProfile(
    @UserEntity() user: User,
    @Body() newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @Put('updateUser')
  async updateUser(@Body() data: UpdateUserInput & { id: string }) {
    const { id, ...newUserData } = data;
    return this.usersService.updateUser(id, newUserData);
  }
}

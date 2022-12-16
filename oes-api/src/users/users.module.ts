import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from 'src/auth/password.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  providers: [UsersResolver, UsersService, PasswordService],
  controllers: [UsersController],
})
export class UsersModule {}

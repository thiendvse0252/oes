import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SearchUserInput } from './dto/search-user-input';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  updateMultipleUser(ids: string[], data: UpdateUserInput) {
    return this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: data,
    });
  }

  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: { id: userId },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  searchUser(data: SearchUserInput) {
    const {
      //  role, subject, examination,
      ...searchInput
    } = data;
    const { keyword, pageNum, pageSize, orderBy, sort } = searchInput;

    return this.prisma.user.findMany({
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      orderBy: { [orderBy]: sort },
      where: {
        isEnabled: true,
        OR: [
          {
            firstname: { contains: keyword },
            lastname: { contains: keyword },
            email: { contains: keyword },
          },
        ],
        // AND: [
        //   {
        //     OR: [
        //       { Examination: { some: { id: { in: examination } } } },
        //       { Invigilate: { some: { id: { in: examination } } } },
        //     ],
        //   },
        // ],
        // subject: { some: { id: { in: subject } } },
        // role: role,
      },
    });
  }

  deleteUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isEnabled: false },
    });
  }
}

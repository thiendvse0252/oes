import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { CreateUserInput } from './dto/create-user.input';
import { SearchUserInput } from './dto/search-user-input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  async getUser(userId: string) {
    try {
      const response = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
  }

  async updateMultipleUser(ids: string[], data: UpdateUserInput) {
    try {
      const response = await this.prisma.user.updateMany({
        where: { id: { in: ids } },
        data: data,
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
  }

  async updateUser(userId: string, newUserData: UpdateUserInput) {
    try {
      const response = await this.prisma.user.update({
        data: newUserData,
        where: { id: userId },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
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

    try {
      const response = await this.prisma.user.update({
        data: {
          password: hashedPassword,
        },
        where: { id: userId },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
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

  async createUser(newUserData: CreateUserInput) {
    const hashedPassword = await this.passwordService.hashPassword(
      newUserData.password
    );
    try {
      return this.prisma.user.create({
        data: {
          ...newUserData,
          password: hashedPassword,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${newUserData.email} already used.`);
      }
      throw new Error(e);
    }
  }

  deleteUser(userId: string) {
    try {
      const response = this.prisma.user.update({
        where: { id: userId },
        data: { isEnabled: false },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
  }

  async resetPassword(userId: string) {
    const defaultPassword = 'mySecret';
    const hashedPassword = await this.passwordService.hashPassword(
      defaultPassword
    );
    try {
      const response = await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === '2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
  }

  async assignSubject(userId: string, subjectId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId, isEnabled: true },
      });

      const subject = await this.prisma.subject.findFirst({
        where: { id: subjectId, isEnabled: true },
      });

      if (user.role === Role.LECTURER || user.role === Role.STUDENT) {
        await this.prisma.userSubject.create({
          data: {
            userId: user.id,
            subjectId: subject.id,
          },
        });
      } else {
        throw new UnprocessableEntityException(
          `User is not a lecturer or student.`
        );
      }
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === '2025'
      ) {
        throw new BadRequestException(`User not found.`);
      }
      throw new Error(e);
    }
  }
}

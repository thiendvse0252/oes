import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { SearchInput } from 'src/common/models/search-input.model';
import { CreateSubjectInput } from './dto/create-subject-input';
import { UpdateSubjectInput } from './dto/update-subject-input';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async getSubject(id: string) {
    try {
      const response = await this.prisma.subject.findUnique({
        where: { id },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Subject not found.`);
      }
      throw new Error(e);
    }
  }

  async updateMultipleSubject(ids: string[], data: UpdateSubjectInput) {
    try {
      const response = await this.prisma.subject.updateMany({
        where: { id: { in: ids } },
        data: data,
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Subject not found.`);
      }
      throw new Error(e);
    }
  }

  updateSubject(subjectId: string, newSubjectData: UpdateSubjectInput) {
    try {
      const response = this.prisma.subject.update({
        data: newSubjectData,
        where: { id: subjectId },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Subject not found.`);
      }
      throw new Error(e);
    }
  }

  deleteSubject(subjectId: string) {
    try {
      const response = this.prisma.subject.update({
        where: { id: subjectId },
        data: { isEnabled: false },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Subject not found.`);
      }
      throw new Error(e);
    }
  }

  searchSubject(data: SearchInput) {
    const { keyword, pageNum, pageSize, orderBy, sort } = data;

    return this.prisma.subject.findMany({
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      orderBy: { [orderBy]: sort },
      where: {
        isEnabled: true,
        OR: [{ name: { contains: keyword } }],
      },
    });
  }

  async createSubject(data: CreateSubjectInput) {
    const { name } = data;
    try {
      const response = await this.prisma.subject.create({
        data: {
          name: name,
        },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Subject not found.`);
      }
      throw new Error(e);
    }
  }
}

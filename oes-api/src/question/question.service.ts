import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { SearchInput } from 'src/common/models/search-input.model';
import { CreateQuestionInput } from './dto/create-question-input';
import { UpdateQuestionInput } from './dto/update-question-input';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async getQuestion(id: string) {
    try {

      const response = await this.prisma.question.findUnique({
        where: { id },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Question not found.`);
      }

      throw new Error(e);

    }
  }

  async updateMultipleQuestion(ids: string[], data: UpdateQuestionInput) {
    try {
      const response = await this.prisma.question.updateMany({
        where: { id: { in: ids } },
        data: data,
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Question not found.`);
      }
      throw e;

    }
  }

  updateQuestion(questionId: string, newQuestionData: UpdateQuestionInput) {
    try {
      const response = this.prisma.question.update({
        data: {newQuestionData},

        where: { id: questionId },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Question not found.`);
      }
      throw new Error(e);
    }
  }

  deleteQuestion(questionId: string) {
    try {
      const response = this.prisma.question.update({
        where: { id: questionId },
        data: { isEnabled: false },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Question not found.`);
      }
      throw new Error(e);
    }
  }

  searchQuestion(data: SearchInput) {

    const { keyword, pageNum, pageSize, orderBy, sort } = data;

    return this.prisma.question.findMany({
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      orderBy: { [orderBy]: sort },
      where: {
        isEnabled: true,
        OR: [{ content: { contains: keyword } }],
      },
    });
  }

  async createQuestion(data: CreateQuestionInput) {
    const { name, code } = data;
    try {
      
      const response = await this.prisma.question.create({
        data: {
          id: name,
          content: code,
        },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Question not found.`);
      }
      throw new Error(e);

    }
  }
}

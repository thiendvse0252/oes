import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { SearchInput } from 'src/common/models/search-input.model';
import { CreateTopicInput } from './dto/create-topic-input';
import { UpdateTopicInput } from './dto/update-topic-input';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  async getTopic(id: string) {
    try {
      const response = await this.prisma.topic.findUnique({
        where: { id },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Topic not found.`);
      }
      throw new Error(e);
    }
  }

  async updateMultipleTopic(ids: string[], data: UpdateTopicInput) {
    try {
      const response = await this.prisma.topic.updateMany({
        where: { id: { in: ids } },
        data: data,
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Topic not found.`);
      }
      throw new Error(e);
    }
  }

  updateTopic(topicId: string, newTopicData: UpdateTopicInput) {
    try {
      const response = this.prisma.topic.update({
        data: newTopicData,
        where: { id: topicId },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Topic not found.`);
      }
      throw new Error(e);
    }
  }

  deleteTopic(topicId: string) {
    try {
      const response = this.prisma.topic.update({
        where: { id: topicId },
        data: { isEnabled: false },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Topic not found.`);
      }
      throw new Error(e);
    }
  }

  searchTopic(data: SearchInput) {
    const { keyword, pageNum, pageSize, orderBy, sort } = data;

    return this.prisma.topic.findMany({
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      orderBy: { [orderBy]: sort },
      where: {
        isEnabled: true,
        OR: [{ name: { contains: keyword } }],
      },
    });
  }

  async createTopic(data: CreateTopicInput) {
    const { name, code } = data;
    try {
      const response = await this.prisma.topic.create({
        data: {
          id: name,
          name: code,
        },
      });
      return response;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new BadRequestException(`Topic not found.`);
      }
      throw new Error(e);
    }
  }
}

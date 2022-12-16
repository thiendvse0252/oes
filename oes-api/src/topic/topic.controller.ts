import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Topic } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchInput } from 'src/common/models/search-input.model';
import { CreateTopicInput } from './dto/create-topic-input';
import { UpdateTopicInput } from './dto/update-topic-input';
import { TopicService } from './topic.service';

@Controller('topic')
@UseGuards(JwtAuthGuard)
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Get()
  async getTopic(@Req() req: Request): Promise<Topic> {
    const id = req.query.id as string;
    return this.topicService.getTopic(id);
  }

  @Put()
  async updateTopic(@Body() data: UpdateTopicInput & { id: string }) {
    const { id, ...newTopicData } = data;
    return this.topicService.updateTopic(id, newTopicData);
  }

  @Patch()
  async updateMultipleTopic(
    @Body() data: UpdateTopicInput & { ids: string[] }
  ) {
    const { ids, ...newTopicData } = data;
    return this.topicService.updateMultipleTopic(ids, newTopicData);
  }

  @Delete()
  async deleteTopic(@Req() req: Request): Promise<Topic> {
    const id = req.query.id as string;
    return this.topicService.deleteTopic(id);
  }

  @Post('search')
  async searchTopic(@Body() data: SearchInput): Promise<Topic[]> {
    return this.topicService.searchTopic(data);
  }

  @Post()
  async createTopic(@Body() data: CreateTopicInput): Promise<Topic> {
    return this.topicService.createTopic(data);
  }
}

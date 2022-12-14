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
import { Question, Subject } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchInput } from 'src/common/models/search-input.model';
import { CreateQuestionInput } from './dto/create-question-input';
import { SearchQuestionInput } from './dto/search-question-input';
import { UpdateQuestionInput } from './dto/update-question-input';

@Controller('question')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private questionController: QuestionController) {}
  @Get()
  async getSubject(@Req() req: Request): Promise<Question> {
    const id = req.query.id as string;
    return this.questionService.getSubject(id);
  }

  @Put()
  async updateSubject(@Body() data: UpdateQuestionInput & { id: string }) {
    const { id, ...newSubjectData } = data;
    return this.questionService.updateSubject(id, newSubjectData);
  }

  @Patch()
  async updateMultipleSubject(
    @Body() data:  & { ids: string[] }
  ) {
    const { ids, ...newSubjectData } = data;
    return this.questionService.updateMultipleSubject(ids, newSubjectData);
  }

  @Delete()
  async deleteSubject(@Req() req: Request): Promise<Question> {
    const id = req.query.id as string;
    return this.questionService.deleteSubject(id);
  }

  @Post('search')
  async searchSubject(@Body() data: SearchQuestionInput): Promise<Question[]> {
    return this.questionService.searchSubject(data);
  }

  @Post()
  async createSubject(@Body() data: CreateQuestionInput): Promise<Question> {
    return this.questionService.createSubject(data);
  }
}

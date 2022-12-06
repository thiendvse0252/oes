import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SearchInput } from 'src/common/models/search-input.model';
import { CreateSubjectInput } from './dto/create-subject-input';
import { UpdateSubjectInput } from './dto/update-subject-input';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  getSubject(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
    });
  }

  updateMultipleSubject(ids: string[], data: UpdateSubjectInput) {
    return this.prisma.subject.updateMany({
      where: { id: { in: ids } },
      data: data,
    });
  }

  updateSubject(subjectId: string, newSubjectData: UpdateSubjectInput) {
    return this.prisma.subject.update({
      data: newSubjectData,
      where: { id: subjectId },
    });
  }

  deleteSubject(subjectId: string) {
    return this.prisma.subject.update({
      where: { id: subjectId },
      data: { isEnabled: false },
    });
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

  createSubject(data: CreateSubjectInput) {
    const { name } = data;
    return this.prisma.subject.create({
      data: {
        name: name,
      },
    });
  }
}

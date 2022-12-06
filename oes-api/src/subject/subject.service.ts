import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
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
}

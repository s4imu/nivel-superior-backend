import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDTO } from './dto/create-subject.dto';
import { UpdatePutSubjectDTO } from './dto/update-put-subject.dto';
import { Subject } from '@prisma/client';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubjectDTO): Promise<Subject> {
    return await this.prisma.subject.create({ data });
  }

  async findAll(): Promise<Subject[]> {
    return await this.prisma.subject.findMany();
  }

  async findOne(id: string): Promise<Subject | null> {
    return await this.prisma.subject.findFirst({ where: { id } });
  }

  async findByCourseId(course_id: string): Promise<Subject[]> {
    return await this.prisma.subject.findMany({ where: { course_id } });
  }

  async update(id: string, data: UpdatePutSubjectDTO): Promise<Subject> {
    return await this.prisma.subject.update({ where: { id }, data });
  }

  async updatePartial(id: string, data: UpdatePutSubjectDTO): Promise<Subject> {
    return await this.prisma.subject.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Subject> {
    return await this.prisma.subject.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data) {
    return await this.prisma.course.create({ data });
  }

  async findAll() {
    return await this.prisma.course.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.course.findFirst({ where: { id } });
  }

  async update(id: string, data: any) {
    return await this.prisma.course.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.course.delete({ where: { id } });
  }
}

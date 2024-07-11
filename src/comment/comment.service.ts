import { Injectable } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutCommentDTO } from './dto/update-put-comment.dto';
import { UpdatePatchCommentDTO } from './dto/update-patch-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCommentDTO) {
    return await this.prisma.comment.create({ data });
  }
  async findAll() {
    return await this.prisma.comment.findMany();
  }
  async findOne(id: string) {
    return await this.prisma.comment.findFirst({ where: { id } });
  }
  async findBySubjectId(subject_id: string) {
    return await this.prisma.comment.findMany({ where: { subject_id } });
  }
  async update(id: string, data: UpdatePutCommentDTO) {
    return await this.prisma.comment.update({ where: { id }, data });
  }
  async updatePartial(id: string, data: UpdatePatchCommentDTO) {
    return await this.prisma.comment.update({ where: { id }, data });
  }
  async delete(id: string) {
    return await this.prisma.comment.delete({ where: { id } });
  }
}

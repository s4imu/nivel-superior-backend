import { Injectable } from '@nestjs/common';
import { CreateMediaDTO } from './dto/create-media.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutMediaDTO } from './dto/update-put-media.dto';
import { UpdatePatchMediaDTO } from './dto/update-patch-media.dto';
import { Media } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateMediaDTO): Promise<Media> {
    return await this.prisma.media.create({ data });
  }
  async findAll(): Promise<Media[]> {
    return await this.prisma.media.findMany();
  }
  async findOne(id: string): Promise<Media | null> {
    return await this.prisma.media.findFirst({ where: { id } });
  }
  async findByUrl(url: string): Promise<Media | null> {
    return await this.prisma.media.findFirst({ where: { url } });
  }
  async findBySubjectId(subject_id: string): Promise<Media[]> {
    return await this.prisma.media.findMany({ where: { subject_id } });
  }
  async update(id: string, data: UpdatePutMediaDTO): Promise<Media> {
    return await this.prisma.media.update({ where: { id }, data });
  }

  async updatePartial(id: string, data: UpdatePatchMediaDTO): Promise<Media> {
    return await this.prisma.media.update({ where: { id }, data });
  }
  async delete(id: string) {
    return await this.prisma.media.delete({ where: { id } });
  }
}

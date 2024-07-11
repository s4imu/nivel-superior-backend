import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Media } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { SubjectService } from 'src/subject/subject.service';
import { mediaSubjectsMap } from 'src/utils/mediaSubjectsMap';
import { CreateMediaDTO } from './dto/create-media.dto';
import { UpdatePatchMediaDTO } from './dto/update-patch-media.dto';
import { UpdatePutMediaDTO } from './dto/update-put-media.dto';
import { MediaService } from './media.service';

@Controller('medias')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly subjectService: SubjectService,
  ) {}

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post()
  // @Roles('ADMIN', 'SUPER')
  async create(@Body() data: CreateMediaDTO): Promise<Media> {
    try {
      const subject = await this.subjectService.findOne(data.subject_id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      return await this.mediaService.create(data);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new BadRequestException(err.message);
    }
  }

  @Get()
  async findAll(): Promise<Media[]> {
    try {
      return await this.mediaService.findAll();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Media> {
    try {
      const media = await this.mediaService.findOne(id);
      if (!media) throw new NotFoundException('Media Not Found!!!');
      return media;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  @Get('subjects/:subject_id')
  async findBySubjectId(
    @Param('subject_id', ParseUUIDPipe) subject_id: string,
  ): Promise<Media[]> {
    try {
      let medias = await this.mediaService.findBySubjectId(subject_id);
      if (medias) {
        const subjects = await this.subjectService.findAll();
        medias = mediaSubjectsMap(medias, subjects);
      }
      return medias;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put(':id')
  // @Roles('ADMIN', 'SUPER')
  async update(
    @Body() data: UpdatePutMediaDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Media> {
    try {
      let media = await this.mediaService.findOne(id);
      if (!media) throw new NotFoundException('Media Not Found!!!');

      const subject = await this.subjectService.findOne(data.subject_id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      media = await this.mediaService.update(id, data);
      return media;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Patch(':id')
  // @Roles('ADMIN', 'SUPER')
  async updatePartial(
    @Body() data: UpdatePatchMediaDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Media> {
    try {
      let media = await this.mediaService.findOne(id);
      if (!media) throw new NotFoundException('Media Not Found!!!');

      const subject = await this.subjectService.findOne(data.subject_id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      media = await this.mediaService.updatePartial(id, data);
      return media;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete(':id')
  // @Roles('ADMIN', 'SUPER')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      let media = await this.mediaService.findOne(id);
      if (!media) throw new NotFoundException('Media Not Found!!!');
      media = await this.mediaService.delete(id);
      return {
        status: HttpStatus.OK,
        message: `Media with id: ${id} deleted successfully`,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }
}

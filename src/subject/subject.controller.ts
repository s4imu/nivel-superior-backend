import {
  BadRequestException,
  Body,
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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Subject } from '@prisma/client';
import { CourseService } from 'src/course/course.service';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { MediaService } from 'src/media/media.service';
import { getMedias } from 'src/utils/getMedias';
import { CreateSubjectDTO } from './dto/create-subject.dto';
import { SubjectService } from './subject.service';
import { CommentService } from 'src/comment/comment.service';
import { getComments } from 'src/utils/getComments';

@Controller('subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly courseService: CourseService,
    private readonly mediasService: MediaService,
    private readonly commentsService: CommentService,
  ) {}

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post()
  // @Roles('ADMIN', 'SUPER')
  async create(@Body() data: CreateSubjectDTO): Promise<Subject> {
    try {
      const course = await this.courseService.findOne(data.course_id);
      if (!course) throw new NotFoundException('Course Not Found!!!');
      const subject = await this.subjectService.create(data);
      const medias = await this.mediasService.findBySubjectId(subject.id);
      const subjectCreated = {
        ...subject,
        medias,
      };
      return subjectCreated;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err.message);
    }
  }

  @Get()
  async findAll() {
    try {
      let subjects = await this.subjectService.findAll();
      if (subjects) {
        const medias = await this.mediasService.findAll();
        const comments = await this.commentsService.findAll();
        subjects = getMedias(subjects, medias);
        subjects = getComments(subjects, comments);
      }
      return subjects;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Subject> {
    try {
      const subject = await this.subjectService.findOne(id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      const medias = await this.mediasService.findBySubjectId(subject.id);
      const comments = await this.commentsService.findBySubjectId(subject.id);
      const subjectFound = {
        ...subject,
        medias,
        comments,
      };
      return subjectFound;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }

  @Get('courses/:course_id')
  async findByCourseId(
    @Param('course_id', ParseUUIDPipe) course_id: string,
  ): Promise<Subject[]> {
    try {
      let subjects = await this.subjectService.findByCourseId(course_id);
      if (subjects) {
        const medias = await this.mediasService.findAll();
        subjects = getMedias(subjects, medias);
      }
      return subjects;
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
    @Body() data,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Subject> {
    try {
      let subject = await this.subjectService.findOne(id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      const course = await this.courseService.findOne(data.course_id);
      if (!course) throw new NotFoundException('Course Not Found!!!');
      subject = await this.subjectService.update(id, data);
      const medias = await this.mediasService.findBySubjectId(subject.id);
      const subjectUpdated = {
        ...subject,
        medias,
      };
      return subjectUpdated;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Patch(':id')
  // @Roles('ADMIN', 'SUPER')
  async updatePartial(
    @Body() data,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Subject> {
    try {
      let subject = await this.subjectService.findOne(id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      const course = await this.courseService.findOne(data.course_id);
      if (!course) throw new NotFoundException('Course Not Found!!!');
      subject = await this.subjectService.updatePartial(id, data);
      const medias = await this.mediasService.findBySubjectId(subject.id);
      const subjectUpdated = {
        ...subject,
        medias,
      };
      return subjectUpdated;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete(':id')
  // @Roles('ADMIN', 'SUPER')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      let subject = await this.subjectService.findOne(id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      subject = await this.subjectService.delete(id);
      return {
        status: HttpStatus.OK,
        message: `Subject with id: ${id} deleted successfully`,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }
}

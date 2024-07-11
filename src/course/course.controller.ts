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
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { SubjectService } from 'src/subject/subject.service';
import { getSubjects } from 'src/utils/getSubjects';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly subjectsService: SubjectService,
  ) {}
  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post()
  // @Roles('ADMIN', 'SUPER')
  async create(@Body() data) {
    try {
      const course = await this.courseService.create(data);
      const subjectsFound = await this.subjectsService.findByCourseId(
        course.id,
      );
      const courseCreated = {
        ...course,
        subjetcs: subjectsFound,
      };
      return courseCreated;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err.message);
    }
  }

  @Get()
  async findAll() {
    try {
      let courses = await this.courseService.findAll();
      const subjects = await this.subjectsService.findAll();
      if (courses) courses = getSubjects(courses, subjects);
      return courses;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const course = await this.courseService.findOne(id);
      if (!course) throw new NotFoundException('Course Not Found!!!');
      const subjectsFound = await this.subjectsService.findByCourseId(
        course.id,
      );
      const courseFound = {
        ...course,
        subjetcs: subjectsFound,
      };
      return courseFound;
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
  async update(@Body() data, @Param('id', ParseUUIDPipe) id: string) {
    try {
      let course = await this.courseService.findOne(id);
      if (!course) throw new NotFoundException('Course Not Found!!!');
      course = await this.courseService.update(id, data);
      const subjectsFound = await this.subjectsService.findByCourseId(
        course.id,
      );
      const courseUpdated = {
        ...course,
        subjetcs: subjectsFound,
      };
      return courseUpdated;
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
      const course = await this.courseService.findOne(id);
      if (!course) throw new NotFoundException('Course Not Found!!!');
      await this.courseService.delete(course.id);
      return {
        status: HttpStatus.OK,
        message: `Course with id: ${id} deleted successfully`,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }
}

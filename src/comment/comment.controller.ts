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
  UseGuards,
} from '@nestjs/common';
import { Comment } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { getMedias } from 'src/utils/getMedias';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { SubjectService } from 'src/subject/subject.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly subjectService: SubjectService,
  ) {}

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post()
  // @Roles('ADMIN', 'SUPER')
  async create(@Body() data: CreateCommentDTO): Promise<Comment> {
    try {
      const subject = await this.subjectService.findOne(data.subject_id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      const comment = await this.commentService.create(data);

      return comment;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const comments = await this.commentService.findAll();
      return comments;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Comment> {
    try {
      const comment = await this.commentService.findOne(id);
      if (!comment) throw new NotFoundException('Comment Not Found!!!');
      return comment;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }

  @Get('subjects/:subject_id')
  async findBySubjectId(
    @Param('subject_id', ParseUUIDPipe) subject_id: string,
  ): Promise<Comment[]> {
    try {
      const comments = await this.commentService.findBySubjectId(subject_id);
      return comments;
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
  ): Promise<Comment> {
    try {
      let comment = await this.commentService.findOne(id);
      if (!comment) throw new NotFoundException('Comment Not Found!!!');
      const subject = await this.subjectService.findOne(data.subject_id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      comment = await this.commentService.update(id, data);
      return comment;
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
  ): Promise<Comment> {
    try {
      let comment = await this.commentService.findOne(id);
      if (!comment) throw new NotFoundException('Comment Not Found!!!');
      const subject = await this.subjectService.findOne(data.subject_id);
      if (!subject) throw new NotFoundException('Subject Not Found!!!');
      comment = await this.commentService.updatePartial(id, data);
      return comment;
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
      let comment = await this.commentService.findOne(id);
      if (!comment) throw new NotFoundException('Comment Not Found!!!');
      comment = await this.commentService.delete(id);
      return {
        status: HttpStatus.OK,
        message: `Comment with id: ${id} deleted successfully`,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error ' + err.message,
      );
    }
  }
}

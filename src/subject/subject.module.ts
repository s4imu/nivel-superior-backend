import { Module, forwardRef } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CourseModule } from 'src/course/course.module';
import { MediaModule } from 'src/media/media.module';
import { CommentModule } from 'src/comment/comment.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    forwardRef(() => CourseModule),
    forwardRef(() => MediaModule),
    forwardRef(() => CommentModule),
    forwardRef(() => SearchModule),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}

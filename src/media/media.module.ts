import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    forwardRef(() => SubjectModule),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}

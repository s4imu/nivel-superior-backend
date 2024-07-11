import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MediaTypes } from '@prisma/client';

export class CreateMediaDTO {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsUUID()
  @IsNotEmpty()
  subject_id: string;

  @IsEnum(MediaTypes)
  role?: MediaTypes = MediaTypes.VIDEO;
}

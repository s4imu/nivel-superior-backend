import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubjectDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  body: string;
  @IsUUID()
  @IsNotEmpty()
  course_id: string;
}

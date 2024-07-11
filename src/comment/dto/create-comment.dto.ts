import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  body: string;
  @IsUUID()
  @IsNotEmpty()
  subject_id: string;
}

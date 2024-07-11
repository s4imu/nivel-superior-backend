import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDTO } from './create-comment.dto';

export class UpdatePatchCommentDTO extends PartialType(CreateCommentDTO) {}

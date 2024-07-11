import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDTO } from './create-subject.dto';

export class UpdatePatchSubjectDTO extends PartialType(CreateSubjectDTO) {}

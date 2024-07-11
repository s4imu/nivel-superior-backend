import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDTO } from './create-media.dto';

export class UpdatePatchMediaDTO extends PartialType(CreateMediaDTO) {}

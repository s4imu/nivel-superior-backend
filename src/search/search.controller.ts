import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { Subject } from '@prisma/client';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('query') query: string): Promise<Subject[]> {
    try {
      const subjects = await this.searchService.search(query);
      return subjects;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Internal Server Error: ' + err.message,
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
  async search(query: string): Promise<Subject[]> {
    const lowercaseQuery = query.toLowerCase(); // Convertendo para minúsculas
    return await this.prisma.subject.findMany({
      where: {
        OR: [
          {
            title: {
              contains: lowercaseQuery,
            },
          },
          {
            body: {
              contains: lowercaseQuery,
            },
          },
        ],
      },
    });
  }
}

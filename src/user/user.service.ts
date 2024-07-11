import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto copy';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDTO) {
    const data = {
      ...user,
      password: await bcrypt.hash(user.password, await bcrypt.genSalt()),
      role: user.role || UserRole.COMMON,
    };
    return await this.prisma.user.create({
      data,
    });
  }
  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async update(id: string, user: UpdatePutUserDTO) {
    const data = {
      ...user,
      password: await bcrypt.hash(user.password, await bcrypt.genSalt()),
    };
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePartial(id: string, user: UpdatePatchUserDTO) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
    }
    const data = {
      ...user,
    };
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}

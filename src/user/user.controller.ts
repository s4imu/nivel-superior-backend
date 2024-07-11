import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto copy';
import { UserService } from './user.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RequestWithUser } from 'src/types/requestWithUser';

@Controller('users')
// @UseGuards(AuthenticatedGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    try {
      let user = await this.userService.findByEmail(data.email);
      if (user) {
        throw new ConflictException('Email is already in use');
      }
      user = await this.userService.create(data);
      return { ...user, password: undefined };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new BadRequestException(err.message);
    }
  }

  @Get()
  async findAll() {
    try {
      let users = await this.userService.findAll();
      users = users.map((user) => ({ ...user, password: undefined }));
      return users;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal Server Error: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      return { ...user, password: undefined };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal Server Error: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Body() data: UpdatePutUserDTO,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    try {
      let user = await this.userService.findOne(id);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Atualizar os campos do usuário
      user = await this.userService.update(id, data);

      return { ...user, password: undefined };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal Server Error ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDTO,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    try {
      let user = await this.userService.findOne(id);

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      // Verificar e atualizar o email se fornecido
      if (data.email) {
        const emailExists = await this.userService.findByEmail(data.email);
        if (emailExists && emailExists.id !== id) {
          throw new ConflictException('Email is already in use');
        }
      }
      // Atualizar os dados do usuário
      user = await this.userService.updatePartial(id, data);

      return { ...user, password: undefined };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal Server Error ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      await this.userService.delete(id);
      return {
        status: HttpStatus.OK,
        message: `User with id: ${id} deleted successfully`,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal Server Error ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

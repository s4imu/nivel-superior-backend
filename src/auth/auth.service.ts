import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '7 days',
        subject: user.id,
        issuer: this.issuer,
        audience: this.audience,
      },
    );
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (err) {
      return false;
    }
  }
  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }

  async validateUser({ email, password }: AuthLoginDTO) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Information!!!');
    }

    if (await bcrypt.compare(password, user.password)) {
      return user; // Retornar o objeto user completo
    } else {
      throw new UnauthorizedException('Invalid Information!!!');
    }
  }

  async validateUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}

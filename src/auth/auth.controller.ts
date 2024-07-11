import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req, @Response() res): any {
    try {
      const token = this.authService.createToken(req.user);
      res
        .status(200)
        .send({ token, user: { ...req.user, password: undefined } });
    } catch (err) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    try {
      const existingUser = await this.userService.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
      const token = await this.authService.register(data);
      return { accessToken: token };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  logout(@Request() req, @Response() res): any {
    req.logout((err) => {
      if (err) {
        throw new BadRequestException('Logout failed');
      }
      req.session.destroy((err) => {
        if (err) {
          throw new BadRequestException('Failed to destroy session');
        }
        res.status(200).send({ ok: true, msg: 'The user session has ended' });
      });
    });
  }
}

import { PassportSerializer } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializer.name);

  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    this.logger.debug(`Serializing user: ${JSON.stringify(user)}`);
    if (user && user.id) {
      done(null, user.id);
    } else {
      done(new Error('User object does not have an id'), null);
    }
  }

  async deserializeUser(id: string, done: Function) {
    try {
      const user = await this.userService.findOne(id);
      this.logger.debug(`Deserialized user: ${JSON.stringify(user)}`);
      done(null, user);
    } catch (error) {
      this.logger.error(
        `Error deserializing user with id ${id}: ${error.message}`,
      );
      done(error, null);
    }
  }
}

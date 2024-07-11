import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticatedGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`Request Session: ${JSON.stringify(request.session)}`);
    this.logger.debug(`Request User: ${JSON.stringify(request.user)}`);
    return request.isAuthenticated();
  }
}

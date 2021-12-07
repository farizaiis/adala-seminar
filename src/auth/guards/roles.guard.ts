/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user: User = request.user.user;

    await this.userService.findOne(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hasRole = () => roles.indexOf(user.role) > -1;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let hasPermission: boolean = false;

    if (hasRole()) {
      hasPermission = true;

      return user && hasPermission;
    }
  }
}

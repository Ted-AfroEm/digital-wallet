import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Define public routes
    const publicRoutes = ['/auth/login', '/auth/register'];
    if (publicRoutes.includes(request.url)) {
      return true; // Skip guard for these routes
    }

    return super.canActivate(context);
  }
}

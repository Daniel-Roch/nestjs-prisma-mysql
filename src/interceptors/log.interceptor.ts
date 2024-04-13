import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { colors } from 'cores_terminal';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        console.log(colors.green('[LOG] URL: ') + colors.yellow(request.url));
        console.log(
          colors.green('[TIME] ') +
            colors.red(Date.now() - dt) +
            colors.yellow(' miliseconds'),
        );
      }),
    );
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(
    //Devido ao loop que está acontecendo, preciso pegar o forwardRef - circular dependency between modules
    //@Inject(forwardRef(() => AuthService)) <- Poderia fazer isso, porém ele fica toda hora teria que escrever isso
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      //Fiz esse request, criei esse tokenPayLoad para poder passar no 'me'
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );
      request.tokenPayLoad = data;
      //Peguei os dados do usuário e salvei na request.user
      request.user = await this.userService.readOne(data.id);
      return true;
    } catch (e) {
      return false;
    }
  }
}

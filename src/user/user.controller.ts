import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import RoleGuard from 'src/guards/role.guard';
import AuthGuard from 'src/guards/auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

//O UseGuards() ao ser executado, ele executará o AuthGuard e o RoleGuard
//@Roles(Role.Admin) Posso colocar aqui para somente com o role = 2 tem acesso a tudo
@UseGuards(ThrottlerGuard, AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Posso colocar o Interceptors para cada metodo
  //@UseInterceptors(LogInterceptor)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  @Roles(Role.Admin)
  @Get()
  async read() {
    return await this.userService.read();
  }

  //Utilizei o meu decorator - @ParamId()
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async readOne(@ParamId() id: number) {
    return await this.userService.readOne(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async updateAll(
    @Body() data: UpdatePutUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updateAll(data, id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Body() data: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(data, id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

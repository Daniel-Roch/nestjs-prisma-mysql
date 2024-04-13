import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    //ele pede primeiro a chave que vai ser encryptografada, e depois ele pede saltrounds
    //porém por padrão ele pede 10 e isso pode ficar pesado pro processamento
    data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

    return await this.prisma.users.create({
      //Data seria os dados que irão entrar
      data,
      //O select seria dados que foram gerados para retornar.
      /* select: {
        id: true,
        name: true,
        email: true,
        birthAt: true,
        createdAt: true,
      }, */
    });
  }

  async read() {
    return await this.prisma.users.findMany();
  }

  async readOne(id: number) {
    await this.existsId(id);
    return await this.prisma.users.findUnique({
      where: { id },
    });
  }

  async update(
    { email, name, password, birthAt, role }: UpdatePatchUserDTO,
    id: number,
  ) {
    await this.existsId(id);
    const data = { email, name, password, birthAt, role };
    const newData: any = {};
    for (const key in data) {
      if (data[key]) {
        if (key == 'birthAt') {
          newData[key] = new Date(birthAt);
        } else if (key == 'password') {
          newData[key] = await bcrypt.hash(password, await bcrypt.genSalt());
        } else {
          newData[key] = data[key];
        }
      }
    }
    return this.prisma.users.update({
      data: newData,
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        birthAt: true,
        updatedAt: true,
      },
    });
  }

  async updateAll(
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
    id: number,
  ) {
    await this.existsId(id);
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    return this.prisma.users.update({
      data: {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        birthAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: number) {
    await this.existsId(id);
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async existsId(id: number) {
    if (
      !(await this.prisma.users.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O id: ${id} não foi encontrado`);
    }
  }
}

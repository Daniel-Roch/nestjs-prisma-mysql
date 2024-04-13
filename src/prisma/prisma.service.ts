import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  //Quando inicializar, ele já vai executar o onModuleInit
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
  //Para quando o banco de dados fechar
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}

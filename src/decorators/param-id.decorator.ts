import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';

//ExecutionContext - response, request
//utilizei _ para ignorar o data
export const ParamId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const id = context.switchToHttp().getRequest().params.id;
    if (isNaN(id)) {
      throw new BadRequestException(`id is not a number!`);
    }
    return Number(id);
  },
);

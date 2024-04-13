import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('dogs')
export class DogController {
  @Post()
  async create(@Body() body) {
    return { body };
  }

  @Get()
  async read() {
    return {
      dogs: [],
    };
  }

  @Get(':id')
  async readOne(@Param() params) {
    return {
      dogs: {},
      params,
    };
  }

  @Put(':id')
  async updateAll(@Body() body, @Param() params) {
    return { body, params };
  }

  @Patch(':id')
  async update(@Body() body, @Param() params) {
    return { body, params };
  }

  @Delete(':id')
  async delete(@Param() params) {
    return { params };
  }
}

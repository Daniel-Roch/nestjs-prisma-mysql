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

@Controller('cats')
export class CatController {
  @Post()
  async create(@Body() body) {
    return { body };
  }

  @Get()
  async read() {
    return {
      cats: [],
    };
  }

  @Get(':id')
  async readOne(@Param() params) {
    return {
      cats: {},
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

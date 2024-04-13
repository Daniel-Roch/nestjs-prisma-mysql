import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login-dto';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import { AuthForgetDTO } from './dto/auth-forget-dto';
import { AuthResetDTO } from './dto/auth-reset-dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import AuthGuard from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  //Recuperar senha
  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  /* @Post('me')
  async me(@Headers('authorization') token) {
    return this.authService.checkToken((token ?? '').split(' ')[1]);
  }

  -Colocando o AuthGuard -

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@Req() req) {
    //criei esse req.tokenPayLoad no auth.guards
    return { me: 'sucess', data: req.tokenPayLoad, user: req.user };
  } */

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User('email') user) {
    return { user };
  }

  //Para usar o Multer - o 'file' é porque estou chamando no insominia como file
  //No UploadedFile eu consigo fazer uma validação do tipo de arquivo que quero que venha
  // new FileTypeValidator({ fileType: 'image/*' }) -- o tipo de arquivo, quero todo tipo de imagem
  // new MaxFileSizeValidator({maxSize: })tamanho de arquivo, entra os bytes
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 50 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    //Usando o writeFile para salvar no arquivo storage
    //join para jogar o arquivo lá, utilizei 2 .. para ir até a pasta raiz e depois entrar na storage
    //O ultimo seria o nome do arquivo
    //const result = await writeFile(join(__dirname,'..','..','storage','photos',`photo-${user.id}.${photo.mimetype.replace('image/', '')}`,),photo.buffer);
    //Criei um arquivo file para melhorar
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photos',
      `photo-${user.id}.${photo.mimetype.replace('image/', '')}`,
    );
    try {
      await this.fileService.upload(path, photo);

      return { sucess: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //Multiplos arquivos
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files;
  }

  //enviar multiplos arquivos que contem algo dentro
  //maxCount é quantidade de arquivos -- exemplo no insomnia
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles()
    files: {
      photo: Express.Multer.File;
      documents: Express.Multer.File[];
    },
  ) {
    return files;
  }
}

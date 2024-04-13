import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  upload(path: string, file: Express.Multer.File) {
    //Executar ela como uma promise então preciso pegar do fs/promises - isso é do nodejs
    return writeFile(path, file.buffer);
  }
}

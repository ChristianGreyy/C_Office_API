import {
  Controller,
  HttpCode,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { multerOptions } from '../uploads/options/multer.option';

import { MediaService } from './media.service';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { LocalesService } from '../locales/locales.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiOperation({ summary: 'API Upload file to cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', multerOptions.fileFilter))
  async createMedia(    
    @UserDecorator('id') userId: number , @UploadedFile() file): Promise<any> {
    return this.mediaService.createMedia(userId, file);
  }
}

import { Injectable } from '@nestjs/common';
import { Media } from '@prisma/client';
import { UploadService } from '../uploads/upload.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
      ) {}

    async createMedia(
        userId: number,
        file: any,
    ): Promise<Media> {
        const url = await this.uploadService.uploadImage(file);
        const media = await this.prisma.media.create({
        data: {
          creatorId: userId,
          url: url,
        },
      });
      return media;
    }
}
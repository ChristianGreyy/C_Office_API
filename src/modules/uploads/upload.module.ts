import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
  controllers: [],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadsModule {}
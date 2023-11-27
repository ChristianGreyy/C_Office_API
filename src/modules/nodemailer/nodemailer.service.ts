import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as hbs from 'nodemailer-express-handlebars';
import { SendMailDto } from './dtos/send-mail.dto';

@Injectable()
export class NodemailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.setupTemplates();
  }

  private setupTemplates() {
    const viewsPath = path.resolve(__dirname, '../../../src/views'); // Specify the path to your email templates

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.hbs',
          partialsDir: path.resolve(viewsPath, 'partials'),
          layoutsDir: path.resolve(viewsPath, 'layouts'),
          defaultLayout: 'main',
        },
        viewPath: viewsPath,
        extName: '.hbs',
      }),
    );
  }

  async sendMail({
    to,
    subject,
    template,
    context,
  }: SendMailDto): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      template,
      context,
    });
  }
}

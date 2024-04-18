import fs from 'fs';
import path, { extname } from 'path';

import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import {
  FILE_FILTER
} from 'src/constants';
import { v4 as uuidv4 } from 'uuid';

function convertToASCII(inputString) {
  // Use the String.prototype.normalize() method to handle characters with diacritics
  const normalizedString = inputString.normalize('NFD');
  // Use regular expressions to match diacritics and replace them with their closest ASCII representation
  const asciiString = normalizedString.replace(/[\u0300-\u036f]/g, '');
  // Replace any other non-ASCII characters with empty strings or their closest ASCII equivalent
  const replacedString = asciiString
    .replace(/[^A-Za-z0-9\s.]/g, '-') // Remove special characters except spaces
    .replace(/\s+/g, '-'); // Replace spaces with hyphens

  return replacedString;
}

function hasNonAsciiCharacters(inputString) {
  const nonAsciiRegex = /[^\x00-\x7F]/;

  return nonAsciiRegex.test(inputString);
}

function hasSpecialCharacters(inputString) {
  const specialRegex = /[^A-Za-z0-9\s]/;

  return specialRegex.test(inputString);
}

export const multerOptions = {
  fileFilter: {
    limits: {
      files: 1,
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req: Request, file, cb) => {
      if (
        hasNonAsciiCharacters(file.originalname) ||
        hasSpecialCharacters(file.originalname)
      ) {
        file.originalname = convertToASCII(file.originalname);
      }
      if (file.mimetype.match(FILE_FILTER)) {
        cb(null, true);
      } else {
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    },
  },
  multerSaver: {
    storage: diskStorage({
      destination: function (req, file, cb) {
        const DIR_NAME = 'uploads';
        if (!fs.existsSync(DIR_NAME)) {
          fs.mkdirSync(DIR_NAME);
        }
        cb(null, DIR_NAME);
      },
      filename: function (req, file, cb) {
        cb(null, `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`);
      },
    }),
  },
};

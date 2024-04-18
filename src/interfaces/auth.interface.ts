import { User } from "@prisma/client";

export interface ILogin {
  user: User
  accessToken?: string;
  refreshToken?: string;
}

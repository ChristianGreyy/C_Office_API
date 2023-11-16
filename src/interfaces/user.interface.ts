export interface IUser {
  id?: number;
  email?: string;
  phone?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}

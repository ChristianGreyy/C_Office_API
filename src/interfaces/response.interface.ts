export interface IResponse {
  statusCode: number;
  message: string;
  data?: any;
  errors?: string;
}

export interface IPagination<T> {
  total: number;
  items: T[];
}

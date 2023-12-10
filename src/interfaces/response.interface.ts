export interface IResponse {
  statusCode: number;
  message: string;
  data?: any;
  errors?: string;
}

export interface IPagination<T> {
  total?: number;
  page?: number;
  limit?: number;
  items: T[];
}

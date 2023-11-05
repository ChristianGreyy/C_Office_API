export interface IResponse {
  statusCode: number;
  message: string;
  data?: any;
  errors?: string;
}

export type ParamsRequestType = {
  method: MethodType;
  headers: {
    "Content-type": string;
    Accept: string;
    "x-auth-token"?: string;
  };
  body?: any;
};

export enum MethodType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

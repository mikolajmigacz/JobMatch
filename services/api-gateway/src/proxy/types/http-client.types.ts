import { AxiosError } from 'axios';

export type HttpClientError = AxiosError | Error | unknown;

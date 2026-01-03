import { All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ALLOWED_HEADERS } from '@/shared/constants/headers.constants';

export interface ProxyClient {
  request<T>(config: Record<string, unknown>): Promise<{ status: number; data: T }>;
}

export abstract class GenericProxyController {
  protected abstract readonly client: ProxyClient;
  protected abstract readonly pathPrefix?: string;

  @All('*path')
  async proxy(@Req() req: Request, @Res() res: Response): Promise<void> {
    const pathParam = req.params.path;
    const path = pathParam ? `/${Array.isArray(pathParam) ? pathParam.join('/') : pathParam}` : '';

    const finalPath = this.pathPrefix ? `${this.pathPrefix}${path}` : path;

    const response = await this.client.request({
      method: req.method,
      url: finalPath,
      headers: this.filterHeaders(req.headers),
      data: req.body,
      params: req.query,
    });

    res.status(response.status).send(response.data);
  }

  private filterHeaders(
    headers: Record<string, string | string[] | undefined>
  ): Record<string, string> {
    const filtered: Record<string, string> = {};

    for (const key of ALLOWED_HEADERS) {
      const value = headers[key];
      if (value) {
        filtered[key] = Array.isArray(value) ? value[0] : value;
      }
    }

    return filtered;
  }
}

import { Controller, All, Req, Res, Inject } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthServiceClient } from '@proxy/clients/auth-service.client';
import { RATE_LIMIT_CONFIG } from '@config/rate-limit.config';
import { ALLOWED_HEADERS } from '@/shared/constants/headers.constants';

@Controller('api/auth')
@Throttle({ auth: { ttl: RATE_LIMIT_CONFIG.auth.ttl, limit: RATE_LIMIT_CONFIG.auth.limit } })
export class AuthProxyController {
  constructor(@Inject(AuthServiceClient) private readonly client: AuthServiceClient) {}

  @All('*path')
  async proxy(@Req() req: Request, @Res() res: Response): Promise<void> {
    const pathParam = req.params.path;
    const path = pathParam ? `/${Array.isArray(pathParam) ? pathParam.join('/') : pathParam}` : '';
    const finalPath = `/auth${path}`;

    const response = await this.client.request({
      method: req.method,
      url: finalPath,
      headers: this.filterHeaders(req.headers),
      data: req.body,
      params: req.query,
    });

    res.status(response.status).send(response.data);
  }

  private filterHeaders(headers: any): Record<string, string> {
    const filtered: Record<string, string> = {};

    for (const key of ALLOWED_HEADERS) {
      if (headers[key]) {
        filtered[key] = headers[key] as string;
      }
    }

    return filtered;
  }
}

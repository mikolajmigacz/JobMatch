import { Controller, All, Req, Res, Inject, HttpException } from '@nestjs/common';
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

    const contentType = ((req.headers['content-type'] as string) || '').toLowerCase();
    const isMultipart = contentType.includes('multipart/form-data');

    try {
      const response = await this.client.request({
        method: req.method,
        url: finalPath,
        headers: this.filterHeaders(req.headers),
        data: isMultipart ? req : req.body,
        params: req.query,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      res.status(response.status).send(response.data);
    } catch (error) {
      if (error instanceof HttpException) {
        const body = error.getResponse() as Record<string, unknown>;
        const upstream = body.message;
        const payload = upstream && typeof upstream === 'object' ? upstream : body;
        res.status(error.getStatus()).send(payload);
      } else {
        res.status(500).send({ message: 'Internal server error' });
      }
    }
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

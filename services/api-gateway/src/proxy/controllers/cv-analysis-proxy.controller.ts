import { Controller, All, Req, Res, Inject } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { CvAnalysisServiceClient } from '@proxy/clients/cv-analysis-service.client';
import { RATE_LIMIT_CONFIG } from '@config/rate-limit.config';
import { ALLOWED_HEADERS } from '@/shared/constants/headers.constants';

@Controller('api/cv-analysis')
@Throttle({
  'cv-analysis': {
    ttl: RATE_LIMIT_CONFIG.cvAnalysis.ttl,
    limit: RATE_LIMIT_CONFIG.cvAnalysis.limit,
  },
})
export class CvAnalysisProxyController {
  constructor(@Inject(CvAnalysisServiceClient) private readonly client: CvAnalysisServiceClient) {}

  @All('*path')
  async proxy(@Req() req: Request, @Res() res: Response): Promise<void> {
    const pathParam = req.params.path;
    const path = pathParam ? `/${Array.isArray(pathParam) ? pathParam.join('/') : pathParam}` : '';

    const response = await this.client.request({
      method: req.method,
      url: path,
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

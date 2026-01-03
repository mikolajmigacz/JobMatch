import { Controller, Inject } from '@nestjs/common';
import { ServiceConfig } from '@proxy/config/services.config';
import { GenericProxyController } from './generic-proxy.controller';

export function createProxyController(config: ServiceConfig, clientClass: any): any {
  @Controller(config.route)
  class DynamicProxyController extends GenericProxyController {
    protected readonly pathPrefix = config.pathPrefix;

    constructor(@Inject(clientClass) protected readonly client: any) {
      super();
    }
  }

  Object.defineProperty(DynamicProxyController, 'name', {
    value: `${config.name.charAt(0).toUpperCase() + config.name.slice(1)}ProxyController`,
  });

  return DynamicProxyController;
}

import { Controller, Inject } from '@nestjs/common';
import { ServiceConfig } from '@proxy/config/services.config';
import { GenericProxyController, ProxyClient } from './generic-proxy.controller';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createProxyController(
  config: ServiceConfig,
  clientClass: new (...args: any[]) => any // eslint-disable-line @typescript-eslint/no-explicit-any
): new (...args: any[]) => GenericProxyController {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  @Controller(config.route)
  class DynamicProxyController extends GenericProxyController {
    protected readonly pathPrefix = config.pathPrefix;

    constructor(@Inject(clientClass) protected readonly client: ProxyClient) {
      super();
    }
  }

  Object.defineProperty(DynamicProxyController, 'name', {
    value: `${config.name.charAt(0).toUpperCase() + config.name.slice(1)}ProxyController`,
  });

  return DynamicProxyController;
}

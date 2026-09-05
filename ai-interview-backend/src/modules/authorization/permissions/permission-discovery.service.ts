import { Injectable } from '@nestjs/common';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { HttpMethod } from '@prisma/client';
import { RequestMethod } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

export interface DiscoveredPermission {
  method: HttpMethod;
  path: string;
  isPublic: boolean;
}

const REQUEST_METHOD_TO_PERMISSION: Partial<Record<RequestMethod, HttpMethod>> =
  {
    [RequestMethod.GET]: HttpMethod.GET,
    [RequestMethod.POST]: HttpMethod.POST,
    [RequestMethod.PUT]: HttpMethod.PUT,
    [RequestMethod.PATCH]: HttpMethod.PATCH,
    [RequestMethod.DELETE]: HttpMethod.DELETE,
  };

@Injectable()
export class PermissionDiscoveryService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  discover(): DiscoveredPermission[] {
    const discovered = new Map<string, DiscoveredPermission>();

    for (const wrapper of this.discoveryService.getControllers()) {
      const controller = wrapper.metatype;
      const instance = wrapper.instance;
      if (!controller || !instance) continue;

      const controllerPaths = this.toPaths(
        Reflect.getMetadata(PATH_METADATA, controller),
      );
      if (controllerPaths.length === 0) continue;

      const prototype = Object.getPrototypeOf(instance);
      for (const propertyName of Object.getOwnPropertyNames(prototype)) {
        if (propertyName === 'constructor') continue;

        const handler = prototype[propertyName] as unknown;
        if (typeof handler !== 'function') continue;

        const requestMethod = Reflect.getMetadata(METHOD_METADATA, handler) as
          RequestMethod | undefined;
        const method =
          requestMethod === undefined
            ? undefined
            : REQUEST_METHOD_TO_PERMISSION[requestMethod];
        if (!method) continue;

        const handlerPaths = this.toPaths(
          Reflect.getMetadata(PATH_METADATA, handler),
        );
        const isPublic = this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [handler, controller],
        );
        for (const controllerPath of controllerPaths) {
          for (const handlerPath of handlerPaths.length ? handlerPaths : ['']) {
            const path = this.joinPaths(controllerPath, handlerPath);
            discovered.set(`${method}:${path}`, {
              method,
              path,
              isPublic,
            });
          }
        }
      }
    }

    return [...discovered.values()].sort(
      (a, b) =>
        a.path.localeCompare(b.path) || a.method.localeCompare(b.method),
    );
  }

  private toPaths(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    return [typeof value === 'string' ? value : ''];
  }

  private joinPaths(controllerPath: string, handlerPath: string): string {
    const joined = `/${controllerPath}/${handlerPath}`.replace(/\/+/g, '/');
    const normalized = joined.length > 1 ? joined.replace(/\/+$/, '') : joined;
    return normalized || '/';
  }
}

import { PureModel } from 'datx';
import { useCallback, useEffect, useState } from 'react';

import { getDefaultConfig } from './defaults';
import { IConfigType } from './interfaces/IConfigType';
import { IHeaders } from './interfaces/IHeaders';
import { IInterceptor } from './interfaces/IInterceptor';
import { IPipeOperator } from './interfaces/IPipeOperator';
import { Response } from './Response';
import { IFetchOptions } from './interfaces/IFetchOptions';
import { deepCopy, interpolateParams, appendQueryParams, isBrowser } from './helpers/utils';
import { HttpMethod } from './enums/HttpMethod';
import { cacheInterceptor } from './interceptors/cache';
import { BodyType } from './enums/BodyType';
import { CachingStrategy } from './enums/CachingStrategy';
import { fetchInterceptor } from './interceptors/fetch';

interface IHookOptions {
  suspense?: boolean;
}

interface IRequestOptions {
  method: HttpMethod;
  url?: string;
  params: Record<string, string>;
  query: Record<string, string | Array<string> | object>;
  headers: IHeaders;
  body?: any;
  bodyType: BodyType;
}

export class BaseRequest<TModel extends PureModel = PureModel, TParams extends object = {}> {
  private _config: IConfigType = getDefaultConfig();
  private _options: IRequestOptions = {
    method: HttpMethod.Get,
    headers: {},
    query: {},
    params: {},
    bodyType: BodyType.Json,
  };

  public interceptors: Array<{ name: string; fn: IInterceptor<TModel> }> = [
    {
      fn: fetchInterceptor(this._config.fetchReference, this._config.serialize, this._config.parse),
      name: 'fetch',
    },
    {
      fn: cacheInterceptor<TModel>(
        isBrowser ? CachingStrategy.CacheFirst : CachingStrategy.NetworkOnly,
      ),
      name: 'cache',
    },
  ];

  constructor(baseUrl: string) {
    this._config.baseUrl = baseUrl;
  }

  public pipe<
    TNewModel extends PureModel | Array<PureModel> = TModel,
    TNewParams extends object = TParams
  >(...operators: Array<IPipeOperator | undefined>): BaseRequest<TNewModel, TNewParams> {
    const destinationPipeline = this.clone<TNewModel, TNewParams>();
    operators
      .filter(Boolean)
      .forEach((operator) => (operator as IPipeOperator)(destinationPipeline));

    return destinationPipeline as BaseRequest<TNewModel, TNewParams>;
  }

  private processBody(): object | string | FormData | undefined {
    if (!this._options.body) {
      return;
    }

    if (this._options.bodyType === BodyType.Json) {
      this._options.headers['content-type'] =
        this._options.headers['content-type'] || 'application/json';
      return this._options.body;
    } else if (this._options.bodyType === BodyType.Urlencoded) {
      this._options.headers['content-type'] =
        this._options.headers['content-type'] || 'application/x-www-form-urlencoded';
      return typeof this._options.body === 'string'
        ? this._options.body
        : appendQueryParams(
            '',
            this._options.body,
            this._config.paramArrayType,
            this._config.encodeQueryString,
          ).slice(1);
    } else if (this._options.bodyType === BodyType.Multipart) {
      this._options.headers['content-type'] =
        this._options.headers['content-type'] || 'multipart/form-data';
      return this._options.body instanceof FormData
        ? this._options.body
        : new FormData(this._options.body);
    } else {
      return this._options.body;
    }
  }

  public fetch(params?: TParams): Promise<Response<TModel>> {
    if (!this._options.url) {
      throw new Error('URL should be defined');
    }
    const urlParams = Object.assign({}, this._options.params, params);
    const url = interpolateParams(`${this._config.baseUrl}${this._options.url}`, urlParams);
    const processedUrl = appendQueryParams(
      url,
      this._options.query,
      this._config.paramArrayType,
      this._config.encodeQueryString,
    );

    const request: IFetchOptions = {
      url: processedUrl,
      method: this._options.method,
      data: this.processBody(),
      collection: this._config.collection,
      options: {
        networkConfig: {
          headers: this._options.headers,
        },
      },
      views: this._config.views,
      type: this._config.type,
    };

    const interceptorChain = this.interceptors.reduce((next, interceptor) => {
      return (options: IFetchOptions): Promise<Response<TModel>> => interceptor.fn(options, next);
    }, undefined);

    if (!interceptorChain) {
      throw new Error('Something went wrong');
    }

    return interceptorChain(request);
  }

  public useHook(
    params?: TParams,
    options?: IHookOptions,
  ): [Response<TModel> | null, boolean, string | Error | null] {
    const [loader, setLoader] = useState<Promise<Response<TModel>> | null>(null);
    const [value, setValue] = useState<Response<TModel> | null>(null);
    const [error, setError] = useState<string | Error | null>(null);

    const execute = useCallback(() => {
      const loaderPromise = this.fetch(params);
      setLoader(loaderPromise);
      setValue(null);
      setError(null);

      return loaderPromise
        .then((response) => {
          setValue(response);
          setLoader(null);
        })
        .catch((error) => {
          setError(error);
          setLoader(null);
        });
    }, [this.fetch, params]);

    useEffect(() => {
      execute();
    }, [execute]);

    if (options?.suspense && loader) {
      throw loader;
    }

    return [value, Boolean(loader), error];
  }

  public clone<TNewModel extends PureModel = TModel, TNewParams extends object = TParams>(
    BaseRequestConstructor: typeof BaseRequest = this.constructor as typeof BaseRequest,
  ): BaseRequest<TNewModel, TNewParams> {
    // Can't use `new BaseRequest`, because we would lose the overridden methods
    const clone = new BaseRequestConstructor<TNewModel, TNewParams>(this._config.baseUrl);

    // @ts-ignore
    clone.interceptors = deepCopy(this.interceptors);

    clone._config = deepCopy(this._config);
    clone._options = deepCopy(this._options);

    // Manually copy complex objects
    clone._config.collection = this._config.collection;
    clone._config.type = this._config.type;

    return clone as BaseRequest<TNewModel, TNewParams>;
  }
}

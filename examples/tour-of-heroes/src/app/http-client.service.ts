import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { Inject, Injectable, InjectionToken, Optional } from 'injection-js'

type AxiosClient = Pick<AxiosInstance, keyof AxiosInstance>

export type HttpClientConfig = Readonly<typeof defaultConfig>
export const HttpClientConfig = new InjectionToken('HttpClientConfig')

const defaultConfig = {} as AxiosRequestConfig

@Injectable()
export class HttpClient implements AxiosClient {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse<any>>
  }

  private _provider: AxiosInstance
  constructor(
    @Optional()
    @Inject(HttpClientConfig)
    config: HttpClientConfig
  ) {
    this._provider = axios.create({ ...config, ...defaultConfig })
    this.interceptors = this._provider.interceptors
    this.defaults = this._provider.defaults
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this._provider.request(config)
  }
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._provider.get(url, config)
  }
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._provider.delete(url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._provider.head(url, config)
  }
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._provider.post(url, data, config)
  }
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._provider.put(url, data, config)
  }
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._provider.patch(url, data, config)
  }
}

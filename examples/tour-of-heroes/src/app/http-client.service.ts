import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosProxyConfig,
  AxiosRequestConfig,
} from 'axios'
import { Inject, Injectable, InjectionToken, Optional } from 'injection-js'

export type HttpClientConfig = Readonly<typeof defaultConfig>
export const HttpClientConfig = new InjectionToken('HttpClientConfig')

const defaultConfig = {} as AxiosRequestConfig

@Injectable()
export class HttpClient {
  private provider: AxiosInstance
  constructor(
    @Optional()
    @Inject(HttpClientConfig)
    config: HttpClientConfig
  ) {
    this.provider = axios.create({ ...config, ...defaultConfig })
    // Object.assign(this, axios.create(config))
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this.provider.request(config)
  }
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.provider.get(url, config)
  }
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.provider.delete(url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.provider.head(url, config)
  }
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.provider.post(url, data, config)
  }
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.provider.put(url, data, config)
  }
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.provider.patch(url, data, config)
  }
}

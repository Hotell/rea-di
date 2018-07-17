import { Injectable } from 'injection-js'

import { MessageService } from './messages'
import { Hero } from './hero'
import { HEROES } from './mock-heroes'
import { HttpClient } from './http-client.service'

@Injectable()
export class HeroService {
  private heroesUrl = '/heroes'
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Promise<Hero[]> {
    // @TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes')

    return this.http
      .get<Hero[]>(this.heroesUrl)
      .then((response) => response.data)
      .catch(this.handleError('getHeroes', [] as Hero[]))

    // return Promise.resolve(HEROES)
  }

  getHero(id: number): Promise<Hero> {
    // TODO: send the message _after_ fetching the hero
    this.messageService.add(`HeroService: fetched hero id=${id}`)

    return this.http
      .get<Hero>(`${this.heroesUrl}/${id}`)
      .then((response) => {
        this.messageService.add(`fetched hero id=${id}`)
        return response.data
      })
      .catch(this.handleError(`getHero id=${id}`))

    // return Promise.resolve(HEROES.find(hero => hero.id === id) || ({} as Hero))
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Promise<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.add(`${operation} failed: ${error.message}`)

      // Let the app keep running by returning an empty result.
      return Promise.resolve(result as T)
    }
  }
}

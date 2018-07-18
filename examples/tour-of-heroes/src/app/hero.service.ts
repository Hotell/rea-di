import { Injectable } from 'injection-js'

import { MessageService } from './messages'
import { Hero } from './hero'
import { HttpClient } from './http-client.service'

@Injectable()
export class HeroService {
  private heroesUrl = '/heroes'
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Promise<Hero[]> {
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .then((response) => {
        this.messageService.add('HeroService: fetched heroes')
        return response.data
      })
      .catch(this.handleError('getHeroes', [] as Hero[]))
  }

  getHero(id: number): Promise<Hero> {
    return this.http
      .get<Hero>(`${this.heroesUrl}/${id}`)
      .then((response) => {
        this.messageService.add(`HeroService: fetched hero id=${id}`)

        return response.data
      })
      .catch(this.handleError(`getHero id=${id}`))
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero) {
    return this.http
      .put(`${this.heroesUrl}/${hero.id}`, hero)
      .then((response) => {
        this.messageService.add(`HeroService: updated hero id=${hero.id}`)

        return response
      })
      .catch(this.handleError<any>('updateHero'))
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Promise<Hero> {
    return this.http
      .post<Hero>(this.heroesUrl, hero)
      .then((response) => {
        this.messageService.add(`HeroService: added hero w/ id=${hero.id}`)

        return response.data
      })
      .catch(this.handleError<Hero>('addHero'))
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Promise<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id
    const url = `${this.heroesUrl}/${id}`

    return this.http
      .delete<Hero>(url)
      .then((response) => {
        this.messageService.add(`HeroService: deleted hero id=${id}`)

        return response.data
      })
      .catch(this.handleError<Hero>('deleteHero'))
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Promise<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return Promise.resolve([])
    }

    return this.http
      .get<Hero[]>(`${this.heroesUrl}/?q=${term}`)
      .then((response) => {
        this.messageService.add(`HeroService: found heroes matching "${term}"`)

        return response.data
      })
      .catch(this.handleError<Hero[]>('searchHeroes', []))
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
      this.messageService.add(
        `HeroService: ${operation} failed: ${error.message}`
      )

      // Let the app keep running by returning an empty result.
      return Promise.resolve(result as T)
    }
  }
}

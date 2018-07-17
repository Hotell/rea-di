import { Injectable } from 'injection-js'

import { MessageService } from './messages'
import { Hero } from './hero'
import { HEROES } from './mock-heroes'

@Injectable()
export class HeroService {
  constructor(private messageService: MessageService) {}

  getHeroes(): Promise<Hero[]> {
    // @TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes')

    return Promise.resolve(HEROES)
  }

  getHero(id: number): Promise<Hero> {
    // TODO: send the message _after_ fetching the hero
    this.messageService.add(`HeroService: fetched hero id=${id}`)
    return Promise.resolve(
      HEROES.find((hero) => hero.id === id) || ({} as Hero)
    )
  }
}

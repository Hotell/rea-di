import React, { Component, SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'

import { Hero } from '../hero'
import { uppercase } from '../shared'
import { HEROES } from '../mock-heroes'

import './heroes.css'
import { HeroDetail } from './hero-detail'
import { HeroService } from '../hero.service'

type Props = {
  heroService: HeroService
}
type State = Readonly<typeof initialState>
const initialState = {
  heroes: [] as Hero[],
  selectedHero: null as Hero | null,
}

export class Heroes extends Component<Props, State> {
  readonly state = initialState

  private handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget
    this.setState((prevState) => {
      return {
        selectedHero: { ...prevState.selectedHero, [name]: value } as Hero,
      }
    })
  }
  private onSelect(hero: Hero): void {
    this.setState((prevState) => ({ selectedHero: hero }))
  }
  private get selectedHeroRef(): string {
    const { selectedHero } = this.state
    return selectedHero ? String(selectedHero.id) : ''
  }
  render() {
    const { selectedHero, heroes } = this.state
    return (
      <>
        <h2>My Heroes</h2>

        <ul className="heroes">
          {heroes.map((hero) => (
            <li
              key={hero.id}
              className={hero === selectedHero ? 'selected' : ''}
              onClick={() => this.onSelect(hero)}
            >
              <Link to={`/detail/${hero.id}`}>
                <span className="badge">{hero.id}</span> {hero.name}
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }
  componentDidMount() {
    this.props.heroService.getHeroes().then((heroes) => {
      this.setState({ heroes })
    })
  }
}

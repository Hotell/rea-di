// tslint:disable:jsx-no-lambda
import React, { Component, createRef } from 'react'
import { Link } from 'react-router-dom'

import { Hero } from '../hero'
import { uppercase } from '../shared'

import { HeroService } from '../hero.service'
import { HeroDetail } from './hero-detail'
import './heroes.css'

type Props = {
  heroService: HeroService
}
type State = Readonly<typeof initialState>
const initialState = {
  heroes: [] as Hero[],
}

export class Heroes extends Component<Props, State> {
  readonly state = initialState

  private heroNameRef = createRef<HTMLInputElement>()

  render() {
    const { heroes } = this.state

    return (
      <>
        <h2>My Heroes</h2>

        <div>
          <label>
            Hero name:
            <input name="heroName" defaultValue="" ref={this.heroNameRef} />
          </label>
          {/* (click) passes input value to add() and then clears the input  */}
          <button onClick={() => this.add(this.heroNameRef.current!.value)}>
            add
          </button>
        </div>

        <ul className="heroes">
          {heroes.map((hero) => (
            <li key={hero.id}>
              <Link to={`/detail/${hero.id}`}>
                <span className="badge">{hero.id}</span> {hero.name}
              </Link>
              <button
                className="delete"
                title="delete hero"
                onClick={() => this.delete(hero)}
              >
                x
              </button>
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

  private delete(hero: Hero) {
    const heroesWithoutRemoved = this.state.heroes.filter((h) => h !== hero)

    this.props.heroService.deleteHero(hero).then(() => {
      this.setState((prevState) => ({
        heroes: [...heroesWithoutRemoved],
      }))
    })
  }

  private add(name: string) {
    name = name.trim()
    if (!name) {
      return
    }

    const newHero = { name } as Hero
    this.props.heroService.addHero(newHero).then((hero) => {
      this.setState(
        (prevState) => ({
          heroes: [...prevState.heroes, hero],
        }),
        () => (this.heroNameRef.current!.value = '')
      )
    })
  }
}

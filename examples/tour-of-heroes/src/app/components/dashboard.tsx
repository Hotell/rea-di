import './dashboard.css'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { HeroService } from '../hero.service'
import { Hero } from '../hero'

type Props = {
  heroService: HeroService
}
type State = Readonly<typeof initialState>

const initialState = {
  heroes: [] as Hero[],
}

export class Dashboard extends Component<Props, State> {
  readonly state = initialState
  render() {
    const { heroes } = this.state

    return (
      <>
        <div className="dashboard">
          <h3>Top Heroes</h3>
          <div className="grid grid-pad">
            {heroes.map((hero) => (
              <Link
                to={`detail/${hero.id}`}
                key={String(hero.name)}
                className="col-1-4"
              >
                <div className="module hero">
                  <h4>{hero.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    )
  }

  componentDidMount() {
    this.props.heroService
      .getHeroes()
      // This getHeroes reduces the number of heroes displayed to four (2nd, 3rd, 4th, and 5th).
      .then((heroes) => this.setState({ heroes: heroes.slice(1, 5) }))
  }
}

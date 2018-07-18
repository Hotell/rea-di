import React, { Component, createRef } from 'react'
import { Link } from 'react-router-dom'

import { HeroService } from '../hero.service'
import { Hero } from '../hero'

import './hero-search.css'

type Props = {
  heroService: HeroService
}
type State = Readonly<typeof initialState>

const initialState = {
  heroes: [] as Hero[],
}

export class HeroSearch extends Component<Props, State> {
  readonly state: State = initialState
  private searchResultRef = createRef<HTMLInputElement>()

  render() {
    const { heroes } = this.state
    return (
      <div className="hero-search">
        <h4>Hero Search</h4>

        <input
          ref={this.searchResultRef}
          placeholder="start typing..."
          name="searchBox"
          defaultValue=""
          onKeyUp={() => this.search(this.searchResultRef.current!.value)}
        />

        <ul className="search-result">
          {heroes.map((hero) => (
            <li key={String(hero.id)}>
              <Link to={`/detail/${hero.id}`}>{hero.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Push a search term into the observable stream.
  private search(term: string) {
    // this.searchTerms.next(term);
    this.props.heroService.searchHeroes(term).then((response) => {
      this.setState({ heroes: response })
    })
  }
}

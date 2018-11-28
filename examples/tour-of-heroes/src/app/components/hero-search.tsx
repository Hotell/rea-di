// tslint:disable:jsx-no-lambda

import React, { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import { Subject } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators'

import { Hero } from '../hero'
import { HeroService } from '../hero.service'

import './hero-search.css'

type Props = {
  heroService: HeroService
}
type State = Readonly<typeof initialState>

const initialState = {
  heroes: [] as Hero[],
}

const DEBOUNCE_TIME = 300
export class HeroSearch extends Component<Props, State> {
  readonly state: State = initialState

  private readonly searchResultRef = createRef<HTMLInputElement>()
  private readonly searchTerms = new Subject<string>()
  private readonly onUnmount$ = new Subject()
  private readonly heroes$ = this.searchTerms.pipe(
    takeUntil(this.onUnmount$),
    // wait 300ms after each keystroke before considering the term
    debounceTime(DEBOUNCE_TIME),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // switch to new search observable each time the term changes
    switchMap((term: string) => this.props.heroService.searchHeroes(term))
  )

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

  componentDidMount() {
    this.heroes$.subscribe((heroes) => {
      this.setState({ heroes })
    })
  }
  componentWillUnmount() {
    this.onUnmount$.complete()
  }

  // Push a search term into the observable stream.
  private search(term: string) {
    this.searchTerms.next(term)
  }
}

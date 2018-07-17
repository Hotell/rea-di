import React, { Component, SyntheticEvent } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import './hero-detail.css'

import { Hero } from '../hero'
import { uppercase } from '../shared'
import { HeroService } from '../hero.service'

type Props = {
  hero?: Hero | null
  heroService: HeroService
} & RouteComponentProps<{
  id: string
}>
type State = Readonly<ReturnType<typeof getInitialState>>

const getInitialState = ({ hero = null }: Props) => ({
  hero,
})

export class HeroDetail extends Component<Props, State> {
  readonly state = getInitialState(this.props)

  private handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const name = event.currentTarget.name as 'name'
    this.setState((prevState) => ({
      hero: { ...prevState.hero, [name]: value } as Hero,
    }))
  }
  render() {
    const { hero } = this.state

    return (
      <div className="hero-detail">
        {hero ? (
          <div>
            <h2>{uppercase(hero.name)} Details</h2>
            <div>
              <span>id: </span>
              {hero.id}
            </div>
            <div>
              <label>
                name:
                <input
                  name="name"
                  placeholder="name"
                  value={hero.name}
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <button onClick={() => this.goBack()}>go back</button>
          </div>
        ) : null}
      </div>
    )
  }
  componentDidMount() {
    this.getHero()
  }

  private getHero(): void {
    const id = Number(this.props.match.params.id)
    this.props.heroService.getHero(id).then((hero) => this.setState({ hero }))
  }
  private goBack(): void {
    this.props.history.goBack()
  }
}

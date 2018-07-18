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
type FormFieldKeys = 'name'

const getInitialState = ({ hero = null }: Props) => ({
  hero,
})

export class HeroDetail extends Component<Props, State> {
  readonly state = getInitialState(this.props)

  private handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const name = event.currentTarget.name as FormFieldKeys

    this.setState((prevState) => ({
      hero: { ...prevState.hero!, [name]: value },
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
            <button onClick={() => this.save(hero)}>save</button>
            <button onClick={() => this.goBack()}>go back</button>
          </div>
        ) : (
          'getting Hero detail...'
        )}
      </div>
    )
  }
  componentDidMount() {
    this.getHero()
  }

  private save(hero: Hero) {
    this.props.heroService.updateHero(hero).then(() => this.goBack())
  }
  private getHero(): void {
    if (this.state.hero) {
      return
    }

    const id = Number(this.props.match.params.id)
    this.props.heroService.getHero(id).then((hero) => this.setState({ hero }))
  }
  private goBack() {
    this.props.history.goBack()
  }
}

import { Stateful } from '@martin_hotell/rea-di'
import { Injectable } from 'injection-js'

type State = Readonly<typeof initialState>
const initialState = {
  messages: [] as string[],
}
@Injectable()
export class MessageService extends Stateful<State> {
  readonly state = initialState

  add(message: string) {
    this.setState((prevState) => ({
      messages: [...prevState.messages, message],
    }))
  }

  clear() {
    this.setState((prevState) => ({ messages: [] }))
  }
}

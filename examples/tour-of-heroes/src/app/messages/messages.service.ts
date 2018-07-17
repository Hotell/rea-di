import { Injectable } from '@martin_hotell/rea-di/node_modules/injection-js'
import { WithState } from '@martin_hotell/rea-di'

type State = Readonly<typeof initialState>
const initialState = {
  messages: [] as string[],
}
@Injectable()
export class MessageService extends WithState<State> {
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

import React, { Component } from 'react'
import { Inject } from '@martin_hotell/rea-di'

import './messages.css'

import { MessageService } from './messages.service'

export class Messages extends Component {
  render() {
    return (
      <div className="messages">
        <h2>Messages</h2>
        <div>
          <Inject providers={{ messageService: MessageService }}>
            {({ messageService }) =>
              messageService.state.messages.length ? (
                <>
                  <button
                    className="clear"
                    onClick={() => messageService.clear()}
                  >
                    clear
                  </button>
                  {messageService.state.messages.map((message, idx) => (
                    <div key={`${message}-${idx}`}>{message}</div>
                  ))}
                </>
              ) : (
                <p>There are no messages in store...</p>
              )
            }
          </Inject>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Inject } from '@martin_hotell/rea-di'

import './messages.css'

import { MessageService } from './messages.service'

export class Messages extends Component {
  render() {
    return (
      <div className="messages">
        <Inject providers={{ messageService: MessageService }}>
          {({ messageService }) =>
            messageService.state.messages.length ? (
              <div>
                <h2>Messages</h2>
                <button
                  className="clear"
                  onClick={() => messageService.clear()}
                >
                  clear
                </button>
                {messageService.state.messages.map((message, idx) => (
                  <div key={`${message}-${idx}`}>{message}</div>
                ))}
              </div>
            ) : null
          }
        </Inject>
      </div>
    )
  }
}

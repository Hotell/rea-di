import { TypeMap } from '../types'
import { CounterService, Logger } from './setup/services'

describe(`types`, () => {
  describe(`TypeMap`, () => {
    const providersTokenMap = {
      logger: Logger,
      counter: CounterService,
    }

    it(`should properly annotate object map with Type/Class tokens`, () => {
      type Test = TypeMap<typeof providersTokenMap>

      const expected: Test = {
        counter: CounterService,
        logger: Logger,
      }

      expect(providersTokenMap).toEqual(expected)
    })
  })
})

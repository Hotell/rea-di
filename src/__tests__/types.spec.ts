import { ProvidersMap } from '../types'
import { CounterService, Logger } from './setup/services'

describe(`types`, () => {
  describe(`ProviderMaps`, () => {
    const providersTokenMap = {
      logger: Logger,
      counter: CounterService,
    }

    it(`should properly annotate object map with Type/Class tokens`, () => {
      type Test = ProvidersMap<typeof providersTokenMap>
      const expected: Test = {
        counter: CounterService,
        logger: Logger,
      }

      expect(providersTokenMap).toEqual(expected)
    })
  })
})

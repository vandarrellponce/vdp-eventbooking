import bookingResolver from './bookingResolver.js'
import eventResolver from './eventResolver.js'

export default {
  ...bookingResolver,
  ...eventResolver
}

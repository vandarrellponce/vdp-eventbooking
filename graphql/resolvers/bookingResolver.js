import Booking from '../../models/booking.js'
import { getEvent, transformBooking } from './helpers.js'

export default {
  bookings: async () => {
    try {
      const bookings = await Booking.find({})
      /*   .populate('event', '_id title description ')
              .populate('user', 'email _id')
              .execPopulate() */

      return bookings.map((booking) => {
        return transformBooking(booking)
      })
    } catch (error) {
      throw error
    }
  },

  bookEvent: async (args) => {
    try {
      const booking = new Booking({
        event: args.eventId,
        user: '5fa8ef01289c5a58404a22f5'
      })

      const savedBooking = await booking.save()
      return transformBooking(savedBooking)
    } catch (error) {
      throw error
    }
  },

  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId)
      const event = await getEvent(booking.event)

      await booking.remove()
      return event
    } catch (error) {
      throw error
    }
  }
}

import Booking from '../../models/booking.js'
import Event from '../../models/event.js'
import User from '../../models/user.js'

const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event._id,
        date: new Date(event.date).toISOString(),
        creator: getUser.bind(this, event.creator)
      }
    })
  } catch (error) {
    throw error
  }
}

const getEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return {
      ...event._doc,
      _id: event._id,
      date: new Date(event.date).toISOString(),
      creator: getUser.bind(this, event.creator)
    }
  } catch (error) {
    throw error
  }
}

// manual population for user
const getUser = async (userId) => {
  try {
    const result = await User.findById(userId)
    return {
      ...result._doc,
      _id: result._id,
      createdEvents: getEvents.bind(this, result.createdEvents)
    }
  } catch (err) {
    throw err
  }
}

export default {
  events: async () => {
    try {
      const events = await Event.find({})

      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._id,
          date: new Date(event.date).toISOString(),
          creator: getUser.bind(this, event._doc.creator)
        }
      })
    } catch (error) {
      throw error
    }
  },

  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date)
      })

      const user = await User.findById('5fa8ef01289c5a58404a22f5')
      if (!user) throw new Error('User not found')
      user.createdEvents.push(event._id)
      event.creator = user._id

      await user.save()
      const savedEvent = await event.save()

      return {
        ...savedEvent._doc,
        _id: savedEvent._id,
        date: new Date(savedEvent.date).toISOString(),
        creator: getUser.bind(this, savedEvent.creator)
      }
    } catch (error) {
      console.log(error.message)
      throw error
    }
  },

  createUser: async (args) => {
    try {
      // Check if user with given email exists, if does throw error
      const user = await User.findOne({ email: args.userInput.email })
      if (user) throw new Error('Email already in use')

      const newUser = new User({
        email: args.userInput.email,
        password: args.userInput.password
      })
      const savedUser = await newUser.save()
      return { ...savedUser._doc, password: null }
    } catch (error) {
      console.log(error.message)
      throw error
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find({})
      /*   .populate('event', '_id title description ')
        .populate('user', 'email _id')
        .execPopulate() */

      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking._id,
          event: getEvent.bind(this, booking.event),
          user: getUser.bind(this, booking.user),
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString()
        }
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
      return {
        ...savedBooking._doc,
        _id: savedBooking._id,
        event: await getEvent(savedBooking.event),
        user: await getUser(savedBooking.user),
        createdAt: new Date(savedBooking.createdAt).toISOString(),
        updatedAt: new Date(savedBooking.updatedAt).toISOString()
      }
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

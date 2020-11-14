import Event from '../../models/event.js'
import User from '../../models/user.js'

export const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return transformEvent(event)
    })
  } catch (error) {
    throw error
  }
}

export const getEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return transformEvent(event)
  } catch (error) {
    throw error
  }
}

export const getUser = async (userId) => {
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

export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking._id,
    event: getEvent.bind(this, booking.event),
    user: getUser.bind(this, booking.user),
    createdAt: new Date(booking.createdAt).toISOString(),
    updatedAt: new Date(booking.updatedAt).toISOString()
  }
}
export const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event._id,
    date: new Date(event.date).toISOString(),
    creator: getUser.bind(this, event._doc.creator)
  }
}

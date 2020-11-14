import Event from '../../models/event.js'
import User from '../../models/user.js'
import { transformEvent } from './helpers.js'

export default {
  events: async () => {
    try {
      const events = await Event.find({})

      return events.map((event) => {
        return transformEvent(event)
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

      return transformEvent(savedEvent)
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
  }
}

import express from 'express'
import dotenv from 'dotenv'
import expressGraphql from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'
import Event from '../models/event.js'

const app = express()

dotenv.config()
app.use(express.json())

const graphqlHttp = expressGraphql.graphqlHTTP
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!                
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }
            type RootMutation {
                createEvent(eventInput: EventInput) : Event
            }
            schema{
                query: RootQuery
                mutation: RootMutation
            }
        `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find({})
          return events
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
          const savedEvent = await event.save()
          return savedEvent
        } catch (error) {
          console.log(error.message)
          throw error
        }
      }
    },
    graphiql: true
  })
)

const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((connection) => {
    console.log('Database connected to -', connection.connection.host)

    app.listen(PORT, () => {
      console.log(`Server Listening on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error.message))

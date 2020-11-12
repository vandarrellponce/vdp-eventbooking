import express from 'express'
import dotenv from 'dotenv'
import expressGraphql from 'express-graphql'
import mongoose from 'mongoose'
import schema from '../graphql/schema/schema.js'
import resolvers from '../graphql/resolvers/resolvers.js'

const app = express()

dotenv.config()
app.use(express.json())

const graphqlHttp = expressGraphql.graphqlHTTP
app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: resolvers,
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

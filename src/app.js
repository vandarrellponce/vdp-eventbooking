import express from 'express'
import dotenv from 'dotenv'
import expressGraphql from 'express-graphql'
import { buildSchema } from 'graphql'

const app = express()

dotenv.config()
app.use(express.json())

const graphqlHttp = expressGraphql.graphqlHTTP
app.use(
	'/graphql',
	graphqlHttp({
		schema: buildSchema(`
            type RootQuery{
                events: [String!]!
            }
            type RootMutation{
                createEvent(name: String) : String
            }
            schema{
                query: RootQuery
                mutation: RootMutation
            }
        `),
		rootValue: {
			events: () => ['a', 'b'],
			createEvent: (args) => {
				const eventName = args.name
				return eventName
			},
		},
		graphiql: true,
	})
)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server Listening on port ${PORT}`)
})

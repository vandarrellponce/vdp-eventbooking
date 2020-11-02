import express from 'express';
import dotenv from 'dotenv';
import expressGraphql from 'express-graphql';
import { buildSchema } from 'graphql';

const events = [];

const app = express();

dotenv.config();
app.use(express.json());

const graphqlHttp = expressGraphql.graphqlHTTP;
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
      events: () => events,
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const app = express()
require("dotenv").config();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const csv = require("csv-parser");
const connectDB = require('./src/config/db.config')
connectDB()
const port = process.env.PORT
mongoose.set('strictQuery', false);

app.use(cors())
app.use(express.json())

const fakeDatabase = {};
// Define your GraphQL schema
const schema = buildSchema(`
  # A message object with a string field
  type Message {
    id: ID!
    content: String
  }
  type Users {
    id:ID!
    Fname:String
    Lname:String
  }

  # The query type, with a field to retrieve a message by ID
  type Query {
    message(id: ID!): Message
    users(id: ID!): Users
  }

  # The mutation type, with fields to create, update, and delete messages
  type Mutation {
    importData:String
    createMessage(input: String!): Message
    createUser(Fname: String!,Lname: String!): Users
    updateMessage(id: ID!, input: String!): Message
    deleteMessage(id: ID!): Message
  }
`);
// Define your GraphQL resolvers


const importDataFromGBD =()=>{
  fs.createReadStream('GBD-sidiali.csv')
  .pipe(csv())
  .on('data', (row) => {
      MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
          if (err) {
              console.log(err);
              return;
          }else{
          const db = client.db("AL-MADA-DBM");
          db.collection("test").insertOne(row, function(err, result) {
          client.close();
          });
          }
      });
      }).on('end', () => {
          console.log('CSV file successfully processed');
      });
  return "Data imported";
}
const root = {
  importData:importDataFromGBD,
  message: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    return fakeDatabase[id];
  },
  users: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    return fakeDatabase[id];
  },
  createMessage: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = { id, content: input };
    return fakeDatabase[id];
  },

  createUser: ({ Fname,Lname }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = { id, Fname: Fname,Lname: Lname };
    return fakeDatabase[id];
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    fakeDatabase[id].content = input;
    return fakeDatabase[id];
  },
  deleteMessage: ({ id }) => {
    const message = fakeDatabase[id];
    delete fakeDatabase[id];
    return message;
  },
};


// Use the express-graphql middleware to expose your GraphQL API
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log('listening for requests on port :'+port)
})
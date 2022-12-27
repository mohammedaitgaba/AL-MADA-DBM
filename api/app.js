const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const app = express()
require("dotenv").config();

const connectDB = require('./src/config/db.config')
connectDB()
const port = process.env.PORT
mongoose.set('strictQuery', false);

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json([
    {
      "id":"1",
      "title":"Book Review: The Bear & The hound"
    },
    {
      "id":"2",
      "title":"Game Review: Pokemon Brillian Diamond"
    },
    {
      "id":"3",
      "title":"Show Review: Alice in Borderland"
    }
  ])
})
app.use('/api/users',require('./src/routes/test.routes'))

app.listen(port, () => {
  console.log('listening for requests on port :'+port)
})

require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

console.log('🔥 SERVER FILE LOADED - CHECK IF YOU SEE THIS 🔥')

app.get('/login', (req, res) => {
    console.log('LOGIN ROUTE HIT!')
    res.status(200).send('Login TESTING 111213')  // Added status code
})

app.get('/', (req, res) => {
  res.status(200).send('TESTING 12345 NEW VERSIONnnn')
})

app.get('/twitter', (req, res) => {
    res.status(200).send('Twitter TESTING 67890')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
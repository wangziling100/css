const express = require('express')  
const app = express()

app.use((request, response, next) => {  
  console.log(request.headers)
  next()
})

const mongoose = require('mongoose')
const connetionString = process.env.MONGO_DB_URI

// mongodb connetion
mongoose.connect(connetionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log('Error Database')
    console.error(err)
  })

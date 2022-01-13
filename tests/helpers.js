const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    content: 'TestNote1',
    important: true,
    date: new Date()
  },
  {
    content: 'TestNote2',
    important: false,
    date: new Date()
  }
]

const getAllContentsFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

module.exports = {
  initialNotes,
  api,
  getAllContentsFromNotes
}

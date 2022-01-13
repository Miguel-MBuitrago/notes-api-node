const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const {
  initialNotes,
  api,
  getAllContentsFromNotes
} = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note have TestNote1 as content', async () => {
    const { contents } = await getAllContentsFromNotes()
    expect(contents).toContain('TestNote1')
  })
})

describe('create a note', () => {
  test('is possible with a valid note', async () => {
    const newNote = {
      content: 'newNote',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete a note', () => {
  test('is possible if exist', async () => {
    const { response: firstResponse } = await getAllContentsFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentsFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('is not possible if not exist', async () => {
    await api
      .delete('/api/notes/1234')
      .expect(400)

    const { response } = await getAllContentsFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

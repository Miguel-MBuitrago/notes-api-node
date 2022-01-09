module.exports = (err, request, response, next) => {
  console.error(err)

  if (err.name === 'CastError') {
    response.status(400).send({
      error: 'id used is malformed'
    })
  } else {
    response.status(500).end()
  }
}

const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = error.message

  // Check for Mongoose bad ObjectId
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    message = `Resource not found`
    statusCode = 404
  }

  res
    .status(statusCode)
    .json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    })
}

export { notFound, errorHandler }
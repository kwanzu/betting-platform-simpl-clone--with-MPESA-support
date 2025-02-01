export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (err: unknown) => {
  if (err instanceof AppError) {
    return { message: err.message, statusCode: err.statusCode }
  }

  console.error("Unexpected error:", err)
  return { message: "An unexpected error occurred", statusCode: 500 }
}


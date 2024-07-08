import { Response } from 'express'

class ResponseHandler {
  static success(res: Response, data?: any, statusCode = 200, message?: string) {
    const responseObject: Record<string, any> = {
      timestamp: new Date().toISOString(),
      success: "success",
      status: statusCode,
      message: message,
    }

    if (message) {
      responseObject.message = message
    }

    if (data !== null && data !== undefined) {
      responseObject.data = data
    }

    res.status(statusCode).json(responseObject)
  }
}

export { ResponseHandler }

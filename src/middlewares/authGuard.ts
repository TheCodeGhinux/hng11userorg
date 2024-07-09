import { Response, NextFunction } from 'express'
import { TokenPayload, verifyToken } from '../utils/jwtUtils'
import { AppDataSource } from '../app-data-source'
import { User } from '../enitity'
import { UnauthorizedError } from './errorhandler'

export const authGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ message: 'No token provided, please sign in' })
  }

  try {
    const decoded = verifyToken(token) as TokenPayload
    // console.log('Decoded token:', decoded)

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ userId: decoded.userId })

    if (!user) {
      throw new UnauthorizedError('User not authorized for this action')
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message })
    }
    throw new UnauthorizedError('Failed to authenticate user')
  }
}

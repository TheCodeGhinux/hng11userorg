import { Response, NextFunction } from 'express'
import { TokenPayload, verifyToken } from '../utils/jwtUtils'
import { AppDataSource } from '../app-data-source'
import { User } from '../enitity'

export const authGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = verifyToken(token) as TokenPayload
    console.log('Decoded token:', decoded)

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ userId: decoded.userId })

    if (!user) {
      console.log('User not found for token:', decoded.userId)
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Failed to authenticate token:', error)
    return res.status(401).json({ message: 'Failed to authenticate token' })
  }
}

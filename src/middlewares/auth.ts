import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwtUtils'
import { AppDataSource } from '../app-data-source'
import { User } from '../enitity'

interface JwtPayload {
  userId: string
}

export const authenticate = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  // console.log(token);
  

  try {
    const decoded = verifyToken(token)
    console.log(decoded);
    
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ userId: decoded.userId })

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Failed to authenticate token' })
  }
}

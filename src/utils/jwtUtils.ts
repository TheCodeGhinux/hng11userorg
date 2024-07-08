import jwt, { JwtPayload } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { User } from '../enitity'
import bcrypt from 'bcrypt'
dotenv.config()

// interface TokenPayload extends JwtPayload {
//   userId: string
// }

export interface TokenPayload extends JwtPayload {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

// Replace with your secret key
const JWT_SECRET = process.env.SECRET_KEY

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    JWT_SECRET,
    {
      expiresIn: '1h', // Token expiration time
    }
  )
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (err) {
    console.error('Error verifying token:', err)
    throw new Error('Token verification failed')
  }
}

  export const comparePassword =  async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
  }
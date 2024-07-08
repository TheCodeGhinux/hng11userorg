import { User } from '../enitity'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

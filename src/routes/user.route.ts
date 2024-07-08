import { Router } from 'express'
import {  
  getAllUsers,
  getUserByEmail,
  getUserByFirstName,
  getUserById,
} from '../controllers/user.controller'
import { validateCreateUserData } from '../middlewares/validations/user.zod'
import { authenticate } from '../middlewares/auth'
import { createUser, loginUser } from '../controllers/auth.controlller'

const router = Router()


router.get('/users', getAllUsers)
router.get('/users/:firstName', getUserByFirstName)
router.get('/users/:email', getUserByEmail)
router.get('/users/:id', getUserById)
router.post('/auth/register', createUser, validateCreateUserData)
router.post('/auth/login', loginUser, authenticate)
// router.get('/user', getAllUsers)

router.get('/profile', authenticate, (req: any, res) => {
  const user = req.user
  console.log(user);
  
  res.json({ user: req.user })
})

export default router
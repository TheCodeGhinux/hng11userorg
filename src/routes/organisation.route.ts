import { Organisation } from './../enitity/organisation.entity'
import { Router } from 'express'
import {
  addUserToOrganisation,
  getAllOrganisation,
  getUserOrganisation,
  removeUserFromOrganisation,
  createOrganisation,
} from '../controllers/organisation.controller'
import { authGuard } from '../middlewares/authGuard'

const router = Router()

router.get('/organisations', authGuard,  getAllOrganisation)
router.get('/organisations', authGuard,  getAllOrganisation)
router.get('/organisations/:orgId', authGuard, getUserOrganisation)
// router.post('/organisations', createOrganisation)
router.post('/organisations/:orgId/users', authGuard, addUserToOrganisation)
router.post('/organisations', authGuard,  createOrganisation)
// router.get('/users/:firstName', getUserByFirstName)
// router.get('/users/:email', getUserByEmail)
// router.get('/user', getAllUsers)

// router.post('/api/organisations/addUser', authGuard, addUserToOrganisation)
router.post(
  '/api/organisations/removeUser',
  authGuard,
  removeUserFromOrganisation
)
module.exports = router

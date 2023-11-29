import { Router } from 'express'

import {
  activateUser,
  createSingleUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
  updateBan,
  updateSingleUser,
} from '../controllers/userController'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'
import { uploadUser } from '../middlewares/uploadFile'

const router = Router()

router.post('/process-register', uploadUser.single('image'), isLoggedOut, processRegisterUser)

router.get('/', isLoggedIn, isAdmin, getAllUsers)

router.get('/:userName', isLoggedIn, getSingleUser)

router.post('/', uploadUser.single('image'), createSingleUser)

router.delete('/:userName', isLoggedIn, isAdmin, deleteSingleUser)

router.put('/:userName', updateSingleUser)

router.post('/process-register', processRegisterUser)

router.post('/activate', isLoggedOut, activateUser)

router.put('/updateBan/:userName', updateBan)

export default router

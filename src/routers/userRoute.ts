import { Router } from 'express'

import {
  activateUser,
  banUser,
  createSingleUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
  unbanUser,
  updateSingleUser,
} from '../controllers/userController'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'

const router = Router()

router.post('/process-register',
  //uploadUser.single('image'),
  isLoggedOut,
  processRegisterUser
);

router.get('/', isLoggedIn, isAdmin, getAllUsers)

router.get('/:userName', isLoggedIn, getSingleUser)

router.post('/', createSingleUser)

router.delete('/:userName', isLoggedIn, isAdmin, deleteSingleUser)

router.put('/:userName', updateSingleUser)

router.post('/process-register', processRegisterUser)

router.post('/activate', isLoggedOut, activateUser)

router.put('/ban/:userName', isLoggedIn, isAdmin, banUser)

router.put('/unban/:userName', isLoggedIn, isAdmin, unbanUser)

export default router;


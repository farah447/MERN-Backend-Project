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

const router = Router()

router.get('/', getAllUsers)

router.get('/:userName', getSingleUser)

router.post('/', createSingleUser)

router.delete('/:userName', deleteSingleUser)

router.put('/:userName', updateSingleUser)

router.post('/process-register', processRegisterUser)

router.post('/activate', activateUser)

router.put('/ban/:userName', banUser)

router.put('/unban/:userName', unbanUser)

export default router;


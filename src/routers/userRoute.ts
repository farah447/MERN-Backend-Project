import { Router } from 'express'

import {
    activateUser,
  createSingleUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
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

export default router;


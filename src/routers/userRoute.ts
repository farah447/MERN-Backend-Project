import { Router } from "express";
import { 
    createSingleUser, 
    deleteSingleUser, 
    getAllUsers, 
    getSingleUser, 
    updateSingleUser
} from "../controllers/userController";

const router = Router();

router.get('/', getAllUsers);

router.get('/:userName', getSingleUser);

router.post('/', createSingleUser);

router.delete('/:userName', deleteSingleUser);

router.put('/:userName', updateSingleUser);

export default router;

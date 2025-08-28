import express from 'express'
import { registerUser, loginUser, getCurrentUser } from '../controllers/userController.js'

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/current', getCurrentUser)

export default router;
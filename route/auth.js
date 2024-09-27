import express from 'express';
const router = express.Router()

// import cotroller
import { GetUser, Login, Logout, Register, update_profile } from '../controller/AuthController.js'
import { AuthMid } from '../middleware/AuthMid.js';


router.post('/login', Login);
router.get('/logout', AuthMid, Logout);
router.post('/register', Register);
router.post('/update_profile', update_profile);
router.get('/get_user', AuthMid, GetUser)


export default router;

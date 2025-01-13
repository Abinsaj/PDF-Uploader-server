import { Router } from "express";
import controller from '../Controller/userController.js'
import multer from 'multer'
import verifyToken from "../Middleware/tokenMiddleware.js";

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

router.post('/signup',controller.sendOtp)
router.post('/otp', controller.verifyOtp)
router.post('/login',controller.verifyLogin)
router.post('/pdf-upload',upload.single('pdf-file'),verifyToken, controller.pdfUpload)
router.post('/getpages',verifyToken, controller.getSelectedPage)

export default router
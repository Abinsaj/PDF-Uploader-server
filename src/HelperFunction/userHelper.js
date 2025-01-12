import sendOTPMail from "../Config/emailConfig.js"
import userModel from "../Models/userSchema.js"
import AppError from "../utils/AppError.js"
import bcrypt from 'bcrypt'
import {createToken, createRefreshToken} from '../Config/jwtConfig.js'
import uploadPDF from "../Config/cloudinaryConfig.js"
import pdfModel from "../Models/pdfSchema.js"
import axios from 'axios'
import { PDFDocument } from 'pdf-lib'

const registerUserhelper = async (data) => {
    try {
        const userData = await userModel.findOne({ email: data.email })
        if (userData) {
            throw AppError.badRequest('User already exist')
        }
        if (data.password !== data.confirmPassword) {
            throw AppError.conflict('password does not match')
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(data.password, saltRounds)

        const generateOtp = Math.floor(100000 + Math.random() * 900000).toString()

        const isMailSend = await sendOTPMail(data.email, generateOtp)

        if (!isMailSend) {
            throw AppError('Failed to send Otp to the mail')
        }

        const time = new Date()
        const otp_time = new Date(time.getTime() + 2 * 60 * 1000)

        return {
            name: data.name,
            email: data.email,
            hashPassword,
            generateOtp,
            otp_time
        }

    } catch (error) {
        if (error instanceof AppError) {
            throw error
        } else {
            throw new AppError('Failed to register user',
                500,
                error.message || 'An unexpected error occured'
            )
        }
    }
}

const verifyOtpHelper = async (otp, data) => {
    try {
        console.log('its hreree')
        console.log(otp,'=-=-=-==-==-==-=-==-',data.generateOtp,'this is the otps')
        const currentTime = new Date()
        const expiryTime = new Date(data.otp_time)
        if (currentTime > expiryTime) {
            console.log('time sxpired')
            throw AppError.notFound('Otp has been expired')
        }
        if (otp !== data.generateOtp) {
            throw AppError.badRequest('Wrong OTP')
        }
        console.log('otp is correct')
        const userInfo = {
            name: data.name,
            email: data.email,
            password: data.hashPassword
        }

        await userModel.create(userInfo)
        return true

    } catch (error) {
        if (error instanceof AppError) {
            throw error
        } else {
            throw new AppError('Failed to verify OTP',
                500,
                error.message || 'An unexpected error occured'
            )
        }
    }
}

const verifyLoginHelper = async(data)=>{
    try {
        const userExist = await userModel.findOne({email: data.email})
        if(!userExist){
            throw AppError.notFound('Invalid Login credentials')
        }

        const compare = await bcrypt.compare(data.password, userExist.password)
        if(!compare){
            throw AppError.notFound('Incorrect Password')
        }

        const userInfo = {
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email
        }

        const accessToken = createToken(userExist._id)
        const refreshToken = createRefreshToken(userExist._id)
        console.log(accessToken,'...',refreshToken,'these are the tokens') 
        
        return {accessToken, refreshToken, userInfo}
        
    } catch (error) {
        if (error instanceof AppError) {
            throw error
        } else {
            throw new AppError('Failed to Login',
                500,
                error.message || 'An unexpected error occured'
            )
        }
    }
}

const pdfUploadhelper = async(file, userId)=>{
    try {

        const uploadfile = await uploadPDF(file)
        console.log(uploadfile,'blah blah blah')

        const newPdf = new pdfModel({
            userId,
            fileName:file.originalname,
            pdf:{
                url: uploadfile.secure_url,
                public_id: uploadfile.public_id
            }
        })

        const savedPdf = await newPdf.save()
        console.log(savedPdf,'this is the saved pdf')
        return savedPdf;

    } catch (error) {
        if (error instanceof AppError) {
            throw error
        } else {
            throw new AppError('Failed to upload pdf',
                500,
                error.message || 'An unexpected error occured'
            )
        }
    }
}

const extractPages = async(pages, pdfId)=>{
    try {
        const pdf = await pdfModel.findOne({_id: pdfId})
        if(!pdf){
            throw AppError.notFound('No found')
        }
        const response = await axios.get(pdf.pdf.url,  { responseType: 'arraybuffer' })
        console.log(response,'this is teh response in the helper function')
        const pdfBytes = response.data

        const existingPdfDoc = await PDFDocument.load(pdfBytes);
        const newPdfDoc = await PDFDocument.create();
    
        for (const pageIndex of pages) {
          const [copiedPage] = await newPdfDoc.copyPages(existingPdfDoc, [pageIndex - 1]); 
          newPdfDoc.addPage(copiedPage);
        }

        const newPdfBytes = await newPdfDoc.save();
        console.log(newPdfBytes,'this is the new pdf bytes')

        const tempPath = path.join(__dirname, 'extracted.pdf');
    fs.writeFileSync(tempPath, newPdfBytes);

    console.log(tempPath,'this is the temp path')

    
    fs.unlinkSync(tempPath);


    } catch (error) {
        
    }
}

export default {
    registerUserhelper,
    verifyOtpHelper,
    verifyLoginHelper,
    pdfUploadhelper,
    extractPages
}
import userHelper from "../HelperFunction/userHelper.js"
import AppError from "../utils/AppError.js"

const sendOtp = async(req,res)=>{
    try {
        const {email} = req.body;
        const result = await userHelper.sendOtpHelper(email)

            res.status(200).json(result)
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            })
        }else{
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server Error'
            })
        }
    }
}

const registerClient = async(req, res)=>{
    try {
        const {data}= req.body
        const result = await userHelper.registerUserhelper(data)
        if(result){
            const {name, email, hashPassword,
                generateOtp,
                otp_time} = result
            res.cookie('signupData',{name, email, hashPassword, generateOtp, otp_time},{
                httpOnly: true,
                secure: false,
                maxAge: 5 * 60 * 1000
            })

            res.status(200).json({success: true, message: 'OTP sent to your email' });
        }
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            })
        }else{
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server Error'
            })
        }
    }
}

const verifyOtp = async(req,res)=>{
    try {
        console.log(req.body,'this is the data')
        const {otp} = req.body
        const {data} = req.body
        console.log(data,'this is the data')
        const result = await userHelper.verifyOtpHelper(otp, data)
        if(result){
            console.log('success')
            res.clearCookie('signupData',{httpOnly: true, secure: false})

            res.status(200).json({success: true, message: 'OTP verified successfully, and user registered.'})
        }
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            })
        }else{
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server Error'
            })
        }
    }
}

const verifyLogin = async(req, res)=>{
    try {
        const {data} = req.body
        const result = await userHelper.verifyLoginHelper(data)
        if(!result){
            res.status(HTTP_statusCode.Unauthorized).json({success:false, message: "Invalid login credentials" })
        }
        res.cookie('AccessToken', result.accessToken,{
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 15*60* 1000,
        })
        res.cookie('RefreshToken',result.refreshToken,{
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 10000
        })

       
        res.status(200).json({success: true, message: 'Login Successful', result})
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            })
        }else{
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server Error'
            })
        }
    }
}

const pdfUpload = async(req, res)=>{
    try {
        const {userId} = req.query;
        const file = req.file
        const result = await userHelper.pdfUploadhelper(file, userId)
        if(result){
            res.status(200).json({success: true, message:'Pdf uploaded successfully', result})
        }
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            })
        }else{
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server Error'
            })
        }
    }
}

const getSelectedPage = async(req, res)=>{
    try {
        const {pages,pdfId} = req.body
        console.log(pages,'falsfaf',pdfId,'it sherereererehowhglwhgha')
        const result = await userHelper.extractPages(pages, pdfId)
    } catch (error) {
        
    }
}

export default {
    registerClient,
    verifyOtp,
    verifyLogin,
    pdfUpload,
    getSelectedPage,
    sendOtp
}
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret_key = process.env.JWT_SECRET_KEY

const createToken = (userId)=>{
    return jwt.sign({userId},secret_key,{expiresIn: '10m'});
}

const createRefreshToken = (userId)=>{
    return jwt.sign({userId},secret_key,{expiresIn: '7d'});
}

export  {createToken, createRefreshToken}
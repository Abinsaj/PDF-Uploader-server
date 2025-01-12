import dotenv from 'dotenv'

import { createToken } from '../Config/jwtConfig.js'
import jwt from 'jsonwebtoken'

const secret_key = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    try {
        const accessToken = req.cookies.AccessToken;
        console.log(accessToken, ' this is the access token')
        if (accessToken) {
            jwt.verify(accessToken, secret_key, async (err, decoded) => {
                if (err) {
                    await handleRefreshToken(req, res, next)
                } else {
                    next();
                }
            })
        } else {
            await handleRefreshToken(req, res, next);
        }
    } catch (error) {
        res.status(401).json({ message: "Access Denied, token is not valid" });
    }
}

const handleRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.RefreshToken;
        console.log(refreshToken,'this is the refresh token')
        if (refreshToken) {
            jwt.verify(refreshToken, secret_key, async (err, decoded) => {
                if (err) {
                    res.status(401).json({ message: 'Accesss Denied, Refresh token not valid' })
                } else {
                    const { userId } = decoded;
                    const accessToken = createToken(userId)
                    res.cookie('AccessToken', accessToken, {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                        maxAge: 15 * 60 * 1000
                    });

                    next();
                }
            })
        } else {
            res.status(401).json({ message: 'No Refresh token' })
        }
    } catch (error) {
        res.status(401).json(({ message: "Access Denied, token is not valid" }));
    }
}

export default verifyToken
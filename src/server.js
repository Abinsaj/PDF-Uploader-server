import express from 'express'
import {createServer} from 'http'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './Routes/routes.js'
import ConnectDB from './Config/databaseConfig.js'
import dotenv from 'dotenv'


dotenv.config()
const app = express()

ConnectDB()

const server = createServer(app)

app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/',router)

server.listen(5050,()=>{
    console.log('server is running on port no 5050')
})
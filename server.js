import express from 'express'
import cors from 'cors'
import env from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRouter from './routers/user.router.js'

env.config()

const app = express()
const corsAllow = {
    origin: 'http://localhost:5173',
    methods: 'POST, GET, PATCH, PUT, DELETE',
    credentials: true
}
const dbConn = () => {
    mongoose.connect(process.env.MONGO_STRING).then(() => {
        console.log('DB is connected')
    }).catch((err) => {
        console.log("Error:" + err.message)
    })
}

app.use(express.json())
app.use(cookieParser())
app.use('/api/user', userRouter)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Error in server: ' + err.message)
    } else {
        dbConn()
        console.log(`Server is live on ${process.env.PORT}`)
    }
})
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(
    cors(
        {
            origin:process.env.CORS_ORIGIN,
            credentials:true,   
        }
    )
)



app.get('/',(req,res) => {
    res.send("hello  your server is started.")
})

export {app}
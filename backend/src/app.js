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

import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"
import categoryRouter from "./routes/category.routes.js"
import addressRouter from './routes/address.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/address', addressRouter)

export {app}
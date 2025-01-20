import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import session from "express-session"
import passport  from "../src/middleware/passport.config.js"

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

app.use(
    session(
        {
            secret: process.env.SESSION_SECRET ,
            resave: false,
            saveUninitialized:false,
            cookie:{
                secure: process.env.NODE_ENV === "production", 
                httpOnly:true,
                maxAge: 1000 * 60 * 60, 
            }
        }
    )
)




// Render EJS template

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views' ))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(req,res) => {
    res.send("hello  your server is started.")
})

import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"
import categoryRouter from "./routes/category.routes.js"
import addressRouter from './routes/address.routes.js'
import cartRouter from "./routes/cart.routes.js"

app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/address', addressRouter)
app.use('/api/v1/cart', cartRouter)



export {app}
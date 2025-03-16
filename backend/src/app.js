import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import session from "express-session"

dotenv.config()


const app = express()

app.locals.cache = false;


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(
    cors(
        {
       
            origin: process.env.NODE_ENV === 'production' 
            ? 'https://timber-trend.onrender.com/'
            : 'http://localhost:5173',
            credentials:true,   
        }
    )
)




app.use(
    session(
        {
            secret: process.env.SESSION_SECRET  ,
            resave: false,
            saveUninitialized:false,
            cookie:{
                secure: process.env.NODE_ENV === "production", 
                httpOnly:true,
                maxAge: 1000 * 60 * 60, 
                sameSite: "Strict",
            }
        }
    )
)





// Render EJS template

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname,   'views' ))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) =>{
    res.redirect("/api/v1/admin/auth/login")
})

app.get('/register', (req,res) => {
    res.redirect('api/v1/admin/auth/register')
})



import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"
import categoryRouter from "./routes/category.routes.js"
import addressRouter from './routes/address.routes.js'
import cartRouter from "./routes/cart.routes.js"
import adminRouter from "./routes/admin.routes.js"
import contactRouter from "./routes/contactMe.routes.js"
import dashboardRouter from './routes/dashboard.js'


app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/address', addressRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/contact', contactRouter)




export {app}
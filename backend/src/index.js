import { app } from "./app.js";
import connectionInstance from "./config/db.js";

connectionInstance()
.then(() => {
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error)=> {
    console.log('Error connecting to database', error);
    
}) 
// import { app } from "./app.js";
// import connectionInstance from "./config/db.js";

// connectionInstance()
// .then(() => {
//     app.listen(process.env.PORT, ()=>{
//         console.log(`Server is running on port ${process.env.PORT}`);
//     })
// })
// .catch((error)=> {

//     console.log('Error connecting to database', error || error.message);
    
// }) 

import { app } from "./app.js";
import connectionInstance from "./config/db.js";


await connectionInstance().catch((error) => {
    console.error('Error connecting to database', error || error.message);
});


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}


export default app;

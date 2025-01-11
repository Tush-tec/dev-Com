import mongoose, { mongo } from "mongoose"


const connectionInstance = async() => {
    try {
        const mongoConnect = await mongoose.connect(`${process.env.MONGO_URI}/gitCom`)
        console.log(`Db is connect  to instance of: ${mongoConnect.connection.host}`)
    } catch (error) {
        console.error("MonogDb Connection Failed",    error)
        process.exit(1)        
    }
}

export default connectionInstance
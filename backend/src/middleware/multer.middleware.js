import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import os from "os"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        const uploadPath = process.env.NODE_ENV === 'production' 
            ? os.tmpdir()   
            : path.join(__dirname, '..', 'public');  

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const randomFile = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${randomFile}-${file.originalname}`);
    }

});

const upload = multer({ storage });

export default upload;

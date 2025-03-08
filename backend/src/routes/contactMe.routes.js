import { Router } from "express";
import { createContact, getContact } from "../controller/contactMe.controller.js";



const router = Router()

router.route('/create-contact').post(
    createContact
)

router.route('/get-contact').get(
    getContact

)

export default router;
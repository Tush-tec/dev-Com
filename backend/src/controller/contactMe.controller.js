import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContactMe } from "../models/contactMe.model.js";

const createContact = asyncHandler(async (req, res) =>{

    const {name, email, message, phoneNumber } = req.body

    if(!name  ) {
        throw new ApiError(
            400,
            "Please provide all Name fields"
        )
    }
    if( !email  ) {
        throw new ApiError(
            400,
            "Please provide all Email fields"
        )
    }
    if( !message ) {
        throw new ApiError(
            400,
            "Please provide all message fields"
        )
    }
    if(! phoneNumber ) {
        throw new ApiError(
            400,
            "Please provide all Phone Number fields"
        )
    }

    const creatContact  = await ContactMe.create(
        {
            name,
            email,
            phoneNumber,
            message,

        }
    )

    if(!creatContact){
        throw new ApiError(
            400,
            "Failed to create contact"
        )
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            creatContact,
            "Contact created successfully"
        )
    )
})


const getContact = asyncHandler(async(req,res) =>{



    const contact = await ContactMe.find()
    if(!contact){
        throw new ApiError(
            404,
            "No contact found"
        )
    }


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            contact,
            "Contact found successfully"
        )
    )
            

})


export{
    createContact,
    getContact
}



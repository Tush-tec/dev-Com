import mongoose, { isValidObjectId } from "mongoose";
import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAddress = asyncHandler(async (req, res) => {

    const { addressLine, state, phoneNumber } = req.body;
    console.log("Received Request Body:", req.body);

    const owner = req.user?._id;

       if (!owner) {
        throw new ApiError(401, "You are not logged in");
    }


    if (!addressLine) {
        throw new ApiError(400, "Address details are required.");
    }


    const { street, houseNumber, apartmentNumber, locality, district, city, pincode } = addressLine;


    if (!street || !houseNumber || !locality || !district || !city || !pincode || !state || !phoneNumber) {
        throw new ApiError(400, "Please provide all required address fields.");
    }

 


    const address = await Address.create({
        addressLine: {
            street,
            houseNumber,
            apartmentNumber,
            locality,
            district,
            city,
            pincode
        },
        state,
        phoneNumber,
        owner
    });

    if (!address) {
        throw new ApiError(500, "Failed to create address");
    }

    return res.status(200).json(
        new ApiResponse(200, address, "Address created successfully")
    );
});


const getAllAddress = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

    // Creating an aggregation pipeline object
    const aggregate = Address.aggregate([
        {
            $match: {
                owner: req.user?._id
            }
        }
    ]);

    const paginationOptions = {
        page: pageNumber,
        limit: limitNumber,
        pagination: true,
        customLabels: {
            totalDocs: "totalItems",
            docs: "addresses",
        },
    };

    const aggregatePaginate = await Address.aggregatePaginate(aggregate, paginationOptions);

    if (!aggregatePaginate.addresses.length) {
        throw new ApiError(404, "No address found.");
    }

    return res.status(200).json(
        new ApiResponse(200, aggregatePaginate, "Address retrieved successfully")
    );
});


const getAddressById = asyncHandler(async(req,res) =>{

    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const options = {
        page,
        limit,
    };

    const addressMatch = Address.aggregate([
        { $match: { owner: req.user._id } }, 
        { $sort: { createdAt: -1 } }, 
    ]);
    

    const result = await Address.aggregatePaginate(addressMatch, options);


        if (result.docs.length === 0) {
            throw new ApiError(404, "No addresses found for this user");
        }



        return res.status(200).json(
            new ApiResponse(200, {
                addresses: result.docs,
                currentPage: result.page,
                totalPages: result.totalPages,
                totalAddresses: result.totalDocs,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
            }, "User addresses retrieved successfully")
        );
})

const updateAddress = asyncHandler(async(req,res) =>{

    const {addressId} = req.params
    const {addressLine, state, } = req.body

    if(!addressId){
        throw new ApiError(
            400,
            "Address id is required",
        )
    }

    const address =  await Address.findByIdAndUpdate(
       { _id: addressId,
        owner : req.user?._id
       },
        {
            $set :{
                addressLine,
                state,
            }
        },
        {
            new: true
        }
    )

    if(!address){
        throw  new ApiError(
            404,
            "Address not found, check your address id",
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            address,
            "Address updated successfully",
        )
    )
})

const deleteAddressById = asyncHandler(async(req,res) =>{
    const {addressId} = req.params
    
    if(!addressId){
        throw new ApiError(
            400,
            "Address id is required",
        )
    }

    const remove = await Address.findByIdAndDelete({ _id: addressId, owner : req.user?._id})

    if(!remove){
        throw new ApiError(
            404,
            "Address not found, check your address id",
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {deletebyId: remove},
            "Address deleted successfully",
        )    
    )
})

export{
    createAddress,
    getAllAddress,
    getAddressById,
    updateAddress,
    deleteAddressById
}
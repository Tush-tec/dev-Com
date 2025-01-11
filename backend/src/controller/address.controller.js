import mongoose from "mongoose";
import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAddress =  asyncHandler(async(req,res) =>{

    const {addressLine, state} = req.body
    const owner  = req.user?.Id

    if(!addressLine, state){
        throw  new ApiError(
            400,
            "Please provide address line and state",
        )
    }

    if(!owner){
        throw new ApiError(
            401,
            "You are not logged in",
        )
    }


    const address = await Address.create(
        addressLine,
        state,
        owner
    )

    if(!address){
        throw new ApiError(
            500,
            "Failed to create address",
        )    
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            address,
            "Address created successfully",
        )
    )
})

const getAllAddress = asyncHandler(async(req,res) =>{

    const {page = 1, limit=10} = req.query

    const aggregate =  await Address.aggregate(
        [
            {
                $match:{
                    owner: req.user?._id
                }
            }
        ]
    )

    const paginationOptions = {
        page: Math.max(page, 1), 
        limit: Math.max(limit, 1), 
        pagination: true,
        customLabels: {
          totalDocs: "totalItems",
          docs: "categories",
        },
    };

    const aggregatePaginate = await Address.aggregatePaginate(
        aggregate,paginationOptions

    )

    if(!aggregatePaginate){
        throw new ApiError(
            500,
            "No address found. aggregation pagination is failed!",
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            aggregatePaginate,
            "Address retrieved successfully",
        )    
    )
})

const getAddressById = asyncHandler(async(req,res) =>{
    const {addressId} = req.params

    const address = await Address.findById(
        {
            _id: addressId,
            owner : req.user?._id
        }
    )

    if(!address){
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
            address,
            "Address retrieved successfully by id ",
        )
    )
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
        throw ApiError(
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
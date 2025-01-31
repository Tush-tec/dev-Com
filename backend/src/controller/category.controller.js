import mongoose, { isValidObjectId }  from 'mongoose'
import { Category } from '../models/category.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'


const createCategory = asyncHandler(async(req,res)=>{

    const {categoryName, } = req.body

    if(!categoryName){
        throw new ApiError(
            400,
            'Category name is required',
            
        )
    }

    const category =  await Category.create(
        {
            categoryName,
            owner:req.user?._id
        }
    )

    if(!category){
        throw new ApiError(
            500,
            'Failed to create category',
        )
    }

    res.redirect("/api/v1/categories/category" )

    // return res
    // .status(200)
    // .json(
    //     new ApiResponse(
    //         200,
    //         category,
    //         'Category created successfully',
    //     )
    // )
})

const getCategory = asyncHandler(async(req,res)=>{

    const {page = 1, limit = 10} = req.query
    
    const categoryAggregate =  await Category.aggregate([
        {
            $match:{}
        }
    ])

    const paginationOptions = {
        page: Math.max(page, 1), 
        limit: Math.max(limit, 1), 
        pagination: true,
        customLabels: {
          totalDocs: "totalItems",
          docs: "categories",
          limit: "itemsPerPage",
          page: "currentPage",
          totalPages: "totalPages",
          pagingCounter: "serialNumberStartFrom",
          hasPrevPage: "hasPreviousPage",
          hasNextPage: "hasNextPage",
          prevPage: "previousPage",
          nextPage: "nextPage",
        },
    };

    const aggregatePaginate = await Category.aggregatePaginate(categoryAggregate, paginationOptions)

    if(!aggregatePaginate){
        throw new ApiError(
            404,
            'Category not found',
        )
    }

    // res.render("category", categoryName
    // )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            'Category found',
            aggregatePaginate
        )
    )
})

const getCategoryById = asyncHandler(async(req,res) =>{
    const {categoryId} = req.params

    if(!categoryId){
        throw new ApiError(
            400,
            'Category id is required',
        )
    }

    const category = await Category.findById(categoryId)

    if(!category){
        throw new ApiError(
            404,
            'Category not found',
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            category,
            'Category found',
           
        )
    )
})

const updateCategory  = asyncHandler(async(req,res) =>{
    const {categoryId} = req.params
    const {name} = req.body

    if(!categoryId){
        throw new ApiError(
            400,
            'Category id is required',
        )
    }

    if(!name){
        throw new ApiError(
            400,
            'Name is required',

        )
    }

    const category  = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set:{
                name
            }
        },
        {
            new :true
        }
    )

    if(!category){
        throw new ApiError(
            404,
            'Category not found',
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(    
            200,
            category,
            'Category updated',

        )   
    )
})

const deleteCategory = asyncHandler(async(req,res) =>{
    const {categoryId} = req.params

    if(!categoryId){
         throw new ApiError(
            400,
            'Category id is required to delete',
        )
    }

     const category = await Category.findByIdAndDelete(
            categoryId
        )

        if(!category){
            throw new ApiError(
                404,
                'Category not found',
            )
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {deleteCategory: category},
                'Category deleted',
            )
        )
})

export{
    createCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}
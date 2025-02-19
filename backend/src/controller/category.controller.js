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

    res.redirect("/api/v1/categories/category")



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

const getCategory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Convert query params to numbers and ensure they are valid
    const currentPage = Math.max(parseInt(page), 1);
    const itemsPerPage = Math.max(parseInt(limit), 1);

    // Fetch categories with pagination
    const categories = await Category.find({})
        .skip((currentPage - 1) * itemsPerPage) 
        .limit(itemsPerPage)
        .exec(); 

    // Get total count for pagination
    const totalItems = await Category.countDocuments();

    // Render categoryList.ejs with data
    res.render("categoryList", {
        categories, // Pass categories to EJS
        pagination: {
            totalItems,
            currentPage,
            totalPages: Math.ceil(totalItems / itemsPerPage),
            hasNextPage: currentPage < Math.ceil(totalItems / itemsPerPage),
            hasPrevPage: currentPage > 1,
        },
    });
});



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
    const {categoryName} = req.body

    if(!categoryId){
        throw new ApiError(
            400,
            'Category id is required',
        )
    }

    if(!categoryName){
        throw new ApiError(
            400,
            'Name is required',

        )
    }

    const category  = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set:{
                categoryName
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

     res.redirect('/api/v1/categories/get-categaory')

    // return res
    // .status(200)
    // .json(
    //     new ApiResponse(    
    //         200,
    //         category,
    //         'Category updated',

    //     )   
    // )
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

        // res.redirect('/categories'); // Redirect to category list after deletion


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
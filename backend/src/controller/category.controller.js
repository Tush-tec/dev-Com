import mongoose, { isValidObjectId }  from 'mongoose'
import { Category } from '../models/category.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Product } from '../models/product.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'


const createCategory = asyncHandler(async (req, res) => {

    
  
    const { categoryName } = req.body;
  
    if (!categoryName) {
      throw new ApiError(400, "Category name is required");
    }
  

    if (!req.files || !req.files.image || req.files.image.length === 0) {
      throw new ApiError(400, "Main image is required");
    }
  
    const image = req.files.image[0].path; 
    
  
    const uploadToCloudinary = await uploadOnCloudinary(image);
  
    if (!uploadToCloudinary) {
      throw new ApiError(400, "Failed to upload image to Cloudinary");
    }
  
    const category = await Category.create({
      categoryName,
      image: uploadToCloudinary.url, 
      owner: req.user?._id,
    });
  
    if (!category) {
      throw new ApiError(500, "Failed to create category");
    }
    
     res.redirect("/api/v1/categories/category")


   
  });
  
  

const getCategoryForAdmin = asyncHandler(async (req, res) => {
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

const getAllCategory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Convert query params to numbers and ensure they are valid
    const currentPage = Math.   max(parseInt(page), 1);
    const itemsPerPage = Math.max(parseInt(limit), 1);

    try {
        // Fetch categories with pagination
        const categories = await Category.find({})
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec();

        // Get total count for pagination
        const totalItems = await Category.countDocuments();

        // Create response object correctly
        return res.status(200).json(new ApiResponse(
            200,  // Changed from 201 to 200
            {
                categories,
                pagination: {
                    totalItems,
                    currentPage,
                    totalPages: Math.ceil(totalItems / itemsPerPage),
                    hasNextPage: currentPage < Math.ceil(totalItems / itemsPerPage),
                    hasPrevPage: currentPage > 1,
                },
            },

            "Here is your Categories Data",

        ));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});


const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
  
    if (!isValidObjectId(categoryId)) {
      throw new ApiError(
        400, "Invalid category ID"
    )}
  

    const products = await Product.find({ category: categoryId })
      .select("name price stock mainImage")
      .sort({ createdAt: -1 }) 
      .limit(50); 
  
    if (!products.length) {
      throw new ApiError(
        404, 
        "No products found in this category"
    )}
  
    return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        products, 
        "Products fetched successfully"
    ));
  });
  

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

        res.redirect('/api/v1/categories/get-categaory')


        // return res
        // .status(200)
        // .json(
        //     new ApiResponse(
        //         200,
        //         {deleteCategory: category},
        //         'Category deleted',
        //     )
        // )
})

export{
    createCategory,
    getCategoryForAdmin,
    getAllCategory,
    getProductsByCategory,
    updateCategory,
    deleteCategory
}
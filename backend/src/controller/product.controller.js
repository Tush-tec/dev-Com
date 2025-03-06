import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Category } from "../models/category.model.js";
import { getMongoosePaginationOptions } from "../utils/helper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const createProduct = asyncHandler(async (req, res) => {

  const { name, description, category, price, stock } = req.body;

  const categoryToBeAdded = await Category.findById(category);

  if (!categoryToBeAdded) {
    throw new ApiError(404, "Category does not exist");
  }

  if (!req.files?.mainImage || !req.files?.mainImage.length) {

    throw new ApiError(400, "Main image is required");
  }

  const mainImageUrl =  req.files?.mainImage[0]?.path

  if(!mainImageUrl){
    throw new ApiError(400, "Main image is required")
  }

  const uploadToCloudinary = await uploadOnCloudinary(mainImageUrl);

  if(!uploadToCloudinary){
    throw new ApiError(400, "Failed to upload image to cloudinary")
  }
  
  let product
  try {
    const product = await Product.create({

      name,
      description,
      stock,
      price,
      category,
      owner: req.user?._id,
      mainImage: uploadToCloudinary.url,

    });

    
    if (!product) {
      throw new ApiError(400, "Failed to create product");
    }

     
    res.redirect('/api/v1/products/products');

  } catch (error) {

    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal Server Error", error });

  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  const { page = 1, limit =20 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
    throw new ApiError(400, "Invalid page or limit values.");
  }

  const products = await Product.find()
    .skip((pageNumber - 1) * limitNumber) 
    .limit(limitNumber) 
    .populate('category');  

  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / limitNumber);

  console.log(`Page: ${pageNumber}, Limit: ${limitNumber}, Products Fetched: ${products.length}`);
  console.log( pageNumber < totalPages,  );
  

  return res.status(200).json(
    new ApiResponse(
      200,
      products,
      `Here are your products`,
      {
        totalProducts,
        totalPages,
        currentPage: pageNumber,
        hasMore: pageNumber < totalPages, 
      }
    )
  );
});



const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
    throw new ApiError(400, "Invalid page or limit values.");
  }

  const products = await Product.find()
    .skip((pageNumber - 1) * limitNumber) 
    .limit(limitNumber) 
    .populate('category');  

  const totalProducts = await Product.countDocuments();

  console.log(`Page: ${pageNumber}, Limit: ${limitNumber}, Products Fetched: ${products.length}`);

  console.log(products);
  


  res.render("ProductsList", {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limitNumber),
    currentPage: pageNumber
  })

  // return res.status(200).json(
  //   new ApiResponse(
  //     200,
  //     products,
  //     `Here are your products`,
  //     {
  //       totalProducts,
  //       totalPages: Math.ceil(totalProducts / limitNumber),
  //       currentPage: pageNumber
  //     }
  //   )
  // );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const categories =  await Category.findById(product.category);

   res.render("productEdit", { product, categories });

});

const getIndividualProduct= asyncHandler(async (req,res) =>{

  const {productId} = req.params
  console.log(productId);
  

  if (!isValidObjectId(productId)) {
    throw new ApiError
    (
      400, 
      "Invalid product ID"
    )
  }

  const product = await Product.aggregate([
    {
      $match :{
        _id: new mongoose.Types.ObjectId(productId)
      }
    },
    {
      $lookup:{
        from: "categories",
        localField:"category",
        foreignField:"_id",
        as: "categoryDetails"
      }
    }
  ])
  console.log(product);
  console.log(product.length);
  

  if(!product.length){
    throw  new ApiError(
      404,
      "Product not found"
    )
  }

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      product[0],
      "Here's you Product"
    )
  )
})

const updateProductById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product id, in Update Product by Id");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const { category: categoryId } = req.body;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const productImagePath =  req.file?.path
  let newImageUrl = product.mainImage

  if (productImagePath) {
    
    if (product.mainImage) {

      const publicId = product.mainImage.split("/").pop().split(".")[0]; 
      const deleteResult = await cloudinary.uploader.destroy(publicId);

      if (deleteResult.result !== "ok") {

        throw new ApiError(500, "Failed to upload new image on  Cloudinary");
      }
    }

   
    const uploadedImage = await uploadOnCloudinary(productImagePath);

    if (!uploadedImage?.url) {
      throw new ApiError(500, "Failed to upload the new image to Cloudinary");
    }

    newImageUrl = uploadedImage.url;

  }
 

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        ...req.body, 
        mainImage: newImageUrl
      } 
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(500, "Failed to update the product");
  }

  res.redirect('/api/v1/products/products');


});

const deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product id, in Delete Product by Id");
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found in Delete Product by Id");
  }

  const categories =  await Category.findById(product.category);



  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        "Product deleted successfully in Delete Product by Id"
      )
    );
});

const getFeaturedProduct = asyncHandler(async (req, res) => {
  const product = await Product.find({ isFeatured: true }).limit(10);

  if (!product) {
    throw new ApiError(404, "Product not found in Get Featured Product");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product found in Get Featured Product")
    );
});

const incrementProductViews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product id, in Increment Product Views");
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  );

  if(!product){
    throw new ApiError(
      404,
      "Product not found in Increment Product Views"
    )
  }

  return res 
  .status(200)
  .json(
    new ApiResponse(200, product, "Product views incremented successfully in Increment Product Views")
  )
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const category = await Category.findById(categoryId).select("name _id");

  if (!category) {
    throw new ApiError(404, "Category does not exist");
  }

  const productAggregate = Product.aggregate([
    {

      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    },
  ]);

  const products = await Product.aggregatePaginate(
    productAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalProducts",
        docs: "products",
      },
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...products, category },
        "Category products fetched successfully"
      )
    );
});


export {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getFeaturedProduct,
  getIndividualProduct,
  incrementProductViews,
  getProductsByCategory,
  getProducts
};

import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Category } from "../models/category.model.js";
import { getMongoosePaginationOptions } from "../utils/helper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from 'uuid';
import { getLocalPath, getStaticFilePath } from "../utils/helper.js";
import path from "path";

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
      owner: req.user?._id,
      mainImage: uploadToCloudinary.url,
    });

    
    if (!product) {
      throw new ApiError(400, "Failed to create product");
    }

     
    res.redirect('/api/v1/products/products');
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error" });
    }
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});


const getAllProduct = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50} = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

     const products = await Product.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate('category'); 

     console.log(products)   
    const totalProducts = await Product.countDocuments();

    if (!products || products.length === 0) {
      throw new ApiError(404, "Products not found");
    }

    res.render("showProduct", {
      products,           
      totalProducts,     
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: pageNumber,
      pageTitle: "All Products"
    });

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
  //  Check if a new image is provided in the request
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

  //res.render("productDelete", { product, categories});

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
      // match the products with provided category
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
  incrementProductViews,
  getProductsByCategory
};

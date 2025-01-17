import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { getMongoosePaginationOptions } from "../utils/helper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from 'uuid';
import { getLocalPath, getStaticFilePath } from "../utils/helper.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock } = req.body;
  // const sku = req.body.sku || uuidv4(); 

  // const findCategory = await Category.find(category);
  // console.log(findCategory)
  const categoryToBeAdded = await Category.findById(category);

  if (!categoryToBeAdded) {
    throw new ApiError(404, "Category does not exist");
  }

  // Check if user has uploaded a main image
  if (!req.files?.mainImage || !req.files?.mainImage.length) {
    throw new ApiError(400, "Main image is required");
  }

  const mainImageUrl =  req.files?.mainImage[0]?.filename
  const mainImageLocalPath = req.files?.mainImage[0]?.filename

  // Check if user has uploaded any subImages if yes then extract the file path
 
  // const subImages =
  //   req.files.subImages && req.files.subImages?.length
  //     ? req.files.subImages.map((image) => {
  //         const imageUrl = getStaticFilePath(req, image.filename);
  //         const imageLocalPath = getLocalPath(image.filename);
  //         return { url: imageUrl, localPath: imageLocalPath };
  //       })
  //     : [];

  // const owner = req.user?._id;
  // console.log(owner)
  let product
  try {
    const product = await Product.create({
      name,
      description,
      stock,
      price,
      owner: req.user?._id,
      mainImage: {
        url: mainImageUrl,
        localPath: mainImageLocalPath,
      },
      category,
      // sku,  // Use the generated SKU or the provided SKU/
    });

    
    if (!product) {
      throw new ApiError(400, "Failed to create product");
    }
  
    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error" });
    }
    return res.status(500).json({ message: "Internal Server Error", error });
  }
  
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});


const getAllProduct = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Convert to numbers to ensure proper pagination
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Get products with pagination
  const products = await Product.find()
    .skip((pageNumber - 1) * limitNumber) 
    .limit(limitNumber); 

  const totalProducts = await Product.countDocuments();

  if (!products || products.length === 0) {
    throw new ApiError(404, "Products not found");
  }

  // console.log({totalProducts,
  //   products,
  //   totalPages: Math.ceil(totalProducts / limitNumber), 
  //   currentPage: pageNumber})

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
     { totalProducts,
      products,
      totalPages: Math.ceil(totalProducts / limitNumber), 
      currentPage: pageNumber},
      "product fetched successfully"

    )
  )
});


const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product id");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product found successfully"));
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

  let imageUrl;
  if (req.file) {
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        throw new ApiError(500, "Error deleting old image from Cloudinary");
      }
    }

    try {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      imageUrl = uploadedImage?.url;
    } catch (error) {
      throw new ApiError(500, "Error uploading image to Cloudinary");
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: { ...req.body, image: imageUrl || product.image } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
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

// const getFeaturedProduct = asyncHandler(async (req, res) => {
//   const product = await Product.find({ isFeatured: true }).limit(10);

//   if (!product) {
//     throw new ApiError(404, "Product not found in Get Featured Product");
//   }
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, product, "Product found in Get Featured Product")
//     );
// });

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

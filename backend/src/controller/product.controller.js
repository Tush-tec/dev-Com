import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    tags,
    dimensions,
    weight,
    vendor,
    variants,
  } = req.body;

  // Validate required fields
  if (!title || !price || !totalStock) {
    throw new ApiError(400, "Title, Price, and Total Stock are required");
  }

  if (salePrice && salePrice >= price) {
    throw new ApiError(400, "Sale price must be less than the original price");
  }

  // Validate and upload images
  const imagesLocalPaths = req.files?.image?.map((file) => file.path);
  if (!imagesLocalPaths || imagesLocalPaths.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const uploadedImages = await Promise.all(
    imagesLocalPaths.map((path) => uploadOnCloudinary(path))
  );

  if (!uploadedImages || uploadedImages.some((img) => !img)) {
    throw new ApiError(
      400,
      "Failed to upload one or more images to Cloudinary"
    );
  }

  // Create product
  const newProduct = await Product.create({
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    tags,
    dimensions,
    weight,
    vendor,
    variants,
    images: uploadedImages.map((img) => img.url),
  });

  if (!newProduct) {
    throw new ApiError(500, "Failed to create product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newProduct, "Product created successfully"));
});

const getAllProduct = asyncHandler(async (req, res) => {
  // Get Value for query:
  const { category, brand, price, tags, page = 1, limit = 10 } = req.query;

  const filters = {
    ...(category && { category: { name: category } }),
    ...(brand && { brand: { name: brand } }),
    ...(price && { price: { $lte: Number(price) } }),
    ...(tags && { tags: { $in: tags.split(",") } }),
  };

  // filter out undefined value
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(cleanedFilters).length === 0) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Please provide at least one filter to search products"
        )
      );
  }

  try {
    const filterProduct = await Product.find(cleanedFilters)
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("images")
      .populate("variants")
      .populate("vendor", "name")
      .populate("category", "name")
      .populate("brand", "name")
      .populate("tags", "name");

    if (!filterProduct || filterProduct.length === 0) {
      throw new ApiError(404, "No product found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, filterProduct, "Product found successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
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

export {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getFeaturedProduct,
  incrementProductViews,
};

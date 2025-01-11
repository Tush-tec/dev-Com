import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
        type: String
    },
    category: {
        type: String 
    },
    brand: { 
        type: String 
    },
    price: { 
        type: Number 
    },
    salePrice: { 
        type: Number 
    },
    discountPercentage: {
      type: Number,
      default: function () {
        return ((this.price - this.salePrice) / this.price) * 100;
      },
    },
    totalStock: { 
        type: Number
    },
    stockStatus: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: function () {
        return this.totalStock > 0 ? "in-stock" : "out-of-stock";
      },
    },
    averageReview: { type: Number },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    dimensions: {
      height: { type: Number },
      width: { type: Number },
      depth: { type: Number },
    },
    weight: { type: Number },
    vendor: {
      name: { type: String },
      contactInfo: { type: String },
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    expirationDate: { type: Date },
    variants: [
      {
        color: { type: String },
        size: { type: String },
        stock: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      default: "active",
    },
    sku: { type: String, unique: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);

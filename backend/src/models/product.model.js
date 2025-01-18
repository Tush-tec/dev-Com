  import mongoose, { Schema } from "mongoose";
  import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

  const productSchema = new Schema(
    {
      description: {
        type: String,
        required: true,
      },
      mainImage: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      price: {
        type: Number,
      },
      stock: {
        type: Number, 
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
      subImages: {
        type: String
      },
    },
    { timestamps: true }
  );

  productSchema.plugin(mongooseAggregatePaginate);

  export const Product = mongoose.model("Product", productSchema);
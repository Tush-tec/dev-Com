  import mongoose, { Schema } from "mongoose";
  import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

  const productSchema = new Schema(
    {
      description: {
        type: String,
        required: true,
      },
      mainImage: {
        // required: true,
        type: {
          url: String,
          localPath: String,
        },
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
      // sku: { 
      //   type: String, 
      //   unique: true, 
      //   sparse: true, // Allow duplicate null values
      // },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
      subImages: {
        type: [
          {
            url: String,
            localPath: String,
          },
        ],
        default: [],
      },
    },
    { timestamps: true }
  );

  productSchema.plugin(mongooseAggregatePaginate);

  export const Product = mongoose.model("Product", productSchema);
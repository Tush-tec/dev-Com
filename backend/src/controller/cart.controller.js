import mongoose,{isValidObjectId} from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { log } from "console";


const addMultipleToCart = async (req, res) => {

        const { user } = req
        const { products } = req.body

        if (!products || products.length === 0) {
           throw ApiError(
            403,
            "Invalid request",
           )
        }


        let cart = await Cart.findOne({ owner: req.user?._id })

        if (!cart) {
            cart = new Cart({ owner: req.user?._id, items: [] })
        }


        for (let product of products) {
            const { productId, quantity } = product;


            const foundProduct = await Product.findById(productId);

            if (!foundProduct) {
                throw new ApiError(
                    404,
                    "Product not found."
                )
            }


            const existingProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)

            if (existingProductIndex !== -1) {

                cart.items[existingProductIndex].quantity += quantity;
            } else {

                cart.items.push({
                    productId,
                    quantity,
                    price: foundProduct.price,
                    name: foundProduct.name,
                    image: foundProduct.mainImage,
                    stock: foundProduct.stock
                })
            }
        }


        
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)


       const  cartSave =  await cart.save()
       if(!cartSave){
        throw new ApiError(
            500,
            'Failed to save cart',
        )
       }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                cart,
                "item added to cart successFully"
            )
        )
   
}



const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body
    const { quantity } = req.body

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        throw new ApiError(400, "Quantity must be a positive number greater than 0");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found to add to cart");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock for the product");
    }

    let cart = await Cart.findOne({ owner: req.user?._id });
    if (!cart) {
        cart = await Cart.create({
            owner: req.user?._id,
            items: [],
        });
    }

    const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            throw new ApiError(400, "Insufficient stock for the updated quantity");
        }
        existingItem.quantity += quantity;
        existingItem.price = product.price;
        existingItem.stock = product.stock;
    } else {
        cart.items.push({
            productId,
            name:product.name,
            quantity,
            price: product.price,
            stock: product.stock,
            image: product.mainImage,
            
        });
    }

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const savedCart = await cart.save({ validateBeforeSave: true });
    if (!savedCart) {
        throw new ApiError(500, "Failed to save the cart");
    }

    return res.status(200).json(
        new ApiResponse(200, savedCart, "Product added to cart successfully")
    );
});


const getCart = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    console.log(user);
    

    if (!user) {
        throw new ApiError(401, "Unauthorized to access cart because we couldn't find any user");
    }

    const cart = await Cart.aggregate([
        {
            $match: {
                owner: user,  
                isActive: true
            },
        },
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "products", 
                localField: "items.productId",  
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails" 
        },
        {
            $addFields: {
                "items.title": "$productDetails.title",
                "items.price": "$productDetails.price",
                "items.image": "$productDetails.image"
            }
        },
        {
            $group: {
                _id: "$_id",
                owner: { $first: "$owner" },  
                items: { $push: "$items" },
                isActive: { $first: "$isActive" }
            }
        }
    ]);



    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    return res.status(200).json(
        new ApiResponse(200, cart[0], "Cart retrieved successfully")
    );
});



const removeFromCart = asyncHandler(async (req, res) => {

    const { productId } = req.params; 

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID.");
    }

    const cart = await Cart.findOne({ owner: req.user._id, isActive: true });

    if (!cart) {
        throw new ApiError(404, "Cart not found.");
    }

    console.log("Cart items before removal:", cart.items.map(item => item.productId.toString()));


    const itemIndex = cart.items.findIndex(item => item._id.toString() === productId);

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in the cart.");
    }


    cart.items.splice(itemIndex, 1);

    console.log("Cart items after removal:", cart.items.map(item => item.productId.toString()));


    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);


    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Product removed from cart successfully"));
});


const updateCartItems = asyncHandler(async(req,res) =>{
    const {productId,  quantity = 1} = req.body

    const user = req.user._id

    if(!isValidObjectId(productId)){
        throw new ApiError(
            400, "Invalid product id."
        )
    }
    if(!user){
        throw new ApiError(
            401, "You must be logged in to perform this action."
        )
    }

    const cart = await Cart.findOne({ user: user, isActive: true });
    if (!cart) {
      throw new ApiError(404, "No active cart found for the user.");
    }

    const product = await Product.findOne(
        { _id: productId, isActive: true }
    )

    if(quantity > product.stock){
        throw new ApiError(
            400, 
            product.stock > 0 
            ? `Only ${product.stock} units are available, but you are trying to add ${quantity}.`
        : "Product is out of stock."
        )
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
    
      if (itemIndex !== -1) {

        if (quantity === 0) {
          cart.items.splice(itemIndex, 1);
        } else {

          cart.items[itemIndex].quantity = quantity;
        }
      } else {
        if (quantity > 0) {
          cart.items.push({
            productId: productId,
            quantity,
          });
        } else {
          throw new ApiError(400, "Quantity must be greater than 0 for new items.");
        }
    }

    cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    )

    await cart.save({ validateBeforeSave: true })

    const newCart = await getCart(user);

    return res
    .status(200)
    .json(
         new ApiResponse(
            200,
            newCart,
            "Cart updated successfully."
        )
    )

})

const clearCart = asyncHandler(async(req,res) =>{
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User is not authenticated.");
  }

  const cart = await Cart.findOne({ user: userId, isActive: true });

  if (!cart) {
    throw new ApiError(404, "No active cart found for the user.");
  }


  cart.items = [];
  cart.totalPrice = 0;
 
  const updatedCart = await cart.save();


  return res 
  .status(200)
  .json(
    new ApiResponse(200, updatedCart, "Cart cleared successfully.")
  );
});

export {
    addMultipleToCart,
    addToCart,
    getCart,
    removeFromCart,
    updateCartItems,
    clearCart
}
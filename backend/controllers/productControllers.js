import catchAsync from "../middlewares/catchAsync.js";
import Product from "../models/productModel.js"
import APIFilters from "../utils/filter.js";
import sendError from "../utils/sendError.js";
import Order from "../models/orderModel.js"
import { delete_file, upload_file } from "../utils/cloudinary.js";


//Get All Products  /api/v1/products
export const getAllProducts= catchAsync(async (req,res,next)=>{
  
   let resPerPage = 8;
   const apiFilters = new APIFilters(Product,req.query).search().filters()
  
   let products = await apiFilters.query;
   let totalProducts= products.length
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone()

     if(!products){
        return next(new sendError("Products not found",401))
     }

     res.send({
        totalProducts ,
        products,
        resPerPage
     })
})


//Get Single Product  /api/v1/products/:id
export const getSingleProductDetails= catchAsync(async (req,res,next)=>{
    const {id} = req.params
    
    
    const product= await Product.findById(id).populate('reviews.user');

    if(!product){
       return next(new sendError("product not found",401))
    }

    res.send({
       product
    })
})

//Create Product  /api/v1/products
export const CreateProduct= catchAsync(async (req,res,next)=>{
      
   req.body.user = req.user._id
     
    try {
        let product = await Product.create(req.body);
        res.status(200).send({
            message:"succesfully created",
            product ,
         })
    } catch (error) {
        console.log(error.message);
        return next(new sendError(`Error: ${error}`,401))
        
    }
 
 
     
})


// Upload product images   =>  /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsync (async (req, res) => {
   let product = await Product.findById(req?.params?.id);
 
   if (!product) {
     return next(new ErrorHandler("Product not found", 404));
   }
    
   const uploader = async (image) => upload_file(image, "seasonstar/products"  );
 
   const urls = await Promise.all((req?.body?.images).map(uploader));
 
   product?.images?.push(...urls);
   await product?.save();
 
   res.status(200).json({
     product,
   });
 });



 // Delete product image   =>  /api/v1/admin/products/:id/delete_image
export const deleteProductImage = catchAsync(async (req, res) => {
   let product = await Product.findById(req?.params?.id);
 
   if (!product) {
     return next(new ErrorHandler("Product not found", 404));
   }
 
   const isDeleted = await delete_file(req.body.imgId);
 
   if (isDeleted) {
     product.images = product?.images?.filter(
       (img) => img.public_id !== req.body.imgId
     );
 
     await product?.save();
   }
 
   res.status(200).json({
     product,
   });
 });


//Get All Products
export const getAdminProducts= catchAsync(async (req,res,next)=>{
   
   
   let products = await Product.find ()
    
  

  res.status(200).json({
   products
  })
})

//Updating Product  /api/v1/products/:id
export const updatingProduct= catchAsync(async (req,res,next)=>{
     const {id}=req.params;
     
     let product = await Product.findById(id)
     if(!product){
        return next(new sendError("product not found",401))
     }

    product= await Product.findByIdAndUpdate(id,req.body,{new:true})

    res.status(200).json({
       message:"succesfully updated",
       product 
    })
})

//Deleting Product  /api/v1/products/:id
export const deleteProduct=catchAsync(async (req,res,next)=>{
   let product = await Product.findById(req?.params?.id);
  
   
   if(!product){
      return next(new sendError("Product not found", 401));
   }


    // Deleting image associated with product
  for (let i = 0; i < product?.images?.length; i++) {
    await delete_file(product?.images[i].public_id);
  }



   product= await Product.findByIdAndDelete(req.params?.id)
   res.status(200).send({
      message : "Product deleted Successfully",
      product
   })
})




//create or update reviews 

export const createAndUpdateReviews = catchAsync(async(req,res,next)=>{
   const {rating , comment, productId} = req.body

   const reviews = {
       user: req.user._id,
       rating : Number(rating),
       comment
   }

 
   const product = await Product.findById(productId);
   if(!product){
       return next(new sendError("cannot find product",402));

   }

  const isReviewed = product.reviews.find((r)=>r.user.toString() === req.user._id.toString())

  if(isReviewed){
     product.reviews.forEach((review)=>{
       if(review.user.toString() === req.user._id.toString()){
           review.comment=comment,
           review.rating=rating
       }
     })
  }else{
  product.reviews.push(reviews);
  product.numOfReviews=product.reviews.length;
  }

  product.ratings = product.reviews.reduce((acc,item)=>item.rating +acc,0)/product.reviews.length

  await product.save({validateBeforeSave:false})

  res.status(200).send({
   message:"review posted",
   product
  })
})


//Get product reviews

export const getProductReview =catchAsync(async(req,res,next)=>{
   
    
   const product = await Product.findById(req.query.id).populate('reviews.user')
   if(!product){
       return next(new sendError("cannot find product",402));

   }

   res.status(200).send({
       reviews : product.reviews
   })
})




 
// Delete product review   =>  /api/v1/admin/reviews
export const deleteReview = catchAsync(async (req, res, next) => {
 
   let product = await Product.findById(req.query.productId);
 
   
   if (!product) {
     return next(new ErrorHandler("Product not found", 404));
   }
 
   const reviews = product?.reviews?.filter( 
     (review) =>{ 
      console.log(req?.query?.id.toString())
      console.log(review._id.toString());
      
      review._id.toString() !== req?.query?.id.toString()
   }
   );
 
   const numOfReviews = reviews.length;
 
   const ratings =
     numOfReviews === 0
       ? 0
       : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
         numOfReviews;
 
   product = await Product.findByIdAndUpdate(
     req.query.productId,
     { reviews, numOfReviews, ratings },
     { new: true }
   );
 
   res.status(200).json({
     success: true,
     product,
   });
 });


 
// Can user review   =>  /api/v1/can_review
export const canUserReview = catchAsync(async (req, res) => {

   console.log(req.user);
   console.log(req.cookies.token);
   
   
   const orders = await Order.find({
     user: req.user._id,
     "orderItems.product": req.query.productId,
   });
 
   if (orders.length === 0) {
     return res.status(200).json({ canReview: false });
   }
 
   res.status(200).json({
     canReview: true,
   });
 });
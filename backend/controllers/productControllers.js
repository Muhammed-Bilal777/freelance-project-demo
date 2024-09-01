import catchAsync from "../middlewares/catchAsync.js";
import Product from "../models/productModel.js"
import APIFilters from "../utils/filter.js";
import sendError from "../utils/sendError.js";



//Get All Products  /api/v1/products
export const getAllProducts= catchAsync(async (req,res,next)=>{
  
   let resPerPage = 4;
   const apiFilters = new APIFilters(Product,req.query).search().filters()

   let products = await apiFilters.query;
 
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone()

     if(!products){
        return next(new sendError("Products not found",401))
     }

     res.send({
        totalProducts: products.length,
        products
     })
})


//Get Single Product  /api/v1/products/:id
export const getSingleProduct= catchAsync(async (req,res,next)=>{
    const {id} = req.params
    
    
    const product= await Product.findById(id);

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
   product= await Product.findByIdAndDelete(req.params?.id)
   res.status(200).send({
      message : "Product deleted Successfully",
      product
   })
})


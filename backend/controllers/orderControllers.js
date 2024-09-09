import catchAsync from "../middlewares/catchAsync.js"
import Order from "../models/orderModel.js"
import sendError from "../utils/sendError.js";
import Product from "../models/productModel.js"



//creating new order  => /api/v1/orders/new
export const createOrder = catchAsync(async (req,res)=>{

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
      } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user : req.user._id
    })

    res.status(200).send({
        message:"Ordered successfull",
        order
    })
})

// current logged in User Orders
export const userOrders = catchAsync(async(req,res,next)=>{

    const orders = await Order.find({ user :req?.user?._id})

    if(orders.length === 0){
        return next(new sendError("There are currently no orders",404));

    }

    res.status(200).send({
        totalOrder :orders.length,
        orders
    })
})


//get single order details by id

export const getOrderDetails = catchAsync(async(req,res,next)=>{
    const {id} =req.params

    const order = await Order.findById(id).populate('user',"name email");

    if(!order){
        return next(new sendError("order not found with this id",404))
    }

    res.status(200).send({
        order,
        
    })
})

//get all orders

export const getAllOrder =catchAsync(async(req,res,next)=>{
    let orders = await Order.find();

    res.status(200).send({
        totalOrder :  orders.length,
        orders
    })
})


//get all orders

export const updateOrder =catchAsync(async(req,res,next)=>{
    let orders = await Order.find();

    res.status(200).send({
        totalOrder :  orders.length,
        orders
    })
})

//update order details   /admin/orders/:id

export const updateOrderDetails =catchAsync(async (req,res,next)=>{

    let orderItems = await Order.findById(req?.params?.id);
    if(!orderItems){
        return next(new sendError("order not found with id",403))
    }

    if (orderItems?.orderStatus === "Delivered") {
        return next(new sendError("You have already delivered this order", 400));
      }




      const productNotFound =false;

    for(const item of orderItems){
        const product= await Product.findById(item.product.toString());
         
        
        if(!product){
            productNotFound = true;
            break
        } 

        product.stock=product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });
        if(productNotFound){
          return next(new sendError("No producut found with this ID",403))
      }
        
    }

    order.orderStatus=req?.body?.status,
    order.deliveredAt=Date.now();
    await order.save();
    res.status(200).send({
        message : "order updated successfully",
        order
    })
})


//Delete Order by ID

export const deleteOrder =catchAsync(async(req,res,next)=>{
    let order = await Order.findByIdAndDelete(req?.params?.id);

    res.status(200).send({
       message:"Order deleted successfully",
       order
    })
})

 


async function getSalesData(startDate, endDate) {
    const salesData = await Order.aggregate([
      {
        // Stage 1 - Filter results
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        // Stage 2 - Group Data
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          totalSales: { $sum: "$totalAmount" },
          numOrders: { $sum: 1 }, // count the number of orders
        },
      },
    ]);
  
    // Create a Map to store sales data and num of order by data
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0;
  
    salesData.forEach((entry) => {
      const date = entry?._id.date;
      const sales = entry?.totalSales;
      const numOrders = entry?.numOrders;
  
      salesMap.set(date, { sales, numOrders });
      totalSales += sales;
      totalNumOrders += numOrders;
    });
  
    // Generate an array of dates between start & end Date
    const datesBetween = getDatesBetween(startDate, endDate);
  
    // Create final sales data array with 0 for dates without sales
    const finalSalesData = datesBetween.map((date) => ({
      date,
      sales: (salesMap.get(date) || { sales: 0 }).sales,
      numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
    }));
  
    return { salesData: finalSalesData, totalSales, totalNumOrders };
  }
  
  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dates.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }
  
  // Get Sales Data  =>  /api/v1/admin/get_sales
  export const getSales = catchAsync(async (req, res, next) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
  
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
  
    const { salesData, totalSales, totalNumOrders } = await getSalesData(
      startDate,
      endDate
    );
  
    res.status(200).json({
      totalSales,
      totalNumOrders,
      sales: salesData,
    });
  });
import express from "express"
import dotenv from "dotenv"
import errorMiddleware from './middlewares/errors.js'
import cors from "cors"

import { dbConnect } from "./database/dbConnect.js";
import cookieParser from "cookie-parser";
const app =express() ;



app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
 

const corsOptions = {
  origin: 'http://localhost:3000', // or the domain you're making the request from
  credentials: true, // allow credentials (cookies)
};

app.use(cors(corsOptions));

//Configuration 
dotenv.config({
    path : "backend/config/config.env"
})

//Database connection 
try {
    dbConnect();
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }

app.use(cookieParser())
 

//Routes
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/ordersRoutes.js"
import paymentRoutes from './routes/paymentRoutes.js'

app.use("/api/v1",productRoutes)
app.use("/api/v1" ,userRoutes)
app.use('/api/v1',orderRoutes)
app.use('/api/v1',paymentRoutes)

 

app.use(errorMiddleware)
app.listen(process.env.PORT, () => {
    console.log(`Server is up and running on ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
  }) 
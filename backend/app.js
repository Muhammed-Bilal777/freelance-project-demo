import express from "express"
import dotenv from "dotenv"
import errorMiddleware from './middlewares/errors.js'
import cors from "cors"

import { dbConnect } from "./database/dbConnect.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";







const app =express() ;

// import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
 
// const allowedOrigins = ['http://localhost:3000', 'https://freelance-project-demo.onrender.com'];

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === 'http://localhost:3000' || origin === 'https://freelance-project-demo-2.onrender.com' || origin === "http://localhost:4040"
) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  credentials: true,
  sameSite: 'none', // add this line
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 
    'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
}

app.use(cors(corsOptions));
app.use(cookieParser())
 

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

//Configuration 
if(process.env.NODE_ENV !== "PRODUCTION"){
dotenv.config({
  path : "backend/config/config.env"
})
}


//Database connection 
try {
    dbConnect();
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }


//Routes
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/ordersRoutes.js"
import paymentRoutes from './routes/paymentRoutes.js'

app.use("/api/v1",productRoutes)
app.use("/api/v1" ,userRoutes)
app.use('/api/v1',orderRoutes)
app.use('/api/v1',paymentRoutes)

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.use(errorMiddleware)
app.listen(process.env.PORT, () => {
    console.log(`Server is up and running on ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
  }) 



  //Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
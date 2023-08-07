require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
// router imports
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")

/**
 * DB Connection
 */
console.log("Welcome to project")
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  }).catch(()=>{
    console.log("DB CONNECTION FAILED")
  });

/**
 * middleware
 * 
 * body parser: to handle data in request body
 * cookie parser: to handle cookie
 * cors: to handler cross connections
 */
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

/**
 * routes
 */
app.use("/api",authRoutes) 
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api", orderRoutes)
/**
 * port
 */
const port = process.env.PORT || 8000;


/**
 * server
 */
app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

app.get('',(req, res)=>{
  return res.send("Hello")
})

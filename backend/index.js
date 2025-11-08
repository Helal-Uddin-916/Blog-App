const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnect");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const { PORT, FRONTEND_URL } = require("./config/dotenv.config");
const app = express();
require("dotenv").config()
const port = PORT

app.use(express.json());
app.use(cors({origin : FRONTEND_URL}));

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

app.listen(port, () => {
  console.log("Server Started");
  connectDb();
  cloudinaryConfig()
});

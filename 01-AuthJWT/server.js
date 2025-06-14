const express = require("express"); // require Express
const cors = require("cors"); // require Cors for other doamin access for routes
const dotenv = require("dotenv"); // require for enviorment
const mongoose = require("mongoose"); // require for DB
const userRoutes = require("./routes/user");
const checkMiddleWare = require("./routes/checkMiddlewear");


const app = express(); // for using app
app.use(express.json()); // for json reading
app.use(cors()); // access rotue from diff domain
dotenv.config();

// Connection to MongoDB - local
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB connected Sucessfully");
    } catch (error) {
        console.log(error);
    }
} 
connectDB();

// root route
app.get("/" , (req, res) => {
    res.send('welcome');
})

app.use("/api/users", userRoutes);
app.use("/api", checkMiddleWare);

// server listing port
app.listen(8080, () => {console.log("server is listing 8080")});
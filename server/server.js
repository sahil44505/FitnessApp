const express = require('express')
const app = express();

const port = 8080;

const connectDb = require('../frontend/src/utils/db')
const cors = require('cors')
const bodyParser =require('body-parser')
const userRoutes = require("./routes/userRoutes");

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET , POST , PUT , DELETE , PATCH , HEAD",
    credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api",userRoutes);
app.use(bodyParser.json());


  
connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Server Running at port ${port}`)
    });

})
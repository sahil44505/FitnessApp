const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const app = express();

const port = 8080;
const { Cashfree } = require('cashfree-pg');
const connectDb = require('../frontend/src/utils/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userdataRoute = require('./routes/userdataRoute');
const cookieParser = require('cookie-parser');
const paymentroute = require('./routes/paymentroute');
const calorieintake = require("./routes/CalorieIntake")
const steptrack = require('./routes/StepTrack')
const 
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Cashfree with environment variables

Cashfree.XClientId='TEST1028981802bb3309a937d2c5676381898201',
Cashfree.XClientSecret='cfsk_ma_test_bf7f3a4b2f57e5b0dabc92e6c209d5b3_cb62fd6e',
Cashfree.XEnvironment=Cashfree.Environment.SANDBOX


app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/user", userdataRoute);
app.use("/calorie",calorieintake)

app.use("/pay",paymentroute)

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Server Running at port ${port}`);
    });
});

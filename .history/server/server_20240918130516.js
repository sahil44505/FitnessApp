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

Cashfree.XClientId='CF10289818CRL84AHE0A7C73D73CUG',
Cashfree.XClientSecret='cfsk_ma_test_973b84ace62eb25a92f6b1177b7a4aaf_2c26af32',
Cashfree.XEnvironment=Cashfree.Environment.SANDBOX


app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/user", userdataRoute);

app.use("/pay",paymentroute)

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Server Running at port ${port}`);
    });
});

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);


const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');


// mongoose.connect(
//     "mongodb://saadatt:" +
//     process.env.MONGO_ATLAS_PW +
//     "@node-rest-store-sadat-2qe8e.mongodb.net/test?retryWrites=true&w=majority",
//     { //useMongoClient: true
//         useNewUrlParser: true,
//         useUnifiedTopology: true }
// );
// mongoose.Promise = global.Promise;

mongoose.connect(
    'mongodb+srv://saadatt:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-store-sadat-2qe8e.mongodb.net/test?retryWrites=true&w=majority', {
        //useMongoClient: true});
        useNewUrlParser: true,
        useUnifiedTopology: true});


app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;


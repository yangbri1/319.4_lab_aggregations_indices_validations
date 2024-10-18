// imports
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import gradeRoutes from './routes/gradeRoutes.mjs';

// create an instance of express
const app = express();
dotenv.config();
let PORT = process.env.PORT || 3001;

// middlware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

// routes
app.use('/grades', gradeRoutes); // connect to gradeRoutes, attach using app.use()

// listener
app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`);
});


import express from 'express';
import connection from './database/database.js';
import movieRouter from './routes/movieRouter.js';

import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

app.use(movieRouter);



app.listen(process.env.PORT,()=>{
    console.log(`listen on ${process.env.PORT}`)
});
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userRouter from './routes/indexRoutes'
import indexRouter from './routes/userRoutes'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors({origin:`${process.env.Client_Url}`,credentials:true ,optionsSuccessStatus:200}));
app.use(express.urlencoded({extended:false, limit:'1kb'}));   
app.use(express.json({limit:'20kb'})) // limit the size of incoming request body and parse i.e convert string json to js object for every incoming request
app.use(cookieParser())

mongoose.connect(process.env.MONGODB_ATLAS_URL as string)
  .then(()=>{console.log("Connected to database")})
  .catch((err)=>{console.error("Unable to connect database",err)})

app.use('/',indexRouter)
app.use('/u',userRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
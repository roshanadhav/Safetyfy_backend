import express from 'express' ; 
import userAuth from '../middelwears/userAuth.js';
import { getHelp, getUserData  } from '../controllers/userController.js';



const userRouter = express.Router({mergeParams:true}) ; 




userRouter.get('/data' , userAuth , getUserData) ; 
userRouter.post('/help' , getHelp ) ;
// userRouter.get('/subscreptions'  , getSubscreptionData) ; 




export default userRouter ; 
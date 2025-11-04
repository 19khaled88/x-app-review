import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createReviews, getAllReviews } from './services/review';


const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Home route 
app.get('/',(req,res)=>{
  try {
    res.json({success:true,status:'OK',timestamp: new Date().toISOString()})
  } catch (error) {
    res.json({success:false,status:'201'})
  }
})
// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// get all reviews
app.get('/reviews/all',async(req,res)=>{
  try {
    const result = await getAllReviews()
    if(result.success){
      return res.status(201).json(result)
    }else{
      const statusCode = result.error === 'Error unknown' ? 400 : 500;
      return res.status(statusCode).json(result)
    }
  } catch (error:any) {
    return res.status(500).json({
      success:false,
      error:error.message || 'Internal server error'
    })
  }
});

// create review
app.post('/reviews/create',async(req,res)=>{
  try {
    const result = await createReviews(req.body);

    if(result.success){
      return res.status(201).json(result)
    }else{
      const statusCode = result.error === 'Validation failed' ? 400 : 500;
      return res.status(statusCode).json(result)
    }
  } catch (error:any) {
    return res.status(500).json({
      success:false,
      error:error.message || 'Internal server error'
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
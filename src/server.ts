import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
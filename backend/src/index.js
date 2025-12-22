import express from 'express';
import dotenv from 'dotenv';

// loads your .env file into process.env so you can use your environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Kabob Express API running on port ${PORT}`);
});
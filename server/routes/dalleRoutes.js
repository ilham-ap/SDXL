import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    console.log(req.body);
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        headers: { Authorization: `Bearer ${process.env.API_KEY}` },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      },
    );
    const imgData = await response.buffer();
    const base64String = imgData.toString('base64');
    res.status(200).json({ photo: base64String });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

export default router;

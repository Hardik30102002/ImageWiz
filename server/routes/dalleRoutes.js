import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

// router.route('/').post(async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const aiResponse = await openai.createImage({
//       prompt,
//       n: 1,
//       size: '1024x1024',
//       response_format: 'b64_json',
//     });

//     const image = aiResponse.data.data[0].b64_json;
//     res.status(200).json({ photo: image });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error?.response.data.error.message || 'Something went wrong');
//   }
// });

router.route("/").post(async(req,res)=>{
  const {prompt} = req.body;
  const resp = await fetch(
    `https://api.limewire.com/api/image/generation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': 'v1',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.LIMEWIRE_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: '1:1',
        samples: 1
      })
    }
  );

  const data = await resp.json();
  console.log(data);
  return res.json(data);
})

export default router;

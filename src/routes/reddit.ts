import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/reddit', async (req: Request, res: Response) => {
  try {
    const { q, t, limit, sort } = req.query;
    const response = await axios.get('https://www.reddit.com/search.json', {
      params: {
        q,
        sort,
        t,
        limit,
        include_over_18: true,
      },
      headers: {
        'User-Agent': 'Scout-AI/1.0',
      },
    });
    const data = response.data.data?.children || [];
    res.json(data);
  } catch (error: any) {
    console.error(
      'Error fetching reddit posts:',
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Failed to fetch data from Reddit' });
  }
});
export default router;

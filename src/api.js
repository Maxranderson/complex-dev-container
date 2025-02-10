import express from 'express';
import redis from 'redis';

const app = express();
const redisClient = await redis
  .createClient({
    url: `redis://${process.env.REDIS_URL}`,
  })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

app.use(express.json());

app.get('/messages/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const message = await redisClient.get(id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found for ID' });
      }
      res.json({ message });
    } catch (err) {
      return res.status(500).json({ error: 'Redis error', details: err });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
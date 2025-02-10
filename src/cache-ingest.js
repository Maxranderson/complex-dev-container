import { PubSub } from "@google-cloud/pubsub";
import redis from "redis";

const pubSubClient = new PubSub();
const subscriptionName = process.env.TOPIC_SUB;
const redisClient = await redis
  .createClient({
    url: `redis://${process.env.REDIS_URL}`,
  })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

// Handle incoming messages from Pub/Sub
const messageHandler = async (message) => {
  try {
    const messageData = JSON.parse(message.data.toString());

    if (!messageData.id) {
      console.log(`ID should not be empty!`);
      message.ack();
      return;
    }

    if (!messageData.message) {
      console.log(`Message should not be empty!`);
      message.ack();
      return;
    }

    await redisClient.set(messageData.id, messageData.message);
    console.log(`Message stored in Redis: ${messageData.id}`);

    message.ack();
  } catch (err) {
    console.error("Error processing message:", err);
    message.nack();
  }
};

// Listen for messages on the subscription
const listenForMessages = () => {
  const subscription = pubSubClient.subscription(subscriptionName);

  subscription.on("message", messageHandler);
  subscription.on("error", (err) => {
    console.error("Error with subscription:", err);
  });

  console.log(`Listening for messages on subscription: ${subscriptionName}`);
};

listenForMessages();

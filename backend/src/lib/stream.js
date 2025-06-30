import { StreamChat } from 'stream-chat';
import "dotenv/config.js"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
    console.error('Stream API key or Secret is missing')
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret,{
   timeout: 10000,
});
// creating user in upstream account  
export const addStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error('something went wrong will creating upstream user', error)
    }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = String(userId); // cleaner way
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error('Something went wrong while creating Stream Token for user:', error);
    return null; // explicitly return fallback
  }
};

import express from 'express'
import { protectRoute } from '../middleware/authMiddleware.js';
import { getStreamToken } from '../controllers/chatControllers.js'
const route = express.Router();

route.get('/token', protectRoute, getStreamToken);
export default route
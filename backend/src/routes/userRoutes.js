import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
    getRecommendedUsers,
    myFriends, sendRequest,
    acceptRequest, getFriendRequests,
    getOnGoingRequests
} from '../controllers/userControllers.js';

const route = express.Router();

route.use(protectRoute)
route.get('/friends', myFriends);
route.get('/', getRecommendedUsers);

route.post('/friend-request/:id', sendRequest)
route.put('/friend-request/:id/accept', acceptRequest)

route.get('/friend-requests', getFriendRequests);
route.get('/on-going-requests', getOnGoingRequests);

export default route

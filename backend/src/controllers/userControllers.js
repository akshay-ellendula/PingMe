import asyncHandler from "express-async-handler";
import User from "../model/user.js";
import FriendRequest from "../model/friendRequest.js";
//@dec
//@route
//@access
export const getRecommendedUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const currentUser = req.user;
  const recommendedUsers = await User.find({
    $and: [
      { _id: { $ne: currentUserId } },
      { _id: { $nin: currentUser.friends } },
      { isOnboarded: true }
    ]
  })
  res.status(200).json(recommendedUsers);
})

//@dec
//@route
//@access
export const myFriends = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const user = await User.findById(currentUserId)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage")

  res.status(200).json(user.friends)
})

//@dec
//@route
//@access
export const sendRequest = asyncHandler(async (req, res) => {
  const myId = req.user.id;
  const recipientId = req.params.id;

  if (myId === recipientId) {
    return res.status(400).json({ message: "You can't send a request to yourself" });
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({ message: "Recipient not found" });
  }

  if (recipient.friends.includes(myId)) {
    return res.status(400).json({ message: "You are already friends" });
  }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: myId, recipient: recipientId },
      { sender: recipientId, recipient: myId }
    ]
  });

  if (existingRequest) {
    return res.status(400).json({ message: "A friend request already exists between you and this user" });
  }

  const friendRequest = await FriendRequest.create({
    sender: myId,
    recipient: recipientId
  });

  res.status(201).json(friendRequest);
});


//@dec
//@route
//@access

export const acceptRequest = asyncHandler(async (req, res) => {
  const friendRequestId = req.params.id;

  const friendRequest = await FriendRequest.findById(friendRequestId)
  if (!friendRequest) {
    return res.status(404).json({ message: "friend Request not found" })
  }

  if (friendRequest.recipient.toString() != req.user.id) {
    return res.status(403).json({ message: "you are not authorized to accept request" })
  }

  await FriendRequest.findByIdAndUpdate(friendRequestId, {
    status: "accepted"
  })

  await User.findByIdAndUpdate(friendRequest.sender, {
    $addToSet: { friends: friendRequest.recipient }
  })

  await User.findByIdAndUpdate(friendRequest.recipient, {
    $addToSet: { friends: friendRequest.sender }
  })

  res.status(200).json({ message: "friend Request Accepted" })

})

//@dec
//@route
//@access
export const getFriendRequests = asyncHandler(async (req, res) => {

  const inComingRequest = await FriendRequest.find({
    recipient: req.user.id,
    status: 'pending'
  }).populate("sender", 'fullName profilePic nativeLanguage')

  const acceptedRequest = await FriendRequest.find({
    $or: [
      { sender: req.user._id },
      { recipient: req.user._id }
    ],
    status: 'accepted'
  }).populate('recipient', "fullName profilePic").populate('sender', 'fullName profilePic');
  res.status(200).json({ inComingRequest, acceptedRequest })
})

//@dec
//@route
//@access
export const getOnGoingRequests = asyncHandler(async (req, res) => {

  const onGoingRequests = await FriendRequest.find({
    sender: req.user.id,
    status: "pending"
  }).populate('recipient', " fullName profilePic")
  res.status(200).json(onGoingRequests)
})


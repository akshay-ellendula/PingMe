import asyncHandler from "express-async-handler";
import {generateStreamToken} from "../lib/stream.js";

export const getStreamToken = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const streamToken = await generateStreamToken(req.user.id);

    if (!streamToken) {
        return res.status(400).json({ message: "Unable to generate Stream token" });
    }

    res.status(200).json({ streamToken });
});

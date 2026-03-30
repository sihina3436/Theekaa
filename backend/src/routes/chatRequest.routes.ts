import { Router } from "express";
import {makeRequest,  getReceivedRequests, getSentRequests, updateRequestStatus, BlockUser} from "../controllers/chatRequest.controller";
import { verifyUser } from "../middleware/auth.middleware";
const router = Router();

router.post("/request", verifyUser, makeRequest); //☑️
router.get("/received/:receiverId", verifyUser, getReceivedRequests); // ☑️
router.get("/sent/:senderId", verifyUser, getSentRequests); // ☑️
router.patch("/status/:requestId", verifyUser, updateRequestStatus); 
router.post("/block-user", verifyUser, BlockUser); // ☑️



export default router;

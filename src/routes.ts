import express from "express";
// import authRoutes from "./routes/authRoutes"; // ES6 import style
import {gameTypesRouter} from "./game_types/route"; // ES6 import style
import {teamTypesRouter} from "./team_types/route"; // ES6 import style
import {ageTypesRouter} from "./age_types/route"; // ES6 import style
import {seasonTypesRouter} from "./season_types/route"; // ES6 import style
import {authRouter} from "./auths/route"; // ES6 import style
import {teamRouter} from "./teams/route"; // ES6 import style
import {eventRouter} from "./events/route"; // ES6 import style
import {userRouter} from "./users/route"; // ES6 import style
import {additionalRouter} from "./additionals/routes"; // ES6 import style
import {liveStreamingRouter} from "./live_streaming/route"; // ES6 import style
import {storagePackageRouter} from "./storage_packages/route"; // ES6 import style
import { paymentRouter } from "./payments/route";
import { videoRouter } from "./video_upload/route";
import { messageRouter } from "./messages/route";

const router = express.Router();


router.use("/game-types", gameTypesRouter);
router.use("/team-types", teamTypesRouter);
router.use("/age-types", ageTypesRouter);
router.use("/season-types", seasonTypesRouter);
router.use("/auths", authRouter);
router.use("/teams", teamRouter);
router.use("/events", eventRouter);
router.use("/users", userRouter);
router.use("/additionals", additionalRouter);
router.use("/live-streaming", liveStreamingRouter);
router.use("/storage-packages", storagePackageRouter);
router.use("/payments", paymentRouter);
router.use("/videos", videoRouter);
router.use("/messages", messageRouter);

// Default route
router.get("/", (req, res) => {
    res.status(200).send("<h1> Welcome to Game Changer server app </h1>");
});

export {router as routes};

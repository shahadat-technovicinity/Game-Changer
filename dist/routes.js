"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
// import authRoutes from "./routes/authRoutes"; // ES6 import style
const route_1 = require("./game_types/route"); // ES6 import style
const route_2 = require("./team_types/route"); // ES6 import style
const route_3 = require("./age_types/route"); // ES6 import style
const route_4 = require("./season_types/route"); // ES6 import style
const route_5 = require("./auths/route"); // ES6 import style
const route_6 = require("./teams/route"); // ES6 import style
const route_7 = require("./events/route"); // ES6 import style
const route_8 = require("./users/route"); // ES6 import style
const routes_1 = require("./additionals/routes"); // ES6 import style
const route_9 = require("./live_streaming/route"); // ES6 import style
const route_10 = require("./storage_packages/route"); // ES6 import style
const route_11 = require("./payments/route");
const route_12 = require("./video_upload/route");
const route_13 = require("./messages/route");
const router = express_1.default.Router();
exports.routes = router;
router.use("/game-types", route_1.gameTypesRouter);
router.use("/team-types", route_2.teamTypesRouter);
router.use("/age-types", route_3.ageTypesRouter);
router.use("/season-types", route_4.seasonTypesRouter);
router.use("/auths", route_5.authRouter);
router.use("/teams", route_6.teamRouter);
router.use("/events", route_7.eventRouter);
router.use("/users", route_8.userRouter);
router.use("/additionals", routes_1.additionalRouter);
router.use("/live-streaming", route_9.liveStreamingRouter);
router.use("/storage-packages", route_10.storagePackageRouter);
router.use("/payments", route_11.paymentRouter);
router.use("/videos", route_12.videoRouter);
router.use("/messages", route_13.messageRouter);
// Default route
router.get("/", (req, res) => {
    res.status(200).send("<h1> Welcome to Game Changer server app </h1>");
});

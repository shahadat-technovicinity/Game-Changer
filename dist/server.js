"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const db_1 = require("./config/db");
const model_1 = require("./teams/model");
const model_2 = require("./users/model");
const model_3 = require("./messages/model");
const server = http_1.default.createServer(app_1.app);
// const io = new Server(server, {
//   cors: { origin:process.env.CLIENT_URL || "*", methods: ["GET", "POST"] },
// });
const allowedOrigins = [
    "*",
    process.env.CLIENT_URL,
    process.env.CLIENT_LOCALHOST_URL,
    "http://localhost:3000",
].filter((origin) => typeof origin === "string");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins || "*",
        methods: ["GET", "POST", "DELETE", "PUT"],
    },
});
io.on("connection", (socket) => {
    // console.log("✅ New client connected:", socket.id);
    socket.on("joinTeam", async (teamId, userId) => {
        try {
            const team = await model_1.Team.findById(teamId);
            if (!team ||
                !team.players_id.some((id) => id.equals(userId))) {
                console.warn("❌ Unauthorized team join attempt");
                socket.emit("error", "Not authorized to join this team chat");
                return;
            }
            socket.join(teamId);
            const previousMessages = await model_3.Message.find({ team_id: teamId })
                .sort({ timestamp: 1 })
                .populate("player_id", "first_name last_name image");
            const messagesToSend = previousMessages.map((m) => ({
                _id: m._id,
                sender: {
                    fullName: `${m.player_id.first_name} ${m.player_id.last_name}`,
                    image: m.player_id.image,
                    _id: m.player_id._id,
                },
                message: m.message,
                timestamp: m.timestamp,
            }));
            socket.emit("loadPreviousMessages", messagesToSend);
        }
        catch (error) {
            console.error("❌ Error in joinTeam:", error);
            socket.emit("error", "Failed to join team chat");
        }
    });
    socket.on("teamMessage", async ({ teamId, userId, message, }) => {
        try {
            const team = await model_1.Team.findById(teamId);
            if (!team ||
                !team.players_id.some((id) => id.equals(userId))) {
                console.warn("❌ Unauthorized message attempt");
                socket.emit("error", "Not authorized");
                return;
            }
            const user = await model_2.User.findById(userId).select("first_name last_name image");
            if (!user) {
                socket.emit("error", "User not found");
                return;
            }
            const saved = await new model_3.Message({
                team_id: teamId,
                player_id: userId,
                message,
            }).save();
            const msgData = {
                _id: saved._id,
                sender: {
                    fullName: `${user.first_name} ${user.last_name}`,
                    image: user.image,
                    _id: user._id,
                },
                message: saved.message,
                timestamp: saved.timestamp,
            };
            io.to(teamId).emit("newTeamMessage", msgData);
        }
        catch (error) {
            console.error("❌ Error sending message:", error);
            socket.emit("error", "Failed to send message");
        }
    });
    socket.on("deleteMessage", async ({ messageId, userId }) => {
        try {
            const msg = await model_3.Message.findById(messageId);
            if (!msg)
                return;
            if (msg.player_id.toString() !== userId) {
                socket.emit("error", "Cannot delete this message");
                return;
            }
            await msg.deleteOne();
            io.to(msg.team_id.toString()).emit("deleteTeamMessage", { messageId });
        }
        catch (error) {
            console.error("❌ Error deleting message:", error);
            socket.emit("error", "Failed to delete message");
        }
    });
    socket.on("disconnect", () => {
        // console.log("❎ Client disconnected:", socket.id);
    });
});
(0, db_1.connect)(process.env.MONGO_URI)
    .then(() => {
    const port = process.env.PORT || 8000;
    server.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
})
    .catch((err) => {
    console.error("❌ DB connection failed", err);
});

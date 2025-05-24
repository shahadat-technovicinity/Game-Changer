import { app } from "./app";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import { connect } from "./config/db";
import { Team } from "./teams/model";
import { User } from "./users/model";
import { Message } from "./messages/model";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  // console.log("✅ New client connected:", socket.id);

  socket.on("joinTeam", async (teamId: string, userId: string) => {
    try {
      const team = await Team.findById(teamId);

      if (
        !team ||
        !team.players_id.some((id: mongoose.Types.ObjectId) => id.equals(userId))
      ) {
        console.warn("❌ Unauthorized team join attempt");
        socket.emit("error", "Not authorized to join this team chat");
        return;
      }

      socket.join(teamId);

      const previousMessages = await Message.find({ team_id: teamId })
        .sort({ timestamp: 1 })
        .populate("player_id", "first_name last_name image");

      const messagesToSend = previousMessages.map((m) => ({
        _id: m._id,
        sender: {
          fullName: `${(m.player_id as any).first_name} ${(m.player_id as any).last_name}`,
          image: (m.player_id as any).image,
          _id: (m.player_id as any)._id,
        },
        message: m.message,
        timestamp: m.timestamp,
      }));

      socket.emit("loadPreviousMessages", messagesToSend);
    } catch (error) {
      console.error("❌ Error in joinTeam:", error);
      socket.emit("error", "Failed to join team chat");
    }
  });

  socket.on(
    "teamMessage",
    async ({
      teamId,
      userId,
      message,
    }: {
      teamId: string;
      userId: string;
      message: string;
    }) => {
      try {
        const team = await Team.findById(teamId);
        if (
          !team ||
          !team.players_id.some((id: mongoose.Types.ObjectId) => id.equals(userId))
        ) {
          console.warn("❌ Unauthorized message attempt");
          socket.emit("error", "Not authorized");
          return;
        }

        const user = await User.findById(userId).select("first_name last_name image");
        if (!user) {
          socket.emit("error", "User not found");
          return;
        }

        const saved = await new Message({
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
      } catch (error) {
        console.error("❌ Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    }
  );

  socket.on(
    "deleteMessage",
    async ({ messageId, userId }: { messageId: string; userId: string }) => {
      try {
        const msg = await Message.findById(messageId);
        if (!msg) return;

        if (msg.player_id.toString() !== userId) {
          socket.emit("error", "Cannot delete this message");
          return;
        }

        await msg.deleteOne();
        io.to(msg.team_id.toString()).emit("deleteTeamMessage", { messageId });
      } catch (error) {
        console.error("❌ Error deleting message:", error);
        socket.emit("error", "Failed to delete message");
      }
    }
  );

  socket.on("disconnect", () => {
    // console.log("❎ Client disconnected:", socket.id);
  });
});

connect(process.env.MONGO_URI!)
  .then(() => {
    const port = process.env.PORT || 8000;
    server.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
  });

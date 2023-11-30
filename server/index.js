import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./api/routes/main.routes.js";
import http from 'http';
import { Server } from 'socket.io';
import {GameRoom} from './Game/game-room.js';

const server = express();
const httpServer = http.createServer(server);
const io = new Server(
    httpServer,
    {
        cors: {
            origin: '*',
            credentials: false,
            // allowedHeaders: ["my-custom-headerz", "ngrok-skip-browser-warning"],
            // methods: ["GET"],
            allowedHeaders: ['Content-Type', 'Authorization', "ngrok-skip-browser-warning"],
            // allowedHeaders: ['Content-Type', 'Authorization'],
            // preflightContinue: true,
            optionsSuccessStatus: 204
        },
        // allowEIO3: true,
    }
);

dotenv.config();

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);
    io.emit('connected_to_server', socket.id);

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        GameRoom.rooms.forEach((room) => {
            room.removePlayerById(socket.id);
        })
    });

    socket.on('new_game', (playerData) => {
        socket.join(playerData.roomId);
        playerData.socketId = socket.id;
        // console.log(playerData.roomId)
        let room = GameRoom.getRoomByRoomId(playerData.roomId);
        if (room !== null) {
            room.joinPlayer(playerData);
            io.to(playerData.roomId).emit('join-room', playerData);
        }
        else {
            let newRoom = new GameRoom(playerData, playerData.roomId);
            io.emit('new-game-room', playerData.roomId);
        }
    });

    socket.on('ready', (player) => {
        let allPlayersGreen = true;
        GameRoom.updatePlayer(player);

        let room = GameRoom.getRoomByRoomId(player.roomId);
        room.players.forEach((player) => {
            if (!player.isReady) {
                allPlayersGreen = false;
            }
        });

        if (allPlayersGreen) {
            io.to(player.roomId).emit(
                    'all-players-green',
                    GameRoom.getRoomByRoomId(player.roomId).getOtherPlayers(player)
                );
        }
    });

    socket.on ('player-update', (player) => {
        io.to(player.roomId).except(player.playerId).emit(
            'player-update',
            GameRoom.getRoomByRoomId(player.roomId).getOtherPlayers(player));
    })
});

httpServer.listen(5000, function () {
    console.log('Server running in https:localhost:' + PORT);
});

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json("API is running!");
});

const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))
  )
  .catch((error) => console.log(`${error} did not connect`));

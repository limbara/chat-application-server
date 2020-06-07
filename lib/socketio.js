import socketio from "socket.io";
import userService from "./users";

export default function (server) {
  const io = socketio(server);

  const { addUser, getUser, getUsersInRoom, removeUser } = userService;

  io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = addUser(socket.id, name, room);

      if (error) return callback(error);

      socket.emit("message", {
        user: "admin",
        text: `${user.name}, welcome to the room ${user.room}`,
      });
      socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${user.name} has joined.` });

      socket.join(user.room);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      let user = getUser(socket.id);

      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
      });

      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit("message", {
          user: "admin",
          text: `${user.name} has left`,
        });

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });  
      }
    });
  });

  return io;
}

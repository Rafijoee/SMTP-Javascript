require("dotenv").config();

const express = require("express");
const http = require("http"); // Tambahkan ini untuk membuat server HTTP
const socket = require("./middlewares/socket");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
app.use('/api/v1', authRoutes);

// Buat server HTTP
const server = http.createServer(app);

// Inisialisasi Socket.IO dengan server
socket.init(server);

// Jalankan server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

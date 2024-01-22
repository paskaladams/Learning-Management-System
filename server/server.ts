// Mengimport app dari file app.ts
import { app } from './app';
import {v2 as cloudinary} from 'cloudinary';
import http from 'http';
import connectDB from './utils/db';
import { initSocketServer } from './socketServer';
// Mengonfigurasi environtment variable menggunakan dotenv untuk nantinya menyimpan konfigurasi port server atau kredensial API
require('dotenv').config();
const server = http.createServer(app);

// Cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_SECRET_KEY,
})

initSocketServer(server);

// Membuat server di port yang ditentukan
server.listen(process.env.PORT, () => {
	console.log(`Server is connected with port ${process.env.PORT}`);
	connectDB();
});

// frontend/src/services/socket.js
import { io } from 'socket.io-client';

// The URL of your backend server
const URL = 'http://localhost:3000';

// Initialize socket with autoConnect set to false
export const socket = io(URL, {
    autoConnect: false
});
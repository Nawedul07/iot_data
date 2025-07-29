import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace with your actual ngrok domain
const NGROK_DOMAIN = '5f0673cf773d.ngrok-free.app';    //frontend url 

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access (required for ngrok)
    allowedHosts: [NGROK_DOMAIN], // Whitelist ngrok domain
  },
});


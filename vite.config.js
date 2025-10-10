import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["prime-modules.onrender.com"], // 👈 agrega tu dominio Render
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
  },
});

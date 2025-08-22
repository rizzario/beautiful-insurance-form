import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: replace with your repo name if deploying later
export default defineConfig({
  plugins: [react()],
  base: "/beautiful-insurance-form/",
});
// End of vite.config.js
// --- IGNORE ---
import { defineConfig } from "vite";
import { enterDevPlugin, enterProdPlugin } from "vite-plugin-enter-dev";

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [...enterProdPlugin(), ...enterDevPlugin()],
});

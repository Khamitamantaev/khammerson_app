import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";
  const port = parseInt(env.VITE_PORT);
  console.log("VITE RUNNING PORT: ", port);

  return {
    plugins: [react(), tailwindcss()],

    // Базовый путь
    base: "/",
    // resolve: {
    //   alias: [
    //     {
    //       find: "@server",
    //       replacement: resolve(projectRootDir, "../apps/server/src"),
    //     },
    //     {
    //       find: "@web",
    //       replacement: resolve(projectRootDir, "./src"),
    //     },
    //   ],
    // },
    server: {
      host: true,
      port: port,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      // HMR только для разработки
      hmr: isProd
        ? false
        : {
            clientPort: port,
            protocol: "ws",
            host: "localhost",
          },
      allowedHosts: true,
      // Только для dev режима
      fs: isProd
        ? undefined
        : {
            strict: false,
            allow: [".."],
          },
    },

    preview: {
      port: port,
      host: true,
    },

    // Настройки сборки для production
    build: {
      target: "es2020",
      outDir: "dist",
      sourcemap: !isProd, // sourcemap только в dev
      minify: "esbuild",
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        output: {
          // Разделение кода на чанки
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },

      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    // Оптимизация зависимостей
    optimizeDeps: {
      include: ["react", "react-dom"],
    },

    // Определение переменных окружения для сборки
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  };
});

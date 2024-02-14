import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: env.PUBLIC_URL,
    server: {
      port: 3000,
      proxy: {       
        // In order for the Core canonical routes to work you must assume that
        // everything gets proxied to Core, absolutely everything, except the
        // things which are expressly served from the dev server. So we will
        // bypass proxying only for the following:
        // /@*, /src*, /node_modules*, /index.html, and /
        '^(?!(/@|/src|/node_modules|/index.html|/$)).*$': {
          target: env.REACT_APP_PROXY_HOST,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env': env,
    }
  };
})

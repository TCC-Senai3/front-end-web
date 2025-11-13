import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // Habilita o Fast Refresh
        fastRefresh: true,
        // Configura o JSX para funcionar em arquivos .js
        include: '**/*.{jsx,js}',
        // Configura o JSX
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ],
    // Configuração para lidar com arquivos estáticos
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    resolve: {
      alias: {
        // Aliases de caminho
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@config': path.resolve(__dirname, './src/config'),
      },
      extensions: ['.js', '.jsx', '.json'],
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Configuração do proxy para a API
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // Configuração do WebSocket
        '/ws': {
          target: env.VITE_WS_URL || 'ws://localhost:8080/ws',
          ws: true,
          changeOrigin: true,
        },
      },
    },
    define: {
      'process.env': {},
      __APP_ENV__: JSON.stringify(env.NODE_ENV || 'development'),
      global: 'window',
    },
    // Prefixo para variáveis de ambiente
    envPrefix: ['VITE_', 'REACT_APP_'],
  };
});

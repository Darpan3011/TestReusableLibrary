import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  //   proxy: {
  //     '/auth': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       configure: (proxy) => {
  //         proxy.on('proxyRes', (proxyRes) => {
  //           const setCookie = proxyRes.headers['set-cookie'];
  //           if (setCookie) {
  //             proxyRes.headers['set-cookie'] = setCookie.map(c =>
  //               c.replace(/Domain=localhost:8080/gi, 'Domain=localhost')
  //             );
  //           }
  //         });
  //       }
  //     },
  //     '/smpp': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: {
  //         'localhost:8080': 'localhost:3000'
  //       }
  //     },
  //     '/ai/test': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: {
  //         'localhost:8080': 'localhost:3000'
  //       }
  //     },
  //     '/email/test': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: {
  //         'localhost:8080': 'localhost:3000'
  //       }
  //     },
  //     '/api': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: {
  //         'localhost:8080': 'localhost:3000'
  //       }
  //     },
  //     '/oauth2': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: {
  //         'localhost:8080': 'localhost:3000'
  //       }
  //     },
  //     '/logout': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: {
  //         'localhost:8080': 'localhost:3000'
  //       }
  //     }
  //   }
  }
}
)

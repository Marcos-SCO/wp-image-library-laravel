import { defineConfig } from 'vite';

import { viteStaticCopy } from 'vite-plugin-static-copy';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

import path from 'path';

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler' // or "modern"
            }
        }
    },
    server: {
        host: true, // Allow access from the network
        port: 5173, // Use the port exposed in Docker app service
        strictPort: true, // Fail if the port is already in use
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
        watch: {
            usePolling: true, // Enable polling for file changes
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/scss/app.scss', 'resources/js/app.js'],
            refresh: true,
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/svg/*.svg',
                    dest: 'assets/svg',
                },
                {
                    src: 'resources/img/*',
                    dest: 'assets/img',
                }
            ]
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname),
            '@resources': path.resolve(__dirname, 'resources'),
        }
    }
});

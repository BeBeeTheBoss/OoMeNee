import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { networkInterfaces } from 'node:os';

function resolveDevelopmentHost() {
    if (process.env.VITE_DEV_HOST) {
        return process.env.VITE_DEV_HOST;
    }

    try {
        const virtualInterface = /^(br-|docker|lo$|tailscale|veth|virbr|vmnet)/i;
        const addresses = Object.entries(networkInterfaces())
            .filter(([name]) => !virtualInterface.test(name))
            .flatMap(([, entries]) => entries ?? [])
            .filter((address) => (address.family === 'IPv4' || address.family === 4) && !address.internal)
            .map((address) => address.address);

        return addresses.find((address) => address.startsWith('192.168.'))
            ?? addresses.find((address) => address.startsWith('10.'))
            ?? addresses.find((address) => /^172\.(1[6-9]|2\d|3[01])\./.test(address))
            ?? addresses[0]
            ?? '127.0.0.1';
    } catch {
        return '127.0.0.1';
    }
}

const developmentHost = resolveDevelopmentHost();

export default defineConfig({
    server: {
        host: '0.0.0.0',
        cors: true,
        origin: `http://${developmentHost}:5173`,
        hmr: {
            host: developmentHost,
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});

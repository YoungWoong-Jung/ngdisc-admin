/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '172.100.100.142',
                port: '',
                pathname: '/api/cdn/**/*.{png,jpg,jpeg,gif,webp,svg}',
            },
        ],
    },
    webpack: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
            ignored: ['node_modules', 'dist', '.next', 'public'],
        };
        return config;
    },
    basePath: '/admin',
};

export default nextConfig;

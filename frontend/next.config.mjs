import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      'react-router-dom': './src/utils/routerShim.jsx',
      'components': './src/component',
      '@/components': './src/component',
      'views': './src/views',
      '@/views': './src/views',
      'pages': './src/views',
      '@/pages': './src/views',
    },
  },
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/utils/routerShim.jsx');
    config.resolve.alias['components'] = path.resolve(__dirname, 'src/component');
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/component');
    config.resolve.alias['views'] = path.resolve(__dirname, 'src/views');
    config.resolve.alias['@/views'] = path.resolve(__dirname, 'src/views');
    config.resolve.alias['pages'] = path.resolve(__dirname, 'src/views');
    config.resolve.alias['@/pages'] = path.resolve(__dirname, 'src/views');
    return config;
  },
};

export default nextConfig;

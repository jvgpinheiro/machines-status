/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tractian-img.s3.amazonaws.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;

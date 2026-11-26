const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "images.unsplash.com"
    }]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  poweredByHeader: false
};
export default nextConfig;

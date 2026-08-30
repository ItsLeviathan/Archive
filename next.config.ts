import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" }, // real photos, once PEXELS_API_KEY is set
      { protocol: "https", hostname: "picsum.photos" },     // zero-setup fallback
    ],
  },
};

export default nextConfig;
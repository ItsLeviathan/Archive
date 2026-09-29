import type { NextConfig } from "next";

// Writer-uploaded story photos are served from this project's Supabase
// Storage bucket (see lib/photos.ts and supabase/add-story-photos.sql).
const supabaseHost = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/story-photos/**" },
    ],
  },
};

export default nextConfig;

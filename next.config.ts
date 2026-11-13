import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If you don't actually need custom webpack logic, DELETE the 'webpack' block.
  
  // If you want to keep using Turbopack, add an empty config:
  turbopack: {},
  allowedDevOrigins: ['10.218.244.45', 'localhost'],

};

export default nextConfig;
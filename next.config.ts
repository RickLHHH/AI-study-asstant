import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化配置（Railway 需要禁用）
  images: {
    unoptimized: true,
  },
  
  // 禁用 powered-by 头
  poweredByHeader: false,
};

export default nextConfig;

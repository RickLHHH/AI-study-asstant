import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 输出独立文件夹，优化部署
  output: 'standalone',
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 禁用 powered-by 头
  poweredByHeader: false,
};

export default nextConfig;

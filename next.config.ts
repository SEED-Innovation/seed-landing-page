import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale/courts",
        destination: "/:locale/facilities",
        permanent: true,
      },
      {
        source: "/:locale/courts/:id",
        destination: "/:locale/facilities/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

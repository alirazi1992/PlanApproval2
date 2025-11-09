import withSuperjson from "next-superjson-plugin";

const nextConfig = {
  experimental: {
    serverActions: true
  }
};

export default withSuperjson()(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // Shared hosting (Argeweb/Yourhosting) enforces a low process limit
  // (CloudLinux CageFS); the default multi-worker build spawns enough
  // node processes to hit EAGAIN, so keep the build single-threaded.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;

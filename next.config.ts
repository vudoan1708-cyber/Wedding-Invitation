import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships a WASM build and reads its own files at runtime, so it must be
  // required at runtime rather than bundled. Local development only — the
  // package is a devDependency and is never loaded in production.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;

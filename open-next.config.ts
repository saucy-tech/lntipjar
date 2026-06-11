import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Single static page; /api/invoice (NWC) is dynamic and bypasses the cache.
export default {
  ...defineCloudflareConfig({
    incrementalCache: staticAssetsIncrementalCache,
  }),
  // Don't shell out to `yarn build` (yarn classic may not be on PATH).
  buildCommand: "npx next build",
};

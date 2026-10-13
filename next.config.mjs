import { readFileSync } from "node:fs"

// The static site was authored for a host that understands Netlify's _redirects
// file. Next.js does not, so its "200" rules are translated to rewrites here.
function rewritesFromRedirectsFile() {
  const lines = readFileSync(new URL("./public/_redirects", import.meta.url), "utf8").split("\n")

  return lines
    .map((line) => line.trim().split(/\s+/))
    .filter(([from, to, status]) => from?.startsWith("/") && to?.startsWith("/") && status === "200")
    .map(([source, destination]) => ({ source, destination }))
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      ...rewritesFromRedirectsFile(),
      { source: "/blog/:slug", destination: "/blog/:slug/index.html" },
      { source: "/:page", destination: "/:page.html" },
    ]
  },
}

export default nextConfig

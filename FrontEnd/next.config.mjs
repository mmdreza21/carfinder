/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["prisma", "@prisma/client"],
  turbopack: {},

  async headers() {
    const compressedAsset = (extension, contentType) => ({
      source: `/:path*.${extension}.br`,
      headers: [
        { key: "Content-Encoding", value: "br" },
        { key: "Content-Type", value: contentType },
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    });

    return [
      compressedAsset("br", "application/octet-stream"),
      compressedAsset("wasm", "application/wasm"),
      compressedAsset("data", "application/octet-stream"),
      compressedAsset("js", "application/javascript"),
    ];
  },
};

export default nextConfig;

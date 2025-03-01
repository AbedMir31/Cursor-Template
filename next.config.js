/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the images configuration to allow Google profile images
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // ... existing code ...
}

module.exports = nextConfig 
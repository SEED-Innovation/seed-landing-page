import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        destination: '/.well-known/apple-developer-merchantid-domain-association.txt',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless'; // Importe explicitamente o serverless

export default defineConfig({
  integrations: [preact()],
  output: 'static',
  adapter: vercel(),
});

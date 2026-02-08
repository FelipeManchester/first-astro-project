export const prerender = false;

export async function GET() {
  const client_id = process.env.GITHUB_CLIENT_ID;
  // Trocamos o 'url.host' pelo seu domínio real fixo
  const redirect_uri = `https://first-astro-project-zeta.vercel.app/api/callback`;

  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&redirect_uri=${redirect_uri}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: githubUrl,
    },
  });
}

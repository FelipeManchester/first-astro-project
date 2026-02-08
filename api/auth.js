export const prerender = false;

export async function GET({ url }) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = `https://${url.host}/api/callback`;

  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&redirect_uri=${redirect_uri}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: githubUrl,
    },
  });
}

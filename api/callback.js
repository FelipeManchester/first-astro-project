// create a callback endpoint to handle GitHub OAuth redirect
export const prerender = false;
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id,
        client_secret,
      }),
    },
  );
  const tokenData = await tokenResponse.json();
  const access_token = tokenData.access_token;
  return new Response(JSON.stringify({ access_token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

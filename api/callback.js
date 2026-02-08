export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id, client_secret, code }),
  });

  const data = await response.json();
  const content = JSON.stringify({
    token: data.access_token,
    provider: 'github',
  });

  return new Response(
    `<script>
      window.opener.postMessage("authorization:github:success:${content}", window.location.origin);
    </script>`,
    { headers: { 'Content-Type': 'text/html' } },
  );
}

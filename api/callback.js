export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ client_id, client_secret, code }),
      },
    );

    const data = await response.json();
    const content = JSON.stringify({
      token: data.access_token,
      provider: 'github',
    });

    // Este script comunica o token de volta para a janela do CMS
    const html = `
      <script>
        const res = ${content};
        window.opener.postMessage(
          "authorization:github:success:" + JSON.stringify(res),
          window.location.origin
        );
      </script>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    return new Response('Erro: ' + err.message, { status: 500 });
  }
}

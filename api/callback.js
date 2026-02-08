export const prerender = false;

export async function GET(context) {
  // Pegamos a URL da requisição de forma segura
  const url = new URL(context.request.url);
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

    // Se o GitHub retornar erro (ex: código expirado)
    if (data.error) {
      return new Response(`Erro do GitHub: ${data.error_description}`, {
        status: 400,
      });
    }

    const content = JSON.stringify({
      token: data.access_token,
      provider: 'github',
    });

    // O script que fecha o pop-up e loga no CMS
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
    return new Response('Erro interno no callback: ' + err.message, {
      status: 500,
    });
  }
}

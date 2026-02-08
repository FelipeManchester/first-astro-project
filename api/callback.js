export const prerender = false;

export async function GET(context) {
  // Tentativa tripla para pegar a URL: pelo contexto, pela request ou pela URL da janela
  const requestUrl = context?.request?.url || context?.url || '';

  if (!requestUrl) {
    return new Response('Erro: URL não encontrada no contexto da Vercel', {
      status: 500,
    });
  }

  const url = new URL(requestUrl);
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

    if (data.error) {
      return new Response(`Erro do GitHub: ${data.error_description}`, {
        status: 400,
      });
    }

    const content = JSON.stringify({
      token: data.access_token,
      provider: 'github',
    });

    return new Response(
      `<script>
        window.opener.postMessage("authorization:github:success:${content.replace(/"/g, '\\"')}", window.location.origin);
      </script>`,
      { headers: { 'Content-Type': 'text/html' } },
    );
  } catch (err) {
    return new Response('Erro interno: ' + err.message, { status: 500 });
  }
}

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

    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <script>
          (function() {
            const res = ${content};
            // Usamos a URL do seu site para garantir que a mensagem chegue ao lugar certo
            const targetOrigin = "https://first-astro-project-zeta.vercel.app";
            
            window.opener.postMessage(
              "authorization:github:success:" + JSON.stringify(res),
              targetOrigin
            );
            
            setTimeout(() => {
              window.close();
            }, 500);
          })();
        </script>
        <p style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          Autenticado com sucesso! Fechando janela...
        </p>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    return new Response('Erro interno: ' + err.message, { status: 500 });
  }
}

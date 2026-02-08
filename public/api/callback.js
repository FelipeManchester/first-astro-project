export default async function handler(req, res) {
  const { code } = req.query;
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
        body: JSON.stringify({
          client_id,
          client_secret,
          code,
        }),
      },
    );

    const data = await response.json();

    // Script para enviar o token de volta para a janela do CMS
    const script = `
      <script>
        const res = ${JSON.stringify({
          token: data.access_token,
          provider: 'github',
        })};
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify(res),
          window.location.origin
        );
      </script>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(script);
  } catch (error) {
    res.status(500).send('Erro na autenticação');
  }
}

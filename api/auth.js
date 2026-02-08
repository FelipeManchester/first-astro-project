export const prerender = false;

export async function GET({ redirect }) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = `https://first-astro-project-zeta.vercel.app/api/callback`;

  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&redirect_uri=${redirect_uri}`,
  );
}

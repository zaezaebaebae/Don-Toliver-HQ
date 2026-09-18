async function pollReleases() {
  const app = process.env.NEXT_PUBLIC_APP_URL;
  const secret = process.env.CRON_SECRET;

  if (!app || !secret) {
    throw new Error("NEXT_PUBLIC_APP_URL or CRON_SECRET is missing");
  }

  const response = await fetch(`${app}/api/cron/releases`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  if (!response.ok) {
    throw new Error(`Release poll failed: ${response.statusText}`);
  }

  console.log(await response.json());
}

pollReleases().catch((err) => {
  console.error(err);
  process.exit(1);
});
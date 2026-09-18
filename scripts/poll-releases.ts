const app = process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.CRON_SECRET;
if (!app || !secret) throw new Error("NEXT_PUBLIC_APP_URL and CRON_SECRET are required");
const response = await fetch(`${app}/api/cron/releases`, { headers: { Authorization: `Bearer ${secret}` } });
if (!response.ok) throw new Error(`Release poll failed: ${response.status} ${await response.text()}`);
console.log(await response.json());

import { prisma } from "@/lib/prisma";

async function getZohoAccessToken() {
  const cachedToken = await prisma.zohoAuth.findUnique({ where: { id: "zoho_token" } });

  const fiveMinutesFromNow = Date.now() + 300000;
  if (cachedToken && cachedToken.expiresAt.getTime() > fiveMinutesFromNow) {
    return cachedToken.accessToken;
  }

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await fetch(`https://accounts.zoho.in/oauth/v2/token`, {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    throw new Error("Failed to generate Zoho access token");
  }

  const data = await res.json();

  const expiresInSeconds = data.expires_in || 3600;
  const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

  await prisma.zohoAuth.upsert({
    where: { id: "zoho_token" },
    update: {
      accessToken: data.access_token,
      expiresAt: expirationDate,
    },
    create: {
      id: "zoho_token",
      accessToken: data.access_token,
      expiresAt: expirationDate,
    },
  });

  return data.access_token;
}

export async function pushLeadToZoho(leadData: any) {
  try {
    const accessToken = await getZohoAccessToken();

    const res = await fetch("https://www.zohoapis.in/crm/v2/Leads", {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [leadData],
        trigger: ["workflow"],
      }),
    });

    const result = await res.json();
    
    if (result.data && result.data[0].code === "SUCCESS") {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}
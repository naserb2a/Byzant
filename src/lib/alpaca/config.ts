export function getAlpacaOAuthConfig() {
  const clientId = process.env.ALPACA_CLIENT_ID;
  const clientSecret = process.env.ALPACA_CLIENT_SECRET;
  const redirectUri = process.env.ALPACA_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Alpaca OAuth environment is not configured");
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

export function getAlpacaApiConfig() {
  return {
    baseUrl: process.env.ALPACA_BASE_URL ?? "https://api.alpaca.markets",
    dataUrl: process.env.ALPACA_DATA_URL ?? "https://data.alpaca.markets",
  };
}

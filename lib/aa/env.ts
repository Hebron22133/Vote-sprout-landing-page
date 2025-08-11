export function getPimlicoChain() {
  // "base" or "base-sepolia"
  const c = (process.env.NEXT_PUBLIC_PIMLICO_CHAIN || "base").toLowerCase()
  if (c !== "base" && c !== "base-sepolia") return "base"
  return c
}

export function getPimlicoRpcUrl() {
  const chain = getPimlicoChain()
  const key = process.env.PIMLICO_API_KEY
  // Server-only key. On client, this will be undefined; routes proxy the calls.
  // We'll still construct the URL on the server route.
  return `https://api.pimlico.io/v2/${chain}/rpc${key ? `?apikey=${key}` : ""}`
}

export function getBaseScanTxUrl(hash: string) {
  const chain = getPimlicoChain()
  return chain === "base-sepolia"
    ? `https://sepolia.basescan.org/tx/${hash}`
    : `https://basescan.org/tx/${hash}`
}

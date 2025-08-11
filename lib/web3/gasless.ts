export async function simulateGaslessTx(action: string): Promise<{ hash: string }> {
  // Placeholder for Paymaster-powered transaction. Replace with real call.
  await new Promise((r) => setTimeout(r, 1200))
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const hash = "0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")
  return { hash }
}

export function basescanTxUrl(hash: string) {
  return `https://basescan.org/tx/${hash}`
}

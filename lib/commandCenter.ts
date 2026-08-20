export async function notifyCommandCenter(payload: Record<string, unknown>) {
  const url = process.env.COMMAND_CENTER_URL;
  const key = process.env.COMMAND_CENTER_API_KEY;
  if (!url || !key) return { status: 'skipped' as const };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-command-center-key': key },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });
    const result = await response.json().catch(() => ({})) as { id?: string; error?: string };
    if (!response.ok) throw new Error(result.error || `Command Center ${response.status}`);
    return { status: 'sent' as const, id: result.id };
  } catch (error) {
    console.error('[caribbean-buggy-command-center]', error);
    return { status: 'failed' as const };
  }
}

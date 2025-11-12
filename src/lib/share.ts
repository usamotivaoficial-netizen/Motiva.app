export async function shareQuote(text: string, title: string = 'Motiva'): Promise<boolean> {
  // Try native share API first
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text
      });
      return true;
    } catch (err) {
      // User cancelled or error - fall through to clipboard
      if (err instanceof Error && err.name === 'AbortError') {
        return false;
      }
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Erro ao copiar:', err);
      return false;
    }
  }

  return false;
}

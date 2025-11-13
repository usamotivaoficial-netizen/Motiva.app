/**
 * Share helper for web/mobile environments
 * Handles native share API and clipboard fallback with robust error handling
 */

export async function shareQuote(text: string): Promise<'shared' | 'copied' | 'unavailable' | 'error'> {
  try {
    // 1) Web Share API (quando disponível)
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ text });
        return 'shared';
      } catch (err) {
        // se o utilizador cancelar ou falhar, continua para fallback
      }
    }

    // 2) Clipboard API moderna
    if (typeof navigator !== 'undefined' && (navigator as any).clipboard?.writeText) {
      try {
        await (navigator as any).clipboard.writeText(text);
        return 'copied';
      } catch (err: any) {
        // Em ambientes como o preview da Lasy, o browser pode bloquear:
        // NotAllowedError, Permissions, etc. Neste caso não rebentar.
        if (err && err.name === 'NotAllowedError') {
          return 'unavailable';
        }
      }
    }

    // 3) Fallback legacy com textarea + execCommand
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
          return 'copied';
        }
      } catch {
        document.body.removeChild(textarea);
      }
    }

    return 'unavailable';
  } catch (e) {
    return 'error';
  }
}

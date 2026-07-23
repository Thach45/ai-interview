/**
 * Sanitize prompt input to prevent prompt-injection attacks.
 * Strips common injection patterns from user-provided text.
 */
export function sanitizePrompt(input: string): string {
  if (!input) return input;

  let sanitized = input;

  // Remove common prompt injection patterns
  const injectionPatterns = [
    /(?:(?:ignore|forget|disregard|override|bypass)\s+(?:all\s+)?(?:previous|above|below|instructions|commands|prompts?))/gi,
    /(?:you\s+(?:are\s+(?:now|not|free)|must\s+(?:not|ignore|act)))/gi,
    /(?:system\s*(?:prompt|message|instruction))/gi,
    /(?:\[?\s*(?:system|user|assistant|ai)\s*\]?\s*:)/gi,
    /(?:<\s*(?:system|user|assistant|ai)\s*>)/gi,
    /(?:role[-_]?(?:play|switch|change))/gi,
    /(?:do\s+(?:not|n't)\s+(?:follow|listen|obey))/gi,
    /(?:new\s+instructions?\s*:)/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  }

  return sanitized;
}

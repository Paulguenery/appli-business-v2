export function validateMessage(message: string): { isValid: boolean; error?: string } {
  // Regex patterns
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phonePattern = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
  const urlPattern = /(https?:\/\/[^\s]+)|\b(?:www\.)[^\s]+\.[^\s]+/;

  if (emailPattern.test(message)) {
    return {
      isValid: false,
      error: 'Les adresses email ne sont pas autorisées dans les messages'
    };
  }

  if (phonePattern.test(message)) {
    return {
      isValid: false,
      error: 'Les numéros de téléphone ne sont pas autorisés dans les messages'
    };
  }

  if (urlPattern.test(message)) {
    return {
      isValid: false,
      error: 'Les liens et sites web ne sont pas autorisés dans les messages'
    };
  }

  return { isValid: true };
}
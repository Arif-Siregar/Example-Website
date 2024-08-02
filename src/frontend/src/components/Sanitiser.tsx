// Function used to sanitise URL parameters:
export function sanitizeInput(input: any){
    if (typeof input !== 'string') {
      return '';
    }
    // Prevent SQL Injection (using parameterized queries)
    const sanitizedInput = input.replaceAll(/['";]/g, ''); // Remove characters that might be used in SQL injection attacks
  
    // Prevent Cross-Site Scripting (XSS) attacks
    const sanitizedHTML = sanitizedInput.replace(/[<>&]/g, (char) => {
      switch (char) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        default:
          return char;
      }
    });
    return sanitizedHTML;
  };
  
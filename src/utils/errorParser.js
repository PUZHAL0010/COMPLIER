/**
 * Smart Error Parser & Diagnostic Engine
 * Analyzes JavaScript/HTML/CSS runtime & syntax errors and provides
 * human-readable explanations and actionable fix suggestions.
 */

export function analyzeError(errorMessage = '', stack = '', userCode = {}) {
  const msg = String(errorMessage);

  // 1. ReferenceError: X is not defined
  if (msg.includes('ReferenceError') || msg.includes('is not defined')) {
    const match = msg.match(/([a-zA-Z0-9_$]+) is not defined/);
    const varName = match ? match[1] : 'variable';
    return {
      title: `Undefined Variable: '${varName}'`,
      category: 'Reference Error',
      explanation: `You are trying to access '${varName}', but it has not been declared yet in this scope.`,
      suggestion: `Declare '${varName}' using 'const', 'let', or 'var' before using it, or verify that the spelling matches existing variables.`,
      exampleCode: `const ${varName} = document.getElementById('${varName.toLowerCase()}') || "value";`
    };
  }

  // 2. TypeError: Cannot read properties of null / undefined
  if (msg.includes('TypeError') && (msg.includes('null') || msg.includes('undefined') || msg.includes('Cannot read property'))) {
    return {
      title: 'Null / Undefined Property Access',
      category: 'Type Error',
      explanation: 'You are attempting to access a property or method on an element or object that currently evaluates to null or undefined (e.g. document.getElementById returned null).',
      suggestion: 'Ensure the target HTML element exists before running JS, or use optional chaining (?.) or null checks.',
      exampleCode: `const el = document.getElementById('myElement');\nif (el) {\n  el.textContent = 'Hello World';\n}`
    };
  }

  // 3. SyntaxError: Unexpected token / missing bracket
  if (msg.includes('SyntaxError') || msg.includes('Unexpected token')) {
    return {
      title: 'Syntax Error in Code',
      category: 'Syntax Error',
      explanation: 'JavaScript encountered an invalid syntax structure. Common causes include unclosed parentheses, missing quotes, or misplaced commas.',
      suggestion: 'Check your code for missing closing brackets `}`, `)`, or quotes `"` near the reported line number.',
      exampleCode: `// Example fix: Ensure all strings and blocks are closed properly.\nfunction example() {\n  console.log("Properly closed string");\n}`
    };
  }

  // 4. Unhandled Promise Rejection / Fetch Error
  if (msg.includes('Promise Rejection') || msg.includes('Failed to fetch')) {
    return {
      title: 'Failed Network Request or Promise Rejection',
      category: 'Async Rejection',
      explanation: 'An asynchronous promise was rejected without a `.catch()` block, or an API fetch request failed (possibly due to CORS or network errors).',
      suggestion: 'Wrap your asynchronous `fetch` calls in `try...catch` blocks or append `.catch(err => console.error(err))`.',
      exampleCode: `async function fetchData() {\n  try {\n    const res = await fetch('https://api.example.com');\n    const data = await res.json();\n  } catch (err) {\n    console.error('Fetch failed:', err);\n  }\n}`
    };
  }

  // 5. Maximum call stack size exceeded (Recursion)
  if (msg.includes('Maximum call stack size exceeded')) {
    return {
      title: 'Infinite Recursion Detected',
      category: 'Stack Overflow',
      explanation: 'A function is calling itself repeatedly without a proper base condition to terminate the loop.',
      suggestion: 'Add a termination check condition to break out of recursive calls.',
      exampleCode: `function count(n) {\n  if (n <= 0) return; // Base condition\n  count(n - 1);\n}`
    };
  }

  // Default Fallback
  return {
    title: 'Runtime Execution Warning',
    category: 'Runtime Warning',
    explanation: msg,
    suggestion: 'Review the line number and stack trace above to isolate the failing statement.',
    exampleCode: null
  };
}

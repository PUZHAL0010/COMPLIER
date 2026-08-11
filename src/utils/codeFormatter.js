import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserEstree from 'prettier/plugins/estree';
import parserHtml from 'prettier/plugins/html';
import parserPostcss from 'prettier/plugins/postcss';

/**
 * Format Code using Prettier in browser
 * Supports 'html', 'css', and 'javascript'
 */
export async function formatCode(code = '', language = 'javascript') {
  if (!code || !code.trim()) return { formatted: code, error: null };

  try {
    let parser = 'babel';
    let plugins = [parserBabel, parserEstree];

    if (language === 'html') {
      parser = 'html';
      plugins = [parserHtml];
    } else if (language === 'css') {
      parser = 'css';
      plugins = [parserPostcss];
    } else if (language === 'javascript' || language === 'js') {
      parser = 'babel';
      plugins = [parserBabel, parserEstree];
    }

    const formatted = await prettier.format(code, {
      parser: parser,
      plugins: plugins,
      singleQuote: true,
      tabWidth: 2,
      semi: true,
      trailingComma: 'es5',
      printWidth: 80,
    });

    return { formatted, error: null };
  } catch (err) {
    console.warn(`Prettier formatting warning for ${language}:`, err);
    return { formatted: code, error: err.message };
  }
}

export interface MarkdownStripperOptions {
    /** e.g. "•" or false to remove entirely */
    listUnicodeChar?: string | false;
    /** strip leading bullets/numbers from lists */
    stripListLeaders?: boolean;
    /** GitHub‑flavored tweaks: code fences, setext headers, strikethrough */
    gfm?: boolean;
    /** keep the alt‑text from images instead of dropping the entire `![…]` */
    useImgAltText?: boolean;
    /** remove markdown abbreviation definitions like `*[ABC]: …` */
    abbr?: boolean;
    /** keep link text instead of URL, or vice versa */
    replaceLinksWithURL?: boolean;
    /** tags to leave in place (e.g. ["a","code"]) */
    htmlTagsToSkip?: string[];
    /** if true, re‑throw internal errors instead of returning raw markdown */
    throwError?: boolean;
  }
  
  export default function markdownStripper(
    md: string,
    opts?: MarkdownStripperOptions
  ): string {
    const defaultOptions = {
      listUnicodeChar: false,
      stripListLeaders: true,
      gfm: true,
      useImgAltText: true,
      abbr: false,
      replaceLinksWithURL: false,
      htmlTagsToSkip: [] as string[],
      throwError: false,
    };
    const options = { ...defaultOptions, ...(opts ?? {}) } as Required<MarkdownStripperOptions>;
  
    // 0) Unescape escaped markdown characters
    let output = md.replace(/\\([\\`*_{}\[\]()#+\-.!])/g, '$1');
  
    // 1) Remove horizontal rules (lines with 3+ identical -, _, or *)
    output = output.replace(
      /^ {0,3}((?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/gm,
      ''
    );
  
    // 2) Strip list leaders, preserving indentation
    if (options.stripListLeaders) {
      const listRe = /^[ \t]*(?:\d+\.|[\*\-\+])\s+/gm;
      const indentRe = /^([ \t]*)(?:\d+\.|[\*\-\+])\s+/gm;
      if (options.listUnicodeChar) {
        const uc = options.listUnicodeChar;
        // keep indentation and replace bullet with unicode char
        output = output.replace(indentRe, `$1${uc} `);
      } else {
        // remove only the bullet and following space, keep indentation
        output = output.replace(indentRe, '$1');
      }
    }
  
    // 3) GitHub‑flavored markdown tweaks
    if (options.gfm) {
      output = output
        .replace(/\n={2,}/g, '\n')
        .replace(/~{3}.*\n/g, '')
        .replace(/`{3}.*\n/g, '')
        .replace(/~~/g, '');
    }
  
    // 4) Abbreviations
    if (options.abbr) {
      output = output.replace(/^\*\[.*\]:.*$/gm, '');
    }
  
    // 5) Strip HTML tags
    const htmlRe = options.htmlTagsToSkip.length
      ? new RegExp(
          `<(?!\\/?(?:${options.htmlTagsToSkip.join('|')})(?=>|\\s[^>]*>))[^>]*>`,
          'g'
        )
      : /<[^>]*>/g;
    output = output.replace(htmlRe, '');
  
    // 6) Remove setext‑style headers, footnotes, reference links
    output = output
      .replace(/^[=-]{2,}\s*$/gm, '')
      .replace(/\[\^.+?\](\: .*?$)?/gm, '')
      .replace(/^\s{0,2}\[.*?\]: .*$/gm, '');
  
    // 7) Remove images
    output = output.replace(/!\[(.*?)\]\(.*?\)/g, options.useImgAltText ? '$1' : '');
  
    // 8) Remove inline links
    output = output.replace(/\[(.*?)\]\((.*?)\)/g, options.replaceLinksWithURL ? '$2' : '$1');
  
    // 9) Remove code blocks
    output = output.replace(/(`{3,})([\s\S]*?)\1/gm, '$2');
  
    // 10) Remove inline code
    output = output.replace(/`(.+?)`/g, '$1');
  
    // 11) Process lines for blockquotes & ATX headings
    output = output
      .split('\n')
      .map(line => {
        // strip leading >
        const stripped = line.replace(/^[ \t]*>\s?/, '');
        // ATX heading: keep only text if space after #
        const m = stripped.match(/^#{1,6}\s+(.*?)\s*(?:#+\s*)?$/);
        return m ? m[1] : stripped;
      })
      .join('\n');
  
    // 12) Emphasis removal: bold, italic, underline
    output = output.replace(/\*\*(?!\s)([\s\S]*?\S)\*\*/g, '$1');
    output = output.replace(/\*(?!\s)([\s\S]*?\S)\*/g, '$1');
    output = output.replace(/__(?!\s)([\s\S]*?\S)__/g, '$1');
    output = output.replace(/_(?!\s)([\s\S]*?\S)_/g, '$1');
    output = output.replace(/~{1,2}(.+?)~{1,2}/g, '$1');
  
    return output;
  }
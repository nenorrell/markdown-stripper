// __tests__/markdown-stripper.test.ts

import markdownStripper from '../src/utils/markdown-stripper';

describe('markdownStripper', () => {
  it('should leave a string alone without markdown', () => {
    const input = 'Javascript Developers are the best.';
    expect(markdownStripper(input)).toBe(input);
  });

  it('should strip out remaining markdown', () => {
    const input = '*Javascript* developers are the _best_.';
    const expected = 'Javascript developers are the best.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should leave non-matching markdown markdown', () => {
    const input = '*Javascript* developers* are the _best_.';
    const expected = 'Javascript developers* are the best.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should leave non-matching markdown, but strip empty anchors', () => {
    const input = '*Javascript* [developers]()* are the _best_.';
    const expected = 'Javascript developers* are the best.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should strip HTML', () => {
    const input = '<p>Hello World</p>';
    const expected = 'Hello World';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should strip anchors', () => {
    const input =
      '*Javascript* [developers](https://engineering.condenast.io/)* are the _best_.';
    const expected = 'Javascript developers* are the best.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should strip img tags', () => {
    const input =
      '![](https://placebear.com/640/480)*Javascript* developers are the _best_.';
    const expected = 'Javascript developers are the best.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should use the alt-text of an image, if it is provided', () => {
    const input =
      '![This is the alt-text](https://www.example.com/images/logo.png)';
    const expected = 'This is the alt-text';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should strip code tags', () => {
    const input = 'In `Getting Started` we set up `something` foo.';
    const expected = 'In Getting Started we set up something foo.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should leave hashtags in headings', () => {
    const input = '## This #heading contains #hashtags';
    const expected = 'This #heading contains #hashtags';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove emphasis', () => {
    const input = 'I italicized an *I* and it _made_ me *sad*.';
    const expected = 'I italicized an I and it made me sad.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove emphasis only if there is no space between word and emphasis characters.', () => {
    const input =
      'There should be no _space_, *before* *closing * _ephasis character _.';
    const expected =
      'There should be no space, before *closing * _ephasis character _.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove "_" emphasis only if there is space before opening and after closing emphasis characters.', () => {
    const input =
      '._Spaces_ _ before_ and _after _ emphasised character results in no emphasis.';
    const expected =
      '.Spaces _ before_ and _after _ emphasised character results in no emphasis.';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove double emphasis', () => {
    const input = '**this sentence has __double styling__**';
    const expected = 'this sentence has double styling';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should not mistake a horizontal rule when symbols are mixed ', () => {
    const input = 'Some text on a line\n\n--*\n\nA line below';
    const expected = 'Some text on a line\n\n--*\n\nA line below';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove horizontal rules', () => {
    const input = 'Some text on a line\n\n---\n\nA line below';
    const expected = 'Some text on a line\n\nA line below';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove horizontal rules with space-separated asterisks', () => {
    const input = 'Some text on a line\n\n* * *\n\nA line below';
    const expected = 'Some text on a line\n\nA line below';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove blockquotes', () => {
    const input = '>I am a blockquote';
    const expected = 'I am a blockquote';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove blockquotes with spaces', () => {
    const input = '> I am a blockquote';
    const expected = 'I am a blockquote';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove indented blockquotes', () => {
    const tests = [
      { input: ' > I am a blockquote', expected: 'I am a blockquote' },
      { input: '  > I am a blockquote', expected: 'I am a blockquote' },
      { input: '   > I am a blockquote', expected: 'I am a blockquote' },
    ] as const;

    tests.forEach(({ input, expected }) => {
      expect(markdownStripper(input)).toBe(expected);
    });
  });

  it('should remove blockquotes over multiple lines', () => {
    const input =
      '> I am a blockquote firstline  \n>I am a blockquote secondline';
    const expected =
      'I am a blockquote firstline  \nI am a blockquote secondline';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should remove blockquotes following other content', () => {
    const input =
      '## A headline\n\nA paragraph of text\n\n> I am a blockquote';
    const expected =
      'A headline\n\nA paragraph of text\n\nI am a blockquote';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should not remove greater than signs', () => {
    const tests = [
      { input: '100 > 0', expected: '100 > 0' },
      { input: '100 >= 0', expected: '100 >= 0' },
      { input: '100>0', expected: '100>0' },
      { input: '> 100 > 0', expected: '100 > 0' },
      { input: '1 < 100', expected: '1 < 100' },
      { input: '1 <= 100', expected: '1 <= 100' },
    ] as const;

    tests.forEach(({ input, expected }) => {
      expect(markdownStripper(input)).toBe(expected);
    });
  });

  it('should strip unordered list leaders', () => {
    const input =
      'Some text on a line\n\n* A list Item\n* Another list item';
    const expected =
      'Some text on a line\n\nA list Item\nAnother list item';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should strip ordered list leaders', () => {
    const input =
      'Some text on a line\n\n9. A list Item\n10. Another list item';
    const expected =
      'Some text on a line\n\nA list Item\nAnother list item';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should strip list items with bold word in the beginning', () => {
    const input =
      'Some text on a line\n\n- **A** list Item\n- **Another** list item';
    const expected =
      'Some text on a line\n\nA list Item\nAnother list item';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should handle paragraphs with markdown', () => {
    const paragraph =
      '\n## This is a heading ##\n\nThis is a paragraph with [a link](http://www.disney.com/).\n\n### This is another heading\n\nIn `Getting Started` we set up `something` foo.\n\n  * Some list\n  * With items\n    * Even indented';
    const expected =
      '\nThis is a heading\n\nThis is a paragraph with a link.\n\nThis is another heading\n\nIn Getting Started we set up something foo.\n\n  Some list\n  With items\n    Even indented';
    expect(markdownStripper(paragraph)).toBe(expected);
  });

  it('should not strip paragraphs without content', () => {
    const paragraph = '\n#This paragraph\n##This paragraph#';
    expect(markdownStripper(paragraph)).toBe(paragraph);
  });

  it('should not trigger ReDoS with atx-headers', () => {
    const start = Date.now();
    const paragraph =
      '\n## This is a long "' + ' '.repeat(200) + '" heading ##\n';
    const result = markdownStripper(paragraph);
    expect(result).toMatch(
      new RegExp(`\nThis is a long " {200}" heading\n`)
    );
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it('should work fast even with lots of whitespace', () => {
    const input =
      'Some text with lots of                                                                                                                                                                                                       whitespace';
    expect(markdownStripper(input)).toBe(input);
  });

  it('should still remove escaped markdown syntax', () => {
    const input = '\\# Heading in _italic_';
    const expected = 'Heading in italic';
    expect(markdownStripper(input)).toBe(expected);
  });

  it('should skip specified HTML tags when htmlTagsToSkip option is provided', () => {
    const markdown =
      '<div>HTML content <sub>Superscript</sub> <span>span text</span></div>';
    expect(
      markdownStripper(markdown, { htmlTagsToSkip: ['sub'] })
    ).toBe('HTML content <sub>Superscript</sub> span text');
    expect(
      markdownStripper(markdown, { htmlTagsToSkip: ['sub', 'span'] })
    ).toBe(
      'HTML content <sub>Superscript</sub> <span>span text</span>'
    );
  });
});

# Markdown Stripper

[![npm version](https://img.shields.io/npm/v/markdown-stripper.svg)](https://www.npmjs.com/package/markdown-stripper) 
[![Build Status](https://img.shields.io/github/actions/workflow/status/nenorrell/markdown-stripper/ci.yml?branch=main)](https://github.com/nenorrell/markdown-stripper/actions/workflows/ci.yml?query=branch%3Amain) 

A lightweight, zero‑dependency **TypeScript** utility to strip Markdown formatting from a string. Fully typed and customizable.

---

## 🔧 Installation

```bash
npm install markdown-stripper
# or
yarn add markdown-stripper
```

### Dev Dependencies

```bash
npm install --save-dev typescript jest ts-jest @types/jest
```

---

## 🚀 Usage

```ts
import markdownStripper, { MarkdownStripperOptions } from 'markdown-stripper';

const md = `
# Hello **World**

- Item 1
- Item 2
`;

// Basic
console.log(markdownStripper(md));
// Output:
// Hello World
// Item 1
// Item 2

// With options
const opts: MarkdownStripperOptions = {
  listUnicodeChar: '•',
  replaceLinksWithURL: true,
};
console.log(markdownStripper(md, opts));
```

---

## ⚙️ API

### `markdownStripper(md: string, opts?: MarkdownStripperOptions): string`

| Option                | Type           | Default   | Description                                                                   |
|-----------------------|----------------|-----------|-------------------------------------------------------------------------------|
| `listUnicodeChar`     | `string \| false` | `false`   | Replace list bullets (`-`, `*`, `+`, or numbered) with this character.        |
| `stripListLeaders`    | `boolean`      | `true`    | Remove leading list markers (preserves indentation).                          |
| `gfm`                 | `boolean`      | `true`    | Strip GFM features: setext headers, fenced code blocks, strikethrough.        |
| `useImgAltText`       | `boolean`      | `true`    | Keep the alt text of images instead of dropping the entire tag.               |
| `abbr`                | `boolean`      | `false`   | Remove Markdown abbreviation definitions.                                      |
| `replaceLinksWithURL` | `boolean`      | `false`   | If `true`, replaces link text with its URL; otherwise keeps link text.        |
| `htmlTagsToSkip`      | `string[]`     | `[]`      | List of HTML tags (e.g. `['sub']`) to preserve while stripping others.        |
| `throwError`          | `boolean`      | `false`   | Throw on internal errors instead of returning the raw input.                  |

---

## 🧪 Testing

```bash
npm test
```

Uses Jest + `ts-jest` to compile and run TypeScript tests. All tests live in `__tests__/markdown-stripper.test.ts`.

---

## 📦 Build & Publish

```bash
# Build
npm run build

# Publish
git tag vX.Y.Z && git push --tags
npm publish
```

*Ensure you have a valid `package.json` with `main` pointing to `dist/index.js` and `types` to `dist/index.d.ts`.*

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome`)
3. Install dependencies and run tests
4. Commit your changes
5. Push and open a Pull Request

Please follow the existing code style and include tests for new functionality.

---

## 📄 License

[MIT](LICENSE) © Your Name

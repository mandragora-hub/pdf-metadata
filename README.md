# pdf-metadata

Extract metadata, pages and read time from pdf file.

## Install

```bash
npm install pdf-metadata
```

## Example usage

typescript async with pdf file in a server

```typescript
import { loadDocument } from 'pdf-metadata';

const fileUrl = 'https://litterarum.onrender.com/api/v1/files/las-mil-y-una-noches.pdf'
const document = await loadDocument(fileUrl);
const info = await document.getInfo();
console.log(info) // Here we got metadata
```

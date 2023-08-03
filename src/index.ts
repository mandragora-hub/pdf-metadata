import readingTime from "reading-time";
import { getRawTextContent, getMetadataAndPages, fetchData, readFile } from "./lib";
import { isArrayBuffer, isValidFetchUrl, isValidUrl, fileExists } from "./shared";

class Document {
  private readonly arrayBuffer: ArrayBuffer;

  constructor(content: ArrayBuffer) {
    this.arrayBuffer = content;
  }

  async getInfo() {
    const text = await getRawTextContent(this.arrayBuffer);
    const stats = readingTime(text);

    const pdfBuffer = Buffer.from(this.arrayBuffer);
    const { pages, metadata } = await getMetadataAndPages(pdfBuffer);

    return { pages, wordCount: stats.words, readTime: stats.time, metadata };
  }
}

export async function loadDocument(src: string | URL | ArrayBuffer) {
  if (isArrayBuffer(src)) {
    return new Document(src as ArrayBuffer);
  }

  if (src instanceof URL && isValidFetchUrl(src.toString())) {
    const arrayBuffer = await fetchData(src.toString());
    return new Document(arrayBuffer);
  }

  if (typeof src === "string" && isValidUrl(src) && isValidFetchUrl(src)) {
    const arrayBuffer = await fetchData(src);
    return new Document(arrayBuffer);
  }

  if (typeof src === "string" && fileExists(src)) {
    const arrayBuffer = await readFile(src);
    return new Document(arrayBuffer);
  }

  throw new Error("Invalid parameter in getDocument, need parameter object.");
}

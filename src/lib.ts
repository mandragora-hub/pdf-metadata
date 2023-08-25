import { PDFDocument } from "pdf-lib";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf.js";
import workerSrc from "pdfjs-dist/build/pdf.worker.js";
import type { PDFMetadata } from "../types";
import fs from "fs/promises";

GlobalWorkerOptions.workerSrc = workerSrc;

export async function getRawTextContent(pdfBuffer: ArrayBuffer) {
  const loadingTask = getDocument(pdfBuffer);
  return await loadingTask.promise
    .then(async function (doc) {
      const numPages = doc.numPages;
      const loadPage = async function (pageNum: number) {
        const page = await doc.getPage(pageNum);
        const content = await page.getTextContent();
        // Content contains lots of information about the text layout and
        // styles, but we need only strings at the moment
        const strings = content.items.map(function (item) {
          return "str" in item ? item.str : "";
        });
        // Release page resources.
        page.cleanup();
        return strings.join(" ");
      };

      const result: string[] = [];
      for (let i = 1; i <= numPages; i++) {
        const textFragment = await loadPage(i);
        result.push(textFragment);
      }
      return result.join(" ");
    })
    .then((res) => res)
    .catch((err) => {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      console.error("Error: " + err);
      return "";
    });
}

interface MetadataAndPagesReturn {
  pages: number;
  metadata?: Partial<PDFMetadata>;
}

export async function getMetadataAndPages(pdfBuffer: string | ArrayBuffer) {
  const promise = new Promise<MetadataAndPagesReturn>((resolve, reject) => {
    PDFDocument.load(pdfBuffer, { updateMetadata: false, ignoreEncryption: true })
      .then((pdfDoc) => {
        const pages = pdfDoc.getPages();
        resolve({
          pages: pages.length,
          metadata: {
            title: pdfDoc.getTitle(),
            author: pdfDoc.getAuthor(),
            subject: pdfDoc.getSubject(),
            creator: pdfDoc.getCreator(),
            keywords: pdfDoc.getKeywords(),
            producer: pdfDoc.getProducer(),
            creationDate: pdfDoc.getCreationDate(),
            modificationDate: pdfDoc.getModificationDate(),
          },
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
  return await promise;
}

export async function fetchData(url: string) {
  const promise = new Promise<ArrayBuffer>((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response.arrayBuffer()))
      .catch((error) => reject(error));
  });
  return await promise;
}

export async function readFile(filename: string) {
  const content = await fs.readFile(filename);

  function toArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return arrayBuffer;
  }

  return toArrayBuffer(content);
}

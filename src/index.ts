import { setGlobalWorkerOptions } from "./lib";
import { type DocumentSrcType, loadDocument } from "./document";

async function extractMetadataAndPages(src: DocumentSrcType) {
  const doc = await loadDocument(src);
  const info = await doc.getInfo();
  return info;
}

export { extractMetadataAndPages, setGlobalWorkerOptions };

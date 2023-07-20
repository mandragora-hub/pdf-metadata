// import { PdfReader } from "pdfreader";
// import { PDFDocument } from "pdf-lib";

// export function getRawTextContent(pdfBuffer) {
//   const promise = new Promise((resolve, reject) => {
//     const pdfReader = new PdfReader();
//     const textArray: string[] = [];
//     pdfReader.parseBuffer(pdfBuffer, (err, item) => {
//       if (err) reject("error with pdfReader:", err);
//       else if (!item) {
//         const text = textArray.join(" ");
//         return resolve(text);
//       } else if (item.text) {
//         textArray.push(item.text);
//       }
//     });
//   });
//   return promise;
// }

// export function getMetadataAndPages(pdfBuffer) {
//   const promise = new Promise((resolve, reject) => {
//     PDFDocument.load(pdfBuffer, { updateMetadata: false, ignoreEncryption: true })
//       .then((pdfDoc) => {
//         const pages = pdfDoc.getPages();
//         resolve({
//           pages: pages.length,
//           metadata: {
//             title: pdfDoc.getTitle(),
//             author: pdfDoc.getAuthor(),
//             subject: pdfDoc.getSubject(),
//             creator: pdfDoc.getCreator(),
//             keywords: pdfDoc.getKeywords(),
//             producer: pdfDoc.getProducer(),
//             creationDate: pdfDoc.getCreationDate(),
//             modificationDate: pdfDoc.getModificationDate(),
//           },
//         });
//       })
//       .catch((err) => reject(err));
//   });
//   return promise;
// }

import { PdfReader } from "pdfreader";
import fs from "fs";
import readingTime from "reading-time"
import { PDFDocument } from 'pdf-lib';

function getRawTextContent(pdfBuffer) {
    const promise = new Promise((resolve, reject) => {

        const pdfReader = new PdfReader();
        const textArray = []
        pdfReader.parseBuffer(pdfBuffer, (err, item) => {
            if (err) reject("error:", err);
            else if (!item) {
                const text = textArray.join(" ")
                return resolve(text);
            }
            else if (item.text) {
                textArray.push(item.text)
            };
        });
    })

    return promise
}

function getMetadata(pdfBuffer) {
    const promise = new Promise((resolve, reject) => {
        PDFDocument.load(pdfBuffer, { updateMetadata: false }).then((pdfDoc) => {
            const pages = pdfDoc.getPages()
            resolve({
                pages: pages.length,
                title: pdfDoc.getTitle(),
                author: pdfDoc.getAuthor(),
                subject: pdfDoc.getSubject(),
                creator: pdfDoc.getCreator(),
                keywords: pdfDoc.getKeywords(),
                producer: pdfDoc.getProducer(),
                creationDate: pdfDoc.getCreationDate(),
                modificationDate: pdfDoc.getModificationDate(),
            })

        })
    })
    return promise;
}


fs.readFile("test/sample.pdf", async (err, pdfBuffer) => {
    if (err) { return console.log(err) }
    const text = await getRawTextContent(pdfBuffer).catch((err) => { console.error(err) });
    const metadata = await getMetadata(pdfBuffer).catch((err) => { console.error() })
    const stats = readingTime(text);
    console.log({ metadata, stats })
})

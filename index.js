import { PdfReader } from "pdfreader";
import readingTime from "reading-time"

function extractTextContent(filename) {
    const promise = new Promise((resolve, reject) => {
        const pdfReader = new PdfReader();
        const textArray = []
        pdfReader.parseFileItems(filename, (err, item) => {
            if (err) reject("error:", err);
            else if (!item) {
                const text = textArray.join(" ")
                return resolve(text);
            }
            else if (item.text) textArray.push(item.text);
        });
    })
    return promise
}

extractTextContent("test/sample.pdf").then((text) => {
    const stats = readingTime(text);
    console.log(stats)
}).catch((err) => { console.error(err) });
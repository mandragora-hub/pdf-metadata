import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import readingTime from "reading-time";
import { getRawTextContent, getMetadataAndPages } from "./lib.js";

const LITTERARUM_BASEURL = process.env.LITTERARUM_URL_API || "http://localhost:3000";
const LITTERARUM_TOKEN_API = process.env.LITTERARUM_TOKEN_API;

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${LITTERARUM_TOKEN_API}`);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

function downloadAndProcess(bookId) {
  const promise = new Promise((resolve, reject) => {
    fetch(`${LITTERARUM_BASEURL}/api/v1/books/${bookId}/download`, requestOptions)
      .then((response) => response.arrayBuffer())
      .then(async (arrayBuffer) => {
        const pdfBuffer = Buffer.from(arrayBuffer);
        const text = await getRawTextContent(pdfBuffer);
        const { pages, metadata } = await getMetadataAndPages(pdfBuffer);
        const stats = readingTime(text);
        resolve({ pages, metadata, stats });
      })
      .catch((error) => reject(error));
  });
  return promise;
}

function save(bookId, data) {
  const putHeaders = new Headers();
  putHeaders.append("Authorization", `Bearer ${LITTERARUM_TOKEN_API}`);
  putHeaders.append("Content-Type", "application/json");

  const { pages, metadata, stats } = data;
  const raw = JSON.stringify({ pages: pages, wordCount: stats.words, readTime: stats.time, metadata });

  const requestOptions = {
    method: "PUT",
    headers: putHeaders,
    body: raw,
  };

  const promise = new Promise((resolve, reject) => {
    fetch(`${LITTERARUM_BASEURL}/api/v1/books/${bookId}`, requestOptions)
      .then((response) => response.json())
      .then((results) => resolve(results))
      .catch((error) => reject(error));
  });
  return promise;
}

fetch(`${LITTERARUM_BASEURL}/api/v1/books`, requestOptions)
  .then((response) => response.json())
  .then(async (result) => {
    for (const book of result.data) {
      try {
        const bookId = book._id;
        const data = await downloadAndProcess(bookId);
        const t = await save(bookId, data);
        console.log(t);
      } catch (error) {
        console.error(error);
      }
    }
  })
  .catch((error) => console.error("fetch error", error));

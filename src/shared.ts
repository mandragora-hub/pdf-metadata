import fs from "fs";
export function isArrayBuffer(v: any) {
  return typeof v === "object" && v?.byteLength !== undefined;
}

export function isValidFetchUrl(url: string, baseUrl?: string) {
  try {
    const { protocol } = baseUrl != null ? new URL(url, baseUrl) : new URL(url);
    // The Fetch API only supports the http/https protocols, and not file/ftp.
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false; // `new URL()` will throw on incorrect data.
  }
}

export function isValidUrl(urlString: string) {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
}

export function fileExists(path: string) {
  return fs.existsSync(path);
}

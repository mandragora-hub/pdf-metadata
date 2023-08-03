import { describe, expect, test } from "@jest/globals";
import { loadDocument } from "../src/index";

const MAX_TIMEOUT = 40000;

describe("Get info of module", () => {
  test(
    "Load and get info document",
    async () => {
      const url = "https://litterarum.onrender.com/api/v1/files/el-hombre-que-calculaba-malba-tahan.pdf";
      const doc = await loadDocument(url);
      const info = await doc.getInfo();
      expect(info).toMatchSnapshot();
    },
    MAX_TIMEOUT,
  );
});

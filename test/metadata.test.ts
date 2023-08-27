import { describe, expect, test } from "@jest/globals";
import { extractMetadataAndPages } from "../src/index";

const MAX_TIMEOUT = 40000;

describe("Get info of module", () => {
  test(
    "Load and get info document",
    async () => {
      const url = "https://litterarum.onrender.com/api/v1/files/el-hombre-que-calculaba-malba-tahan.pdf";
      const result = await extractMetadataAndPages(url);
      expect(result).toMatchSnapshot();
    },
    MAX_TIMEOUT,
  );
});

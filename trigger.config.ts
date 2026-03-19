import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_wmduczqjcpwazguueawa",
  dirs: ["./src/trigger"],
  maxDuration: 300, // 5 minutes — enough for scraping + analysis
});

// A drop-in shelby tool. Copy to <app>/.shelby/tools/ — the filename (word_count) is the tool
// name the model sees. No registration, no rebuild; restart shelby and run /tools.
import fs from "node:fs";

export default {
  description: "Count the words in a text file in the repo.",
  parameters: { path: { type: "string", description: "path relative to the repo root" } },
  required: ["path"],
  // no path confinement here — a real tool must reject paths outside the repo,
  // like safe() in tools.ts does. That's the exercise.
  run: ({ path }) => String(fs.readFileSync(path, "utf8").split(/\s+/).filter(Boolean).length),
};

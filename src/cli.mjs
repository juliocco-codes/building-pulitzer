#!/usr/bin/env node
import fs from "node:fs";
import { parseFeed, selectUnprocessed, markProcessed } from "./podcast-intake.mjs";

const [command, value] = process.argv.slice(2);
const stateFile = process.env.PODCAST_STATE_FILE || "state/podcasts.json";
if (command === "scan" && value) {
  const feed = parseFeed(fs.readFileSync(value, "utf8"));
  let state = {};
  try { state = JSON.parse(fs.readFileSync(stateFile, "utf8")); } catch {}
  console.log(JSON.stringify(selectUnprocessed(feed, state), null, 2));
} else if (command === "mark" && value) console.log(JSON.stringify(markProcessed(stateFile, value), null, 2));
else { console.error("Usage: node src/cli.mjs scan FEED.xml | mark GUID"); process.exit(2); }

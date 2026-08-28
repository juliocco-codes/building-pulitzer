import fs from "node:fs";
import path from "node:path";

const decode = (text = "") => text
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const textOf = (block, tag) => {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decode(match?.[1] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

export function parseFeed(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].flatMap((match) => {
    const block = match[1];
    const guid = textOf(block, "guid");
    const title = textOf(block, "title");
    const published = textOf(block, "pubDate");
    const timestamp = Date.parse(published);
    if (!guid || !title || !Number.isFinite(timestamp)) return [];
    return [{ guid, title, published_at: new Date(timestamp).toISOString(), url: textOf(block, "link") || null }];
  }).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}

export function validateTranscript(text, { minimumWords = 600 } = {}) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  const words = normalized ? normalized.split(" ").length : 0;
  return { ok: words >= minimumWords, word_count: words, text: normalized };
}

export function selectUnprocessed(episodes, state = {}) {
  const processed = new Set(state.processed_guids || []);
  return episodes.filter((episode) => !processed.has(episode.guid));
}

export function markProcessed(file, guid) {
  let state = { processed_guids: [] };
  try { state = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  state.processed_guids = [...new Set([...(state.processed_guids || []), guid])];
  state.updated_at = new Date().toISOString();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, file);
  return state;
}

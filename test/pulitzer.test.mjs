import test from "node:test";
import assert from "node:assert/strict";
import { parseFeed, selectUnprocessed, validateTranscript } from "../src/podcast-intake.mjs";
import { buildEditorialPacket, rankCandidates } from "../src/editorial-queue.mjs";

test("parses and deduplicates podcast episodes", () => {
  const xml = `<rss><channel><item><guid>episode-1</guid><title>Useful episode</title><pubDate>Fri, 28 Aug 2026 06:00:00 GMT</pubDate><link>https://example.test/1</link></item></channel></rss>`;
  const episodes = parseFeed(xml);
  assert.equal(episodes[0].guid, "episode-1");
  assert.equal(selectUnprocessed(episodes, { processed_guids: ["episode-1"] }).length, 0);
});

test("rejects incomplete transcripts", () => {
  assert.equal(validateTranscript("too short", { minimumWords: 3 }).ok, false);
  assert.equal(validateTranscript("long enough now", { minimumWords: 3 }).ok, true);
});

test("ranks before generating the editorial packet", () => {
  const ranked = rankCandidates([
    { id: "a", analysis_density: 1, novelty: 1, promotional: 1 },
    { id: "b", analysis_density: 3, novelty: 2, promotional: 0 },
  ]);
  assert.equal(ranked[0].id, "b");
  assert.equal(buildEditorialPacket({ id: "b", title: "Title", source_url: "https://example.test", source_text: "Text" }).instructions.write_for_listening, true);
});

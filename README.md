# Building Pulitzer

Pulitzer is an editorial agent. It decides which newsletters, saved articles, and podcast episodes deserve attention, separates reporting from analysis, and turns the strongest material into sourced audio briefs.

This repository is a public blueprint, not a copy of my agent. Its sources, queue, transcripts, preferences, and examples are fictional. It contains no private subscriptions, email, credentials, listening history, or unpublished writing.

## The core design

Pulitzer has two different jobs:

1. **Deterministic intake:** find new material, identify it reliably, retrieve the source or transcript, track processing state, and prevent duplicates.
2. **Editorial judgment:** decide what matters, preserve the source's claims, separate analysis from reporting, and produce a useful brief.

Do not ask the model to remember whether it processed an episode. Store a durable identifier such as the RSS GUID in state. Do not ask a script to decide why an argument matters. Give that job to the editorial layer.

## Start here

1. Install OpenClaw through its [official documentation](https://github.com/openclaw/openclaw#readme).
2. Create a private workspace and copy the files under `workspace/`.
3. Rename `USER.example.md` to `USER.md` and replace the fictional editorial preferences locally.
4. Start with one source and text output.
5. Add durable deduplication before scheduling the workflow.
6. Add text-to-speech only after the written brief is accurate and sourced.
7. Keep delivery credentials and private feeds outside the workspace.

OpenClaw loads workspace skills from `<workspace>/skills/<skill>/SKILL.md`. Review the current [skills documentation](https://docs.openclaw.ai/skills) before installing or changing a skill.

## A useful editorial brief

A good brief should answer:

- What happened or what is the argument?
- Which claims come directly from the source?
- What is Pulitzer's interpretation?
- Why is this worth the user's time?
- What should be ignored?
- Where can the user inspect the original material?

## Design decisions

### Selection comes before summarization

Summarizing everything creates another inbox. Rank first, reject weak or repetitive material, and spend depth only where it is earned.

### Source and analysis remain visibly separate

The listener should always know whether a statement came from the source, from outside verification, or from Pulitzer's own interpretation.

### The transcript is the source for podcast work

Use a complete transcript when available. Reject suspiciously short, incomplete, or mismatched transcripts rather than filling gaps from the episode title.

### Audio is the main experience

Write for listening: short sections, spoken source attribution, clear transitions, and no dependence on visual formatting. Keep a text script for auditability.

### State changes happen after successful delivery

Claim an item while processing, mark it complete only after the brief has been delivered, and release failed claims for retry. This prevents both duplicates and silent loss.

## Repository map

- `workspace/AGENTS.md`: operating and sourcing rules.
- `workspace/SOUL.md`: editorial stance and tone.
- `workspace/USER.example.md`: fictional selection and audio preferences.
- `workspace/skills/editorial-brief/SKILL.md`: provider-neutral editorial workflow.
- `examples/editorial-brief.md`: fictional source-to-audio script.
- `SECURITY.md`: source, subscription, and credential checklist.

## License

MIT. See `LICENSE`.

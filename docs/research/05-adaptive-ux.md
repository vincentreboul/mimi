# Adaptive Mobile Escape Game UI Research

## Three Design Principles

1. **Earned Help, Not Gated Help.** Hints free, optional, progressive (vague → specific → solution). No currency, no ads.
2. **Skill-Adaptive, Not Skill-Selecting.** No "are you a beginner?" prompt. Use implicit signals (time-on-puzzle, tap density, hint usage) to silently adjust hint timing.
3. **One Visual System, Two Reading Modes.** Don't build "kid mode" and "adult mode." Build one polished, neutral aesthetic with adjustable text density, font, and motion.

---

## 1. Adaptive Difficulty System

### Multi-tier puzzle architecture
Every puzzle ships with three solvability layers:
- **Core puzzle** — full mechanic, no scaffolding visible.
- **Scaffolded layer** — appears automatically after stuck-detection. Adds a visual cue: glowing edge on the relevant object, faint outline on slots that accept items.
- **Story-skip** — after 3 hints used + still stuck for 5 min, surface a discreet "Continue the story" button.

### Stuck detection signals
Track per puzzle:
- `time_on_puzzle` — start counting from first interaction with puzzle objects.
- `tap_density` — taps per minute. Spike then plateau = trying random things.
- `inventory_open_count` — opening inventory >5x without using anything.
- `undo_count` — high in combination puzzles.
- `re-entry_count` — leaving and re-entering the room.

**Trigger thresholds:**
- T1 (subtle nudge available): 90 sec of low-progress activity, OR 4+ inventory opens without use.
- T2 (hint button pulses gently): 3 min on puzzle.
- T3 (offer "Continue story" + 3rd hint): 7 min OR 3 hints already used.

---

## 2. Multi-Generational Visual Identity

### Typography
- **Primary UI font**: Modern, slightly characterful humanist sans-serif. Inter, Söhne, or General Sans. Avoid Comic Sans, Helvetica, handwritten/grunge.
- **Display/title font**: One personality face for chapter titles only — Fraunces or Editorial New (warm serif).
- **Body text**: 17pt minimum, 1.4 line-height. Never below 16px on web.
- **Settings-toggleable**: OpenDyslexic or Atkinson Hyperlegible as alternatives.
- **Dynamic Type support**: Honor iOS Dynamic Type up to 200%.

### Color
- Base palette: muted, narrative-driven (deep teal, warm parchment, brass accent).
- **Contrast**: WCAG AA minimum (4.5:1 normal text, 3:1 large), AAA where possible.
- **Color-blind safety**: Okabe-Ito or IBM Color Blind Safe palette. Never encode puzzle state in red/green only.

### Iconography
- Single-weight line icons (1.5–2px stroke), rounded corners.
- Touch targets: **44x44 pt minimum** per Apple HIG — but use **48x48 pt** for primary actions. Spacing of at least 8pt between adjacent targets.

### Microcopy tone
- **Voice**: warm, slightly literary, never sarcastic. Think *Inside* or *Gris*.
- **Tone shifts by context**: Story beats = atmospheric; system messages = clear; errors = reassuring.
- **Avoid**: emojis in UI, exclamation marks in errors, gen-Z slang, corporate verbs.
- **Read-aloud test**: every string should sound natural read by both a 50-year-old AND a 14-year-old.

---

## 3. Onboarding Flow

**Total budget**: under 90 seconds before player has agency. First puzzle solved within first 3 minutes.

### Sequence
1. **Cold open** (0-15s): No menu. Player wakes up in the first room, fade-in.
2. **Diegetic tap prompt** (15-30s): A single object glows softly. Tap it. The object reacts.
3. **First inventory pickup** (30-60s): 1-second contextual tooltip on inventory bar — appears once, never again.
4. **First puzzle** (60-180s): Solvable with 2 inventory items in the same room.
5. **End of room 1**: Compact settings prompt — "How does the experience feel? [Just right] [More hints, please] [Less guidance]." One explicit calibration moment.

---

## 4. Hint System

### Economy: free and unlimited
No hint currency, no ads-for-hints, no daily caps.

### Three-tier progressive disclosure
- **Hint 1 — Reframe** (textual, vague): Restates relevant context without solution.
- **Hint 2 — Direct** (textual + visual nudge): Adds a soft glow on the relevant object for 3 seconds.
- **Hint 3 — Show** (animated demo): A 5-second silent clip showing the action, not the result.

### "I'm stuck" button design
- Bottom-right, secondary visual weight (outline button, not filled).
- Label: "Indice" / "Hint" — not "Help" or a lightbulb icon alone.
- **Auto-pulse trigger**: Button pulses softly when stuck-detection T2 fires.

---

## 5. Accessibility Checklist

### MUST (ship blockers)
- Touch targets ≥ 44x44 pt; primary actions ≥ 48x48 pt with 8pt spacing.
- Body text ≥ 17pt iOS / 16px web. Support iOS Dynamic Type up to 200%.
- WCAG AA contrast: 4.5:1 normal, 3:1 large.
- No information conveyed by color alone.
- Honor `prefers-reduced-motion`.
- French + English at launch with proper FR typographic rules (non-breaking space before `; : ! ? « »`).
- Save state survives app kill, low battery, incoming calls.
- Pause anywhere; resume to exact state.

### SHOULD
- Alternate font picker: default (Inter), OpenDyslexic, Atkinson Hyperlegible.
- Adjustable text size slider in-game.
- High-contrast mode toggle.
- Subtitles for narration.
- Hint TTS readout.
- Audio-puzzle visual fallback.
- Haptic feedback (toggleable).
- Single-tap interaction option.

### NICE-TO-HAVE
- Color-blind mode presets.
- Full VoiceOver support.
- "Calm mode" (no time pressure, reduced unsettling sounds).
- Family handoff: "Pass the device" pause screen with summary.
- Cloud sync.

---

## Session Length

Design rooms as **5-15 minute chapters** with autosave inside puzzles, not just between rooms. A player on a 5-minute commute should finish at least one puzzle and reach a checkpoint. A 30-minute evening player should clear 2-3 rooms with narrative payoff.

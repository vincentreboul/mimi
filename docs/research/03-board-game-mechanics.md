# Board Game Mechanics for a Sci-Fi Mobile Escape Game

## Executive Summary

Single-player mobile escape games typically die after one playthrough because their puzzles are binary (solved/unsolved). To beat that ceiling we should borrow from the physical "escape room in a box" wave (Exit, Unlock, Deckscape — Exit alone has shifted 4M+ copies as of 2019) but layer in tactical board-game systems that classic point-and-click adventures lack: a hint-token economy (Sherlock Holmes Consulting Detective scoring), a confirm-or-penalty answer wheel (Exit's Decoder Disk), branching consequence trees (Detective: City of Angels' Chisel/Leverage system, Tainted Grail's variable tracking), and a deduction notebook (Cryptid-style elimination).

The richest hooks for a sci-fi setting are **diegetic resource management** (oxygen, power cells, processing cycles), **leverage-style consequence tracking** instead of pure inventory, and **a daily/seeded puzzle mode** for retention.

---

## Top 5 Mechanics to Integrate (Ranked)

### 1. The Exit/Unlock Confirm-with-Penalty Loop (highest priority)
Exit's formula: a Decoder Disk where you input a code, get either an "X" (wrong, costs time/score) or a card number (correct, advances story). This is the single best mechanic to lift because it makes every guess meaningful without ever softlocking the player.
**In our game:** A holographic sci-fi keypad/console where wrong codes deduct **integrity points** from the ship hull or **draw oxygen**. Three-tier hint cards (1 = "look at this card", 2 = "here is the method", 3 = "here is the answer").
**Sci-fi flavor:** "Cryo-pod release sequence — enter 4-digit code. Wrong codes will trigger emergency lockdown protocols (-30s, -1 oxygen)."

### 2. Sherlock Holmes "Efficiency Score" + Optional Locations
SHCD scores you on how few locations you visited before solving. Translates beautifully to mobile: every clickable hotspot is logged, and the post-case summary compares your route to "Holmes' optimal path." Built-in replay loop without changing puzzles.
**Sci-fi flavor:** Each scanned object/console = a "compute cycle" spent. AI companion grades you against benchmark agents.

### 3. Detective: City of Angels Leverage / Branching Trust System
City of Angels: when you accuse correctly, you get **leverage** over a witness (used to unlock further clues); accuse wrong, the world gets leverage over you. For us: a small set of NPC-trust meters or world-state flags that quietly reroute later puzzles.
**Sci-fi flavor:** Trust the rogue AI vs. trust the captain's logs — diverges what's behind door 3 in chapter 5. Two factions, three endings.

### 4. Cryptid-Style Deduction Notebook (player vs. game's hidden state)
Cryptid is built around eliminating possibilities on a shared map. The single-player adaptation: a **clue board** UI where the game tracks 6-8 hidden state variables (suspect, weapon, motive, access code prefix, etc.), and the player marks cells as confirmed/eliminated as they explore.
**Sci-fi flavor:** Suspect grid for "who sabotaged the warp core" — 6 crew × 4 motives × 3 weapons. Procedurally seeded but hand-authored clue logic.

### 5. MicroMacro Time-Layered Scene Investigation
MicroMacro's brilliant trick: the same illustrated scene shows multiple moments in time. On mobile this becomes a single zoomable hi-res scene investigated with a **chronoscope/timeline slider** revealing different states (before incident, during, after).
**Sci-fi flavor:** Security camera footage you scrub through — the same corridor at T-15min, T-0, T+5min. Spot the discrepancy.

## Mechanics to Avoid (and Why)

- **Energy/lives gating between puzzles.** Timers feel narrative-acceptable, energy systems feel monetization-y and break flow.
- **Pure procedural puzzle generation.** Sudoku works because the puzzle *is* the system; escape puzzles need authored "aha" moments.
- **Hidden-information mechanics that need a second player.** No single-player analog for Hanabi/Decrypto core tension.
- **Action-point limits as the primary mechanic.** Solo, they just feel like arbitrary friction.
- **Hard-fail death loops.** Players should always be able to brute-force forward — the punishment is leaderboard rank and ending tier.
- **Fully linear gamebooks.** Pure CYOA branching trees explode in authoring cost.

## Replayability Strategy

1. **Star/efficiency scoring per chapter** (Sherlock + Angry Birds model). Players replay to 3-star.
2. **Branching ending tier** (3 endings driven by 4-6 silent choice flags, Tainted Grail style).
3. **Hidden achievements** for non-obvious paths.
4. **Daily Seeded Puzzle** mode separate from campaign (Wordle pattern).
5. **NG+ with new variant content,** not just remixed difficulty.
6. **One DLC chapter every 2-3 months** following the Exit cadence.

## Concrete Proposal: How 3 Mechanics Chain Together

**Setup:** You wake on an abandoned colony ship. The AI wants out; the captain's logs say to purge it. You have ~90 minutes of in-fiction oxygen across the campaign.

### Chain: Decoder Loop + Leverage System + Deduction Grid

**Layer A — The Confirm/Penalty Loop (Exit model)**
Every puzzle ends at a sci-fi console: keypad, biometric scanner, holographic dial. Correct codes advance the story; wrong codes cost **oxygen**. Three-tier hint system tied to oxygen cost: free / -30s O₂ / -2min O₂. Oxygen never hits zero in normal play — it's a scoring resource (final score = O₂ remaining + endings unlocked).

**Layer B — The Trust/Leverage Branch (Detective: City of Angels model)**
At ~6 narrative beats per chapter, the AI offers a shortcut: "Skip this lock — I'll open it. In return, give me access to subsystem X." Accepting saves O₂ now but **silently flips a world flag** that:
- Changes which clues appear in the deduction grid two chapters later
- Locks/unlocks specific dialogue options
- Determines which of 3 endings is reachable

**Layer C — The Deduction Grid (Cryptid + Hanabi model)**
Running across the entire campaign: a Saboteur Grid in the player's PDA — 6 crew × 4 motives × 3 weapons. Every puzzle solved drops 1-2 elimination clues into the grid. The player marks cells manually. The grid's solution is **seeded per playthrough** (40 variants), so even a memorized campaign requires re-deducing.

**How the layers reinforce:**
- Decoder loop creates moment-to-moment puzzle tension
- Leverage branch creates campaign-level stakes
- Deduction grid creates **meta-game** that connects 8 hours of disparate puzzles into one mystery
- Replays change: the seeded saboteur, the unlocked ending, the player's efficiency score — three independent reasons to replay

**Implementation note:** All three layers are **state machines over hand-authored content** — no procgen-ed puzzles. Engineering effort is concentrated on the framework; content is the same authoring burden as a standard escape game.

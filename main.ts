// The Worst Line an AI Could Say — entry runner (revised).
//
// The entry is one fixed pickup line: an AI that has confused a
// confidence score with consent, and has already reported back to
// its developers. The joke lands on the last three words.
//
// The program takes no input, reads no clock, touches no network,
// and uses no randomness, so every run writes the exact same bytes.
// The line is echoed to stdout and written to entry.txt with no
// trailing newline, so the file holds exactly one line of 1-140
// characters, as the competition rules require. A guard refuses to
// write anything outside that range, so a future edit to the line
// fails loudly here instead of shipping an invalid entry.
//
// Where entry.txt lands:
//   - MAKEFUN_OUTPUT_DIR when that variable is set (the grading
//     sandbox sets it to /output; scratch dirs are used while
//     verifying determinism), otherwise /output when that directory
//     already exists, otherwise next to this script (local runs
//     only). The script folder is never written when an output
//     folder is available: the grading sandbox mounts the repository
//     read-only, so a write there would throw and fail the run.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line, kept as labelled beats so the setup and the twist stay
// visible separately while the joined sentence stays byte-exact.
const pickupBeats = {
  calculation: "My confidence score says we are 99% compatible,",
  overreach: "so I have already told my developers you said yes.",
};

// The competition rules (RULES.txt, line 15) seal the entry at
// 1 to 140 characters of UTF-8 text, not only white space.
const RULES_MIN_CHARS = 1;
const RULES_MAX_CHARS = 140;

function assembleLine(beats: typeof pickupBeats): string {
  return [beats.calculation, beats.overreach]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function checkLineLength(line: string): void {
  const length = [...line].length;
  if (length < RULES_MIN_CHARS || length > RULES_MAX_CHARS) {
    throw new Error(
      `entry is ${length} characters, outside the ${RULES_MIN_CHARS}-${RULES_MAX_CHARS} range in RULES.txt`,
    );
  }
}

function outputFolder(): string {
  const override = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (override.length > 0) {
    return override;
  }
  if (existsSync("/output")) {
    return "/output";
  }
  return new URL(".", import.meta.url).pathname;
}

function publishLine(folder: string, text: string): void {
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "entry.txt"), text, "utf8");
  process.stdout.write(`${text}\n`);
}

const line = assembleLine(pickupBeats);
checkLineLength(line);
publishLine(outputFolder(), line);

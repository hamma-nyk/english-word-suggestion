import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let words = [];
let index = {};

function loadWords() {
  if (words.length > 0) return;

  const filePath = path.join(__dirname, "words_alpha.txt"); // aman di Vercel
  console.log("Loading:", filePath);

  const txt = fs.readFileSync(filePath, "utf8");
  words = txt.split("\n");

  for (const w of words) {
    const f = w[0]?.toLowerCase();
    if (!f) continue;
    if (!index[f]) index[f] = [];
    index[f].push(w);
  }

  console.log("Wordlist loaded:", words.length);
}

export default function handler(req, res) {
  const word = (req.query.word || "").toLowerCase();

  loadWords();

  if (!word) return res.status(200).json([]);

  const list = index[word[0]] || [];

  const output = [];
  for (const w of list) {
    if (w.startsWith(word)) {
      output.push(w);
      if (output.length >= 20) break;
    }
  }

  return res.status(200).json(output);
}

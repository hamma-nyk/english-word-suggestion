import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache global supaya tidak baca file berkali-kali
let words = [];
let index = {};

function loadWords() {
  if (words.length > 0) return; // sudah loaded

  const filePath = path.join(__dirname, "words_alpha.txt");
  console.log("Loading:", filePath);

  const txt = fs.readFileSync(filePath, "utf8");
  words = txt.split("\n");

  // index kata berdasarkan huruf pertama (lebih cepat)
  for (const w of words) {
    const f = w[0]?.toLowerCase();
    if (!f) continue;

    if (!index[f]) index[f] = [];
    index[f].push(w);
  }

  console.log("Wordlist loaded:", words.length);
}

export default function handler(req, res) {
  // Query Vercel sudah otomatis parse → req.query
  const word = (req.query.word || "").toLowerCase();

  if (!word) return res.status(200).json([]);

  loadWords(); // load sekali saja

  const group = index[word[0]] || [];
  const out = [];

  for (const w of group) {
    if (w.startsWith(word)) {
      out.push(w);
      if (out.length >= 20) break;
    }
  }

  return res.status(200).json(out);
}

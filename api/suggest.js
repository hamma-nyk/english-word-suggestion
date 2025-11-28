import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache global supaya tidak reload tiap request
let words = [];
let index = {};

function loadWords() {
  if (words.length > 0) return;

  const filePath = path.join(__dirname, "words_alpha.txt");
  console.log("Loading:", filePath);

  const txt = fs.readFileSync(filePath, "utf8");
  words = txt.split("\n");

  // index berdasarkan huruf awal
  for (const w of words) {
    const f = w[0]?.toLowerCase();
    if (!f) continue;
    if (!index[f]) index[f] = [];
    index[f].push(w);
  }

  console.log("Wordlist loaded:", words.length);
}

// Fungsi shuffle Fisher–Yates (paling efisien)
function shuffle(arr) {
  let a = arr.slice(); // clone supaya index tidak berubah
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function handler(req, res) {
  const word = (req.query.word || "").toLowerCase();
  if (!word) return res.status(200).json([]);

  loadWords();

  const group = index[word[0]] || [];

  // Filter dulu semua yang cocok
  const matches = group.filter((w) => w.startsWith(word));

  // Randomisasi urutan
  const randomized = shuffle(matches);

  // Ambil 20 pertama setelah random
  const out = randomized.slice(0, 20);

  return res.status(200).json(out);
}

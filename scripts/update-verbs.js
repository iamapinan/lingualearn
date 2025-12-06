
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../lib/db/data/verbs.csv');
const outputPath = path.join(__dirname, '../lib/db/data/verbs-data.ts');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim() !== '');

const verbs = lines.map(line => {
  // Handle potential quotes or commas in CSV if strictly formatted, but the file seems simple.
  // The file format observed: base,past,participle,translation
  // Translation might contain semicolons.
  const parts = line.split(',');
  if (parts.length < 4) return null;
  
  const baseForm = parts[0].trim();
  const pastSimple = parts[1].trim();
  const pastParticiple = parts[2].trim();
  // The rest is translation, join back in case of extra commas (though unlikely based on observation)
  const translation = parts.slice(3).join(',').trim();

  // Determine category (simple heuristic)
  // If pastSimple and pastParticiple end with 'ed' and baseForm doesn't, it's likely regular.
  // But strictly speaking, the user provided list might be mixed.
  // The previous file had explicit categories.
  // Let's try to detect:
  const isRegular = pastSimple.endsWith('ed') && pastParticiple.endsWith('ed');
  const category = isRegular ? 'regular' : 'irregular';
  
  // Difficulty - random or based on length/commonality?
  // The previous file had difficulty 1, 2, 3.
  // For now, let's assign difficulty 1 for all, or maybe randomize, or just leave it as 1.
  // Better: Assign 1 for now.
  const difficulty = 1;

  return {
    baseForm,
    pastSimple,
    pastParticiple,
    translation,
    category,
    difficulty,
    exampleSentence: '' // We don't have example sentences in CSV
  };
}).filter(v => v !== null);

const fileContent = `export interface VerbData {
  baseForm: string
  pastSimple: string
  pastParticiple: string
  translation: string
  category: "regular" | "irregular"
  difficulty: number
  exampleSentence: string
}

export const allVerbs: VerbData[] = ${JSON.stringify(verbs, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Generated ${verbs.length} verbs in ${outputPath}`);

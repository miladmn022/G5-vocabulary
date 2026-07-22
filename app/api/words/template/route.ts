const csvTemplate = [
  ["text", "meaning", "synonyms", "antonyms", "example", "level"],
  [
    "Focus",
    "تمرکز",
    "concentration, attention",
    "distraction",
    "I need focus to study.",
    "1",
  ],
  [
    "Improve",
    "بهبود دادن / بهتر شدن",
    "enhance, develop",
    "worsen",
    "You can improve your vocabulary with daily practice.",
    "1",
  ],
];

function escapeCsvValue(value: string) {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

export async function GET() {
  const csvContent = csvTemplate
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const bom = "\uFEFF";

  return new Response(bom + csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="g5-word-template.csv"',
    },
  });
}

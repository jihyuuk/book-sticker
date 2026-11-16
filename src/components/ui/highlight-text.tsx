type Props = {
  text: string;
  keyword?: string;
};

export default function HighlightText({ text, keyword }: Props) {
  const query = keyword?.trim();

  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const result: React.ReactNode[] = [];
  let start = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    result.push(text.slice(start, index));

    result.push(
      <mark key={index} className="bg-sky-100 font-semibold text-sky-700">
        {text.slice(index, index + query.length)}
      </mark>,
    );

    start = index + query.length;
    index = lowerText.indexOf(lowerQuery, start);
  }

  result.push(text.slice(start));

  return <>{result}</>;
}

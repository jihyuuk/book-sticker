export function isPostEditable(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();

  if (Number.isNaN(created.getTime())) return false;
  if (created.getTime() > now.getTime()) return false;

  const getKstDate = (date: Date) =>
    date.toLocaleDateString("sv-SE", {
      timeZone: "Asia/Seoul",
    });

  return getKstDate(created) === getKstDate(now);
}

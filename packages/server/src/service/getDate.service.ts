/**
 *
 */
export function getTodayMorning() {
  const now = new Date();
  const todayMorning = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  return todayMorning;
}

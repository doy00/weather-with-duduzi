export function DDayCard() {
  const calculateDDay = (targetDate: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const targetDate = new Date('2027-06-07');
  const dday = calculateDDay(targetDate);

  return (
    <div className="mb-4 animate-in fade-in zoom-in duration-500">
      <div className="glass rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-xl">
            {dday}
          </div>
        </div>
      </div>
    </div>
  );
}

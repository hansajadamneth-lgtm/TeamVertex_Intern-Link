interface JobCardProps {
  title: string;
  company: string;
  location: string;
  matchPercent: number;
}

export function JobCard({ title, company, location, matchPercent }: JobCardProps) {
  return (
    <div className="min-h-20 rounded-xl border-l-[3px] border-b border-il-orange bg-white px-3 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-snug text-gray-500">
        {company} &middot; {location}
      </p>
      <span className="mt-2 inline-block rounded-full bg-il-orange/15 px-3 py-1 text-xs font-semibold text-il-orange">
        {matchPercent}% match
      </span>
    </div>
  );
}

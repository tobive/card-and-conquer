interface StatItemProps {
  label: string;
  value: string | number;
  icon?: string;
}

export const StatItem = ({ label, value, icon }: StatItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-200">
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <span className="text-amber-400 font-bold text-lg">{value}</span>
    </div>
  );
};

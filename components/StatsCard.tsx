import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  description?: string;
}

export default function StatsCard({ label, value, icon: Icon, color, description }: StatsCardProps) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <div className={`stats-icon-wrap stats-icon-${color}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
      {description && <div className="stats-description">{description}</div>}
    </div>
  );
}

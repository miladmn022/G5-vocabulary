type StatCardProps = {
  title: string;
  value: string;
  tone?: "indigo" | "emerald" | "amber" | "rose";
};

const toneClasses = {
  indigo: {
    card: "bg-indigo-50 border-indigo-100",
    label: "text-indigo-600",
    value: "text-indigo-900",
  },
  emerald: {
    card: "bg-emerald-50 border-emerald-100",
    label: "text-emerald-600",
    value: "text-emerald-900",
  },
  amber: {
    card: "bg-amber-50 border-amber-100",
    label: "text-amber-600",
    value: "text-amber-900",
  },
  rose: {
    card: "bg-rose-50 border-rose-100",
    label: "text-rose-600",
    value: "text-rose-900",
  },
};

export default function StatCard({
  title,
  value,
  tone = "indigo",
}: StatCardProps) {
  const classes = toneClasses[tone];

  return (
    <div
      className={`
        rounded-3xl
        border
        p-5
        shadow-sm
        ${classes.card}
      `}
    >
      <p
        className={`
          text-xs
          font-medium
          uppercase
          tracking-wide
          ${classes.label}
        `}
      >
        {title}
      </p>

      <p
        className={`
          mt-2
          text-2xl
          font-bold
          ${classes.value}
        `}
      >
        {value}
      </p>
    </div>
  );
}

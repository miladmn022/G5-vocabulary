import { cn } from "@/lib/utils";


export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {

  return (

    <div
      className={cn(
        `
        rounded-2xl
        bg-white
        p-5
        shadow-sm
        border
        border-gray-100
        `,
        className
      )}
    >

      {children}

    </div>

  );
}
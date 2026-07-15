import { cn } from "@/lib/utils";


export default function AuthCard({
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
        w-full
        rounded-3xl
        bg-white
        p-6
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
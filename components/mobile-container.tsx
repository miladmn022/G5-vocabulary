import { cn } from "@/lib/utils";


export default function MobileContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {

  return (
    <main
      className={cn(
        "mx-auto min-h-screen w-full max-w-[768px] px-4",
        className
      )}
    >
      {children}
    </main>
  );
}
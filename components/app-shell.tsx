import MobileContainer from "./mobile-container";
import AppBackButton from "./app-back-button";

type AppShellProps = {
  children: React.ReactNode;
  showBackButton?: boolean;
};

export default function AppShell({
  children,
  showBackButton = true,
}: AppShellProps) {
  return (
    <MobileContainer>
      <div
        className="
          min-h-screen
          flex
          flex-col
          pb-28
        "
      >
        {showBackButton ? (
          <div className="flex justify-end pt-4">
            <AppBackButton />
          </div>
        ) : null}

        {children}
      </div>
    </MobileContainer>
  );
}

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
      {showBackButton ? <AppBackButton /> : null}

      <div
        className="
          min-h-screen
          flex
          flex-col
          pb-28
        "
      >
        {children}
      </div>
    </MobileContainer>
  );
}

import MobileContainer from "./mobile-container";


export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <MobileContainer>

      <div className="
        min-h-screen
        flex
        flex-col
      ">

        {children}

      </div>

    </MobileContainer>
  );
}
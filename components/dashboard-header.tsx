type DashboardHeaderProps = {
  name: string | null;
  email: string;
};

function getInitial(name: string | null, email: string) {
  const value = name || email;
  return value.charAt(0).toUpperCase();
}

export default function DashboardHeader({
  name,
  email,
}: DashboardHeaderProps) {
  const displayName = name || email;
  const initial = getInitial(name, email);

  return (
    <div
      className="
        flex
        items-center
        gap-3
        py-6
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-indigo-100
          text-indigo-700
          font-bold
        "
      >
        {initial}
      </div>

      <div>
        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Welcome back
        </p>

        <h1
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          {displayName}
        </h1>
      </div>
    </div>
  );
}

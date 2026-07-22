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
        justify-between
        py-6
      "
    >
      <div>
        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Good morning 👋
        </p>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          {displayName}
        </h1>
      </div>

      <div
        className="
          flex
          h-12
          w-12
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
    </div>
  );
}

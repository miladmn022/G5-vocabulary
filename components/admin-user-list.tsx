type AdminUserListItem = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    userWords: number;
  };
};

type AdminUserListProps = {
  users: AdminUserListItem[];
};

export default function AdminUserList({ users }: AdminUserListProps) {
  return (
    <div
      className="
        mt-8
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
      "
    >
      <div>
        <p className="text-sm text-gray-500">Users</p>
        <h2 className="text-lg font-bold text-gray-900">Latest users</h2>
      </div>

      <div className="mt-5 space-y-3">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No users yet.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="
                rounded-2xl
                border
                border-gray-100
                bg-slate-50
                p-4
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <div>
                  <h3 className="font-bold text-gray-900">
                    {user.name || user.email}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-white
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-gray-600
                  "
                >
                  {user.role}
                </span>
              </div>

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                  text-xs
                  text-gray-500
                "
              >
                <span>{user.isActive ? "Active" : "Inactive"}</span>
                <span>•</span>
                <span>{user._count.userWords} words</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

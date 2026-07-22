"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type UserRole = "ADMIN" | "USER";

type AdminUserListItem = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  _count: {
    userWords: number;
  };
};

type AdminUserListProps = {
  users: AdminUserListItem[];
  currentUserId: string;
};

export default function AdminUserList({
  users,
  currentUserId,
}: AdminUserListProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  async function updateUser(
    userId: string,
    data: {
      name?: string | null;
      role?: UserRole;
      isActive?: boolean;
      password?: string;
    }
  ) {
    setMessage("");
    setError("");
    setLoadingUserId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Could not update user.");
        return;
      }

      setMessage(`Updated ${result.user.email}`);
      window.location.reload();
    } catch {
      setError("Could not connect to user API.");
    } finally {
      setLoadingUserId(null);
    }
  }

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

      {message ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No users yet.</p>
        ) : (
          users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const loading = loadingUserId === user.id;

            return (
              <UserRow
                key={user.id}
                user={user}
                isCurrentUser={isCurrentUser}
                loading={loading}
                onUpdate={updateUser}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function UserRow({
  user,
  isCurrentUser,
  loading,
  onUpdate,
}: {
  user: AdminUserListItem;
  isCurrentUser: boolean;
  loading: boolean;
  onUpdate: (
    userId: string,
    data: {
      name?: string | null;
      role?: UserRole;
      isActive?: boolean;
      password?: string;
    }
  ) => void;
}) {
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState<UserRole>(user.role);
  const [password, setPassword] = useState("");

  return (
    <div
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
          {user.isActive ? "Active" : "Inactive"}
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
        <span>{user.role}</span>
        <span>•</span>
        <span>{user._count.userWords} words</span>
        {isCurrentUser ? (
          <>
            <span>•</span>
            <span>Current user</span>
          </>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="
              mt-1
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              py-2
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Role</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="
              mt-1
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              py-2
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Leave empty to keep current password"
            className="
              mt-1
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              py-2
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-2
          "
        >
          <Button
            type="button"
            disabled={loading}
            onClick={() =>
              onUpdate(user.id, {
                name,
                role,
                ...(password ? { password } : {}),
              })
            }
            className="rounded-xl"
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={loading || isCurrentUser}
            onClick={() =>
              onUpdate(user.id, {
                isActive: !user.isActive,
              })
            }
            className="rounded-xl"
          >
            {user.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </div>
  );
}

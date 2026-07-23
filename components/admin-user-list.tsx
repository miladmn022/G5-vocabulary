"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "ADMIN" | "USER";

type AdminUserListItem = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  personalWordsCount: number;
  learningWordsCount: number;
};

type AdminUserListProps = {
  users: AdminUserListItem[];
  currentUserId: string;
};

export default function AdminUserList({
  users,
  currentUserId,
}: AdminUserListProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState("");
  const [error, setError] = useState("");

  async function updateUser({
    userId,
    name,
    role,
    password,
    isActive,
  }: {
    userId: string;
    name: string;
    role: UserRole;
    password: string;
    isActive: boolean;
  }) {
    setLoadingUserId(userId);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          role,
          password: password || undefined,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not update user.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not connect to user API.");
    } finally {
      setLoadingUserId("");
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
        <h2 className="text-lg font-bold text-gray-900">Learners</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review items are the words currently assigned to that user for learning.
        </p>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No users yet.</p>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
              loading={loadingUserId === user.id}
              onSave={updateUser}
            />
          ))
        )}
      </div>
    </div>
  );
}

function UserCard({
  user,
  isCurrentUser,
  loading,
  onSave,
}: {
  user: AdminUserListItem;
  isCurrentUser: boolean;
  loading: boolean;
  onSave: (input: {
    userId: string;
    name: string;
    role: UserRole;
    password: string;
    isActive: boolean;
  }) => void;
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">
            {user.name || user.email}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {user.email}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            <span>{user.role}</span>
            <span>•</span>
            <span>Review items: {user.learningWordsCount}</span>
            <span>•</span>
            <span>Own words: {user.personalWordsCount}</span>
            {isCurrentUser ? (
              <>
                <span>•</span>
                <span>Current user</span>
              </>
            ) : null}
          </div>
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${
              user.isActive
                ? "bg-white text-emerald-700"
                : "bg-red-50 text-red-600"
            }
          `}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs text-gray-500">Name</label>
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
              px-4
              py-3
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Role</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            disabled={isCurrentUser}
            className="
              mt-1
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-500
              disabled:bg-gray-100
            "
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">New password</label>
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
              px-4
              py-3
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onSave({
                userId: user.id,
                name,
                role,
                password,
                isActive: user.isActive,
              })
            }
            className="
              rounded-xl
              bg-indigo-600
              px-4
              py-3
              text-sm
              font-medium
              text-white
              hover:bg-indigo-700
              disabled:opacity-60
            "
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            disabled={loading || isCurrentUser}
            onClick={() =>
              onSave({
                userId: user.id,
                name,
                role,
                password,
                isActive: !user.isActive,
              })
            }
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              text-sm
              font-medium
              text-gray-700
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            {user.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

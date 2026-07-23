"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type UserRole = "ADMIN" | "USER";

type CreateUserResponse = {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    isActive: boolean;
  };
  error?: string;
};

export default function AdminUserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          role,
        }),
      });

      const data = (await response.json()) as CreateUserResponse;

      if (!response.ok || !data.user) {
        setError(data.error || "Could not create user.");
        return;
      }

      setMessage(`Created ${data.user.email}`);
      setEmail("");
      setName("");
      setPassword("");
      setRole("USER");
    } catch {
      setError("Could not connect to admin API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="user@example.com"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="User name"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 6 characters"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full rounded-xl py-6">
        {loading ? "Creating..." : "Create user"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("demo@g5.local");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not connect to login API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="
        space-y-4
      "
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="email"
          className="
            text-sm
            font-medium
          "
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
        <label
          htmlFor="password"
          className="
            text-sm
            font-medium
          "
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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

      {error ? (
        <p
          className="
            rounded-xl
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          py-6
        "
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

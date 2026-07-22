import { redirect } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/logo";
import AuthCard from "@/components/auth-card";
import LoginForm from "@/components/login-form";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
        "
      >
        <div
          className="
            mb-8
            flex
            justify-center
          "
        >
          <Logo />
        </div>

        <AuthCard>
          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Welcome back 👋
          </h1>

          <p
            className="
              mt-2
              mb-6
              text-gray-500
            "
          >
            Continue your vocabulary journey
          </p>

          <LoginForm />

          <p
            className="
              mt-6
              text-center
              text-sm
              text-gray-500
            "
          >
            Don't have an account?{" "}
            <Link
              href="https://axorizen.com/contact"
              className="
                font-medium
                text-indigo-600
                hover:text-indigo-700
              "
            >
              Contact me
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}

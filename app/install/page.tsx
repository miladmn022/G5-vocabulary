import Link from "next/link";
import AppShell from "@/components/app-shell";

export default function InstallPage() {
  return (
    <AppShell>
      <div className="py-6">
        <p className="text-sm text-gray-500">Install</p>
        <h1 className="text-2xl font-bold">Add G5 to your home screen</h1>
        <p className="mt-2 text-gray-500">
          You can use G5 like an app by adding it to your phone home screen.
        </p>
      </div>

      <div
        className="
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="flex items-center gap-4">
          <img
            src="/g5-icon.svg"
            alt="G5 icon"
            className="h-16 w-16 rounded-2xl"
          />

          <div>
            <h2 className="text-lg font-bold text-gray-900">G5 Vocabulary</h2>
            <p className="text-sm text-gray-500">Quick access from your home screen.</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <section>
            <h3 className="font-bold text-gray-900">iPhone / iPad</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>Open G5 in Safari.</li>
              <li>Tap the Share button.</li>
              <li>Choose Add to Home Screen.</li>
              <li>Tap Add.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-gray-900">Android</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>Open G5 in Chrome.</li>
              <li>Tap the three-dot menu.</li>
              <li>Choose Add to Home screen or Install app.</li>
              <li>Confirm the install.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-gray-900">Desktop</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>Open G5 in Chrome or Edge.</li>
              <li>Click the install icon in the address bar if it appears.</li>
              <li>Confirm the install.</li>
            </ol>
          </section>
        </div>

        <Link
          href="/dashboard"
          className="
            mt-6
            inline-flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-indigo-600
            px-4
            py-3
            text-sm
            font-medium
            text-white
            hover:bg-indigo-700
          "
        >
          Back to dashboard
        </Link>
      </div>
    </AppShell>
  );
}

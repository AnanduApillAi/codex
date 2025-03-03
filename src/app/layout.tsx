import type { Metadata } from "next";
import "@/app/globals.css";
export const metadata: Metadata = {
  title: "CodEX",
  description: "Codex is a snippet manager that allows you to save and manage your code snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}

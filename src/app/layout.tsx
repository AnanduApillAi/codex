import type { Metadata } from "next";
import Head from "next/head";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CodEX",
  description: "Codex is a snippet manager that allows you to save and manage your code snippets.",
  icons: {
    icon: '/favicon.ico', 
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "@/app/globals.css";
export const metadata: Metadata = {
  title: "Snippyvault",
  description: "Snippyvault",
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

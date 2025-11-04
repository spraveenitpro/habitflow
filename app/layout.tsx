import "./globals.css";

export const metadata = {
  title: "Habitflow",
  description: "Build lasting habits with a calming daily tracker."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="theme-daylight">{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Personal Finance Tracker",
  description: "Manage your transactions easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import { inter } from "./components/fonts";

export const metadata = {
  title: "EZ-Vendo",
  description: "Secure and Convinient WiFi Vending Machine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

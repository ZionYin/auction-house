import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./components/Provider";
import { NavigationBar } from "./components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auction House dapp",
  description: "Auction House dapp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-black ${inter.className}`}>
        <Provider>
          <NavigationBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "../globals.css";
import Provider from "@components/Provider";
import TopBar from "@components/TopBar";
import BottomBar from "@components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next Chat App",
  description: "A Next.js 14 chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <Provider>
          <TopBar />
          {children}
          <BottomBar />
        </Provider>
      </body>
    </html>
  );
}

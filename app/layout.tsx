import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "FindAgain — A little help remembering", description: "Remember where you put everyday things. Save a place, add a photo, and find it again.", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, title: "FindAgain", statusBarStyle: "default" }, icons: { apple: "/icons/apple-touch-icon.png", icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#174ec4" };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}

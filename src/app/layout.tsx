import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TopBarServer from "@/components/TopBarServer";
import HeaderServer from "@/components/HeaderServer";
import FooterServer from "@/components/FooterServer";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.WP_HEADER_TOP_BAR_URL || "http://gai.local/wp-json/wp/v2/top-bar-header";
    const url = `${baseUrl}?per_page=1&orderby=modified&order=desc`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return {};
    const arr = (await res.json()) as any[];
    const item = Array.isArray(arr) ? arr[0] : null;
    const acf = item?.acf || {};
    const siteName: string | undefined = acf["site_name"] || undefined;
    const rawFaviconUrl: string | undefined = acf["favicon"]?.url || acf["favicon"]?.sizes?.["medium"] || undefined;
    const modified: string | undefined = item?.modified || item?.date || undefined;
    const cacheBustedFavicon = rawFaviconUrl ? `${rawFaviconUrl}${rawFaviconUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(modified || "1")}` : undefined;
    return {
      title: siteName,
      icons: cacheBustedFavicon
        ? {
            icon: [{ url: cacheBustedFavicon, type: "image/png" }],
            shortcut: [{ url: cacheBustedFavicon, type: "image/png" }],
            apple: [{ url: cacheBustedFavicon }],
          }
        : undefined,
    };
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch favicon again to inject explicit <link rel="icon"> tags in <head>
  let headFaviconUrl: string | undefined
  try {
    const baseUrl = process.env.WP_HEADER_TOP_BAR_URL || "http://gai.local/wp-json/wp/v2/top-bar-header";
    const url = `${baseUrl}?per_page=1&orderby=modified&order=desc`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const arr = (await res.json()) as any[];
      const item = Array.isArray(arr) ? arr[0] : null;
      const acf = item?.acf || {};
      const raw = acf["favicon"]?.sizes?.["medium"] || acf["favicon"]?.url || acf["favicon"]?.sizes?.["thumbnail"];
      const modified: string | undefined = item?.modified || item?.date || undefined;
      // Point to our proxy route to ensure /favicon.ico fallback matches and to control caching
      headFaviconUrl = modified ? `/favicon.ico?v=${encodeURIComponent(modified)}` : "/favicon.ico";
    }
  } catch {}
  return (
    <html lang="en">
      <head>
        {headFaviconUrl ? (
          <>
            <link rel="icon" href={headFaviconUrl} type="image/png" />
            <link rel="shortcut icon" href={headFaviconUrl} type="image/png" />
            <link rel="apple-touch-icon" href={headFaviconUrl} />
          </>
        ) : null}
      </head>
      <body className={`${poppins.className} antialiased`}>
        <TopBarServer />
        <HeaderServer />
        {children}
        <FooterServer />
      </body>
    </html>
  );
}

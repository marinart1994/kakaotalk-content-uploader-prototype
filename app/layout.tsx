import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") || incoming.get("host") || "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "카카오톡 3탭 콘텐츠 업로더 시연",
    description: "카카오톡 3탭 피드에서 시작해 직접 글을 작성하고 발행하는 모바일 클릭 프로토타입",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "3탭에서 시작하는 콘텐츠 업로더",
      description: "피드에서 작성까지, 클릭으로 시연해보세요",
      images: [{ url: new URL("/og-mobile.png", base).toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "3탭에서 시작하는 콘텐츠 업로더",
      description: "피드에서 작성까지, 클릭으로 시연해보세요",
      images: [new URL("/og-mobile.png", base).toString()],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

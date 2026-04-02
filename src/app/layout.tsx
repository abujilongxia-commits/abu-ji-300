import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '阿布吉300任務網站',
  description: 'Andy-os 生態系核心任務管理系統',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}

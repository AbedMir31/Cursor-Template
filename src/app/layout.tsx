import "./globals.css";
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/Toaster';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'TailorMade - Resume Enhancement App',
  description: 'Tailor your resume for every job application using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

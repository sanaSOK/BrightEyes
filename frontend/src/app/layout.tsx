import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { MSWProvider } from '@/mocks/MSWProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'OptiTrade B2B | Wholesale Eyewear, Optics & Components Marketplace',
  description: 'Global B2B wholesale platform for optical frames, high index lenses, OBE spring hinges, nose pads, screws, and custom eyewear packaging.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <MSWProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </MSWProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

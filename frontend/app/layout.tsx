import './globals.css';
import Header from '../components/Header';
import AuthProvider from '../components/AuthProvider';
import AppQueryProvider from '../components/QueryProvider';

export const metadata = {
  title: 'My Dashboard App',
  description: 'Assessment frontend - Next.js 16 App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-slate-50 text-slate-900 min-h-screen'>
        <AppQueryProvider>
          <AuthProvider>
            <Header />
            <main className='max-w-5xl mx-auto p-6'>{children}</main>
          </AuthProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}

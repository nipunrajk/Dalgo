import './globals.css';
import Header from '../components/Header';
import AuthProvider from '../components/AuthProvider';
import AppQueryProvider from '../components/QueryProvider';
import Toasts from '../components/Toast';

export const metadata = {
  title: 'My Dashboard App',
  description: 'Assessment frontend',
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
            <Toasts />
          </AuthProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}

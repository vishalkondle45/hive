import { MantineProvider } from '@mantine/core';
import Layout from '@/components/Layout';
import AuthProvider from '@/Providers/AuthProvider';
import '@mantine/core/styles.css';
import { theme } from '../theme';

export const metadata = { title: 'Dream', description: '' };

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ backgroundColor: '#F5F5F8' }}>
        <AuthProvider>
          <MantineProvider theme={theme}>
            <Layout>{children}</Layout>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

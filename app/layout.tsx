import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import { DatesProvider } from '@mantine/dates';
import { theme } from '../theme';
import { StoreProvider } from '@/store/StoreProvder';
import Layout from '@/components/Layout';
import AuthProvider from '@/Providers/AuthProvider';

export const metadata = { title: 'Hive', description: '' };

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
      <body style={{ backgroundColor: '#EFF3F7' }}>
        <StoreProvider>
          <AuthProvider>
            <MantineProvider theme={theme}>
              <NavigationProgress />
              <Notifications />
              <ModalsProvider>
                <DatesProvider settings={{ timezone: 'Asia/Kolkata' }}>
                  <Layout>{children}</Layout>
                </DatesProvider>
              </ModalsProvider>
            </MantineProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

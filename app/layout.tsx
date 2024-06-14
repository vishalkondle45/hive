import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from '../theme';

export const metadata = {
  title: 'My Next.js Template',
  description: 'Thanks, for visiting my next.js template',
};

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
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}

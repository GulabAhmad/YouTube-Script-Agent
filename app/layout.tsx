import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { Providers } from './providers';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
    title: {
        template: '%s | Youtube Script',
        default: 'Youtube Script',
    },
};

// const nunito = Nunito({
//     weight: ['400', '500', '600', '700', '800'],
//     subsets: ['latin'],
//     display: 'swap',
//     variable: '--font-nunito',
// });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body 
            // className={nunito.variable}
            >
                <QueryProvider>
                    <Providers>
                        <ProviderComponent>{children}</ProviderComponent>
                    </Providers>
                </QueryProvider>
            </body>
        </html>
    );
}

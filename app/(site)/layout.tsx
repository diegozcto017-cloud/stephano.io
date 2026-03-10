import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ChatWidget from '@/modules/chat/ChatWidget';
import CookieBanner from '@/components/CookieBanner/CookieBanner';
import CursorGlow from '@/components/UXEffects/CursorGlow';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar variant="solid" />
            <main style={{ paddingTop: 'var(--nav-height)' }}>{children}</main>
            <Footer />
            <ChatWidget />
            <CookieBanner />
            <CursorGlow />
        </>
    );
}

import AdminAuth from '@/components/AdminAuth/AdminAuth';
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar';
import styles from '@/styles/admin.module.css';

export const metadata = {
    title: 'Admin | Stephano',
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuth>
            <div className={styles.adminLayout}>
                <AdminSidebar />
                <main className={styles.adminMain}>
                    {children}
                </main>
            </div>
        </AdminAuth>
    );
}

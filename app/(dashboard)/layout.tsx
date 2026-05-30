// app/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./dashboard.module.css";
import DashboardSidebar from "@/component/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // This server-side check runs before anything renders
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    return (
        <div className={styles.root}>
            <DashboardSidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
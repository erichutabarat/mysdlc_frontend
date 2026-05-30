// components/DashboardSidebar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../app/(dashboard)/dashboard.module.css";

const mockUser = { name: "Eric Daniel", email: "eric@example.com", role: "user" };

export default function DashboardSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
                <div className={styles.sidebarTop}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoMark}>M</span>
                        <span className={styles.logoText}>MySDLC</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    <p className={styles.sidebarSection}>Main</p>
                    <Link href="/dashboard" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>
                        <span className={styles.sidebarIcon}>⬡</span> Dashboard
                    </Link>
                    <Link href="/dashboard/projects" className={styles.sidebarLink}>
                        <span className={styles.sidebarIcon}>◈</span> Projects
                    </Link>
                    <Link href="/dashboard/tasks" className={styles.sidebarLink}>
                        <span className={styles.sidebarIcon}>◉</span> My Tasks
                    </Link>

                    <p className={styles.sidebarSection}>Account</p>
                    <Link href="/dashboard/settings" className={styles.sidebarLink}>
                        <span className={styles.sidebarIcon}>◎</span> Settings
                    </Link>
                </nav>

                <div className={styles.sidebarUser}>
                    <div className={styles.userAvatar}>{mockUser.name[0]}</div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{mockUser.name}</p>
                        <p className={styles.userEmail}>{mockUser.email}</p>
                    </div>
                    <button className={styles.logoutBtn} title="Log out">⏻</button>
                </div>
            </aside>

            {/* sidebar overlay on mobile */}
            {sidebarOpen && (
                <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
            )}

            {sidebarOpen && (
                <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
            )}
        </>
    );
}
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from '../auth.module.css';
import { setAuthCookie } from "@/app/actions/auth";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMounted } from "@/hooks/useMounted";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const mounted = useMounted();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!token) return alert('Please complete the captcha');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Turnstile-Token": token,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            // Assuming data.token is your JWT
            await setAuthCookie(data.data.token);

            // Redirect the user to dashboard after success
            window.location.href = '/dashboard';

        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            {/* background grid */}
            <div className={styles.gridBg} aria-hidden />

            {/* top-left logo */}
            <Link href="/" className={styles.logo}>
                <span className={styles.logoMark}>M</span>
                <span className={styles.logoText}>MySDLC</span>
            </Link>

            <div className={styles.wrapper}>
                <div className={styles.card}>

                    {/* header */}
                    <div className={styles.cardHeader}>
                        <div className={styles.cardEyebrow}>Welcome back</div>
                        <h1 className={styles.cardTitle}>Log in to MySDLC</h1>
                        <p className={styles.cardSub}>
                            Don't have an account?{" "}
                            <Link href="/register" className={styles.cardLink}>Create one →</Link>
                        </p>
                    </div>

                    {/* error */}
                    {error && (
                        <div className={styles.errorBanner}>
                            <span className={styles.errorIcon}>⚠</span>
                            {error}
                        </div>
                    )}

                    {/* form */}
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="email">Email address</label>
                            <input
                                className={styles.input}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label className={styles.label} htmlFor="password">Password</label>
                                <a href="/forgot-password" className={styles.forgotLink}>Forgot password?</a>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? "◎" : "○"}
                                </button>
                            </div>
                        </div>
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
                            onSuccess={(token) => setToken(token)}
                        />
                        <button
                            type="submit"
                            suppressHydrationWarning
                            className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ""}`}
                            disabled={!mounted || loading || !form.email || !form.password || !token}
                        >
                            {loading ? <span className={styles.spinner} /> : "Log In"}
                        </button>
                    </form>

                    <div className={styles.divider}><span>or</span></div>

                    <p className={styles.registerPrompt}>
                        New to MySDLC?{" "}
                        <Link href="/register" className={styles.cardLink}>Create a free account</Link>
                    </p>
                </div>

                {/* right panel — decorative */}
                <div className={styles.panel} aria-hidden>
                    <div className={styles.panelContent}>
                        <div className={styles.panelBadge}>Trusted by developers</div>
                        <blockquote className={styles.panelQuote}>
                            "MySDLC gave our final year project the structure we didn't know we needed."
                        </blockquote>
                        <div className={styles.panelAuthor}>
                            <div className={styles.panelAvatar}>A</div>
                            <div>
                                <div className={styles.panelName}>Alex M.</div>
                                <div className={styles.panelRole}>CS Student, Universiti Malaya</div>
                            </div>
                        </div>
                        <div className={styles.panelPhases}>
                            {["Planning", "Design", "Implementation", "Testing", "Deployment"].map((p, i) => (
                                <div key={p} className={`${styles.panelPhase} ${i < 2 ? styles.panelPhaseDone : i === 2 ? styles.panelPhaseActive : ""}`}>
                                    <span className={styles.panelPhaseDot} />
                                    {p}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
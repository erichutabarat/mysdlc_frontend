"use client";
import { useState } from "react";
import Link from "next/link";
import styles from '../auth.module.css';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const passwordStrength = (p: string) => {
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthClass = [
        "",
        styles.strengthWeak,
        styles.strengthFair,
        styles.strengthGood,
        styles.strengthStrong,
    ][strength];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (strength < 2) {
            setError("Password is too weak. Add uppercase letters and numbers.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            // TODO: replace with real API call
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            //   credentials: "include",
            // });
            // if (!res.ok) throw new Error("Registration failed");
            // router.push("/dashboard");
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            setError("Registration failed. This email may already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.gridBg} aria-hidden />

            <Link href="/" className={styles.logo}>
                <span className={styles.logoMark}>M</span>
                <span className={styles.logoText}>MySDLC</span>
            </Link>

            <div className={styles.wrapper}>
                <div className={styles.card}>

                    <div className={styles.cardHeader}>
                        <div className={styles.cardEyebrow}>Get started free</div>
                        <h1 className={styles.cardTitle}>Create your account</h1>
                        <p className={styles.cardSub}>
                            Already have an account?{" "}
                            <Link href="/login" className={styles.cardLink}>Log in →</Link>
                        </p>
                    </div>

                    {error && (
                        <div className={styles.errorBanner}>
                            <span className={styles.errorIcon}>⚠</span>
                            {error}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="name">Full name</label>
                            <input
                                className={styles.input}
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Jane Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>

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
                            <label className={styles.label} htmlFor="password">Password</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
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
                            {form.password && (
                                <div className={styles.strengthRow}>
                                    <div className={styles.strengthBars}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`${styles.strengthBar} ${i <= strength ? strengthClass : ""}`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`${styles.strengthLabel} ${strengthClass}`}>{strengthLabel}</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="confirm">Confirm password</label>
                            <input
                                className={`${styles.input} ${form.confirm && form.confirm !== form.password ? styles.inputError : ""}`}
                                id="confirm"
                                name="confirm"
                                type={showPassword ? "text" : "password"}
                                placeholder="Repeat your password"
                                value={form.confirm}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                            {form.confirm && form.confirm !== form.password && (
                                <p className={styles.fieldError}>Passwords do not match</p>
                            )}
                        </div>

                        <p className={styles.terms}>
                            By creating an account you agree to our{" "}
                            <Link href="/terms" className={styles.cardLink}>Terms of Service</Link>{" "}
                            and{" "}
                            <Link href="/privacy" className={styles.cardLink}>Privacy Policy</Link>.
                        </p>

                        <button
                            type="submit"
                            className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ""}`}
                            disabled={loading || !form.name || !form.email || !form.password || !form.confirm}
                        >
                            {loading ? <span className={styles.spinner} /> : "Create Account"}
                        </button>
                    </form>

                    <div className={styles.divider}><span>or</span></div>

                    <p className={styles.registerPrompt}>
                        Already have an account?{" "}
                        <Link href="/login" className={styles.cardLink}>Log in</Link>
                    </p>
                </div>

                {/* right panel */}
                <div className={styles.panel} aria-hidden>
                    <div className={styles.panelContent}>
                        <div className={styles.panelBadge}>Join developers worldwide</div>
                        <div className={styles.panelFeatures}>
                            {[
                                { icon: "⬡", label: "Multiple SDLC frameworks" },
                                { icon: "◈", label: "Phase gate enforcement" },
                                { icon: "◎", label: "Documentation per phase" },
                                { icon: "◉", label: "Task & priority tracking" },
                                { icon: "⬢", label: "Progress analytics" },
                                { icon: "◇", label: "Team collaboration" },
                            ].map(f => (
                                <div key={f.label} className={styles.panelFeature}>
                                    <span className={styles.panelFeatureIcon}>{f.icon}</span>
                                    <span className={styles.panelFeatureLabel}>{f.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.panelStat}>
                            <span className={styles.panelStatNum}>3+</span>
                            <span className={styles.panelStatLabel}>SDLC frameworks ready to use</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
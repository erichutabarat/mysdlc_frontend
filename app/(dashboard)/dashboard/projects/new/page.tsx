"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from './new-project.module.css';
import { getSDLCS } from "@/app/actions/sdlcs";
import { createProjects } from "@/app/actions/projects";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        description: "",
        sdlc_id: 0,
    });
    const [sdlcs, setSDLCS] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setMounted(true);
        const loadSDLCS = async () => {
            const data = await getSDLCS();
            setSDLCS(data || []);
            setLoading(false);
        };
        loadSDLCS();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const project = await createProjects(form);

            console.log("Project created:", project);
            setSuccess("Project created successfully!");
            // redirect or refresh
            setTimeout(() => router.push("/dashboard/projects"), 2000);

        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create project"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className={styles.content}>
            <h1 className={styles.greetingTitle}>
                {step === 1 ? "Start a new project" : "Choose your SDLC"}
            </h1>
            <div className={styles.progressBar}>
                <div
                    className={`${styles.progressStep} ${step >= 1 ? styles.progressActive : ""
                        }`}
                />
                <div
                    className={`${styles.progressStep} ${step >= 2 ? styles.progressActive : ""
                        }`}
                />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>

                {step === 1 && (
                    <div className={styles.stepSection}>
                        <div className={styles.field}>
                            <label>Project Name</label>
                            <input
                                className={styles.input}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Description</label>
                            <textarea
                                className={styles.input}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.submitBtn}
                            onClick={() => setStep(2)}
                            disabled={!form.name || !form.description}
                        >
                            Next Step →
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.sdlcList}>
                        {sdlcs.map((sdlc: any) => (
                            <div
                                key={sdlc.id}
                                className={`${styles.sdlcCard} ${form.sdlc_id === sdlc.id ? styles.active : ""
                                    }`}
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        sdlc_id: sdlc.id,
                                    })
                                }
                            >
                                <div className={styles.sdlcHeader}>
                                    <div>
                                        <h3>{sdlc.name}</h3>
                                        <p>{sdlc.description}</p>
                                    </div>

                                    <span className={styles.stepCount}>
                                        {sdlc.steps?.length || 0} Steps
                                    </span>
                                </div>

                                <div className={styles.workflow}>
                                    {sdlc.steps
                                        ?.sort((a: any, b: any) => a.order - b.order)
                                        .map((step: any, index: number) => (
                                            <div
                                                key={step.id}
                                                className={styles.workflowStep}
                                            >
                                                <div className={styles.stepNumber}>
                                                    {index + 1}
                                                </div>

                                                <div className={styles.stepContent}>
                                                    <h4>{step.name}</h4>
                                                    <p>{step.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className={styles.successMessage}>
                                {success}
                            </div>
                        )}
                        <div className={styles.buttonGroup}>
                            <button type="button" onClick={() => setStep(1)}>Back</button>
                            <button type="submit" disabled={form.sdlc_id === 0}>Create Project</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
'use client'
import css from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterRequest, register } from "@/lib/api/clientApi";
import { ApiError } from "@/app/api/api";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [error, setError] = useState('');

    const handleSubmit = async (formdata: FormData) => {
        try {
            const formValues = Object.fromEntries(formdata) as RegisterRequest;
            const user = await register(formValues);

            if (user) {
                setUser(user);
                router.push("/profile");
            }
            else {
                setError("Invalid email or password.");
            }
        } catch (error) {
            setError(
                (error as ApiError).response?.data?.error ??
                (error as ApiError).message ??
                ("Internal error.")
            )
        }
    };

     return (
        <main className={css.mainContent}>
            <form className={css.form} action={handleSubmit}>
                <h1 className={css.formTitle}>Sign up</h1>
                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" className={css.input} required />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" className={css.input} required />
                </div>

                <div className={css.actions}>
                    <button type="submit" className={css.submitButton}>
                        Register
                    </button>
                </div>

                {error && <p className={css.error}>{error}</p>}
            </form>
        </main>
    )
};
'use client';

import css from "./page.module.css";
import Image from "next/image";
import { getMe, updateMe, UpdateMeRequest } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/app/api/api";
import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [user, setLocalUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const me = await getMe();
                setLocalUser(me);
                setUsername(me.username);
            } catch {
                router.push("/profile");
            }
        };

        fetchUser();
    }, [router]);

    const handleSubmit = async (formdata: FormData) => {
        try {
            const formValues = Object.fromEntries(formdata) as UpdateMeRequest;
            const updatedUser = await updateMe(formValues);

            if (updatedUser) {
                setUser(updatedUser);
                router.push("/profile");
            } else {
                setError("There is a mistake with updating.");
            }
        } catch (error) {
            setError(
                (error as ApiError).response?.data?.error ??
                (error as ApiError).message ??
                "Failed to change username."
            );
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (!user) {
        return null; 
    }

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                />

                <form className={css.profileInfo} action={handleSubmit}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={css.input}
                            required
                        />
                    </div>

                    <p>Email: {user.email}</p>

                    {error && <p className={css.error}>{error}</p>}

                    <div className={css.actions}>
                        <button type="submit" className={css.saveButton}>
                            Save
                        </button>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
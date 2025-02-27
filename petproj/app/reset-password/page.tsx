"use client";

import React, { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    // Get the reset token from the URL query
    const token = searchParams.get("token");

    useEffect(() => {
        // Enable the button only if both passwords match and are not empty
        setButtonDisabled(
            !(newPassword && confirmPassword && newPassword === confirmPassword)
        );
    }, [newPassword, confirmPassword]);

    // Handle new password input
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "newPassword") setNewPassword(value);
        else if (name === "confirmPassword") setConfirmPassword(value);
    };

    // Handle Reset Password functionality
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token.", {
                duration: 4000,
                position: "top-center",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/auth/reset-password", {
                token,
                newPassword,
            });

            if (response.data.success) {
                toast.success("Password reset successful!", {
                    duration: 3000,
                    position: "top-center",
                });

                // Show a second toast after a brief delay
                setTimeout(() => {
                    toast.success("Redirecting to login...", {
                        duration: 2000,
                        position: "top-center",
                    });
                }, 1500);

                // Redirect after showing toasts
                setTimeout(() => {
                    router.push("/login");
                }, 3500);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Error resetting password.";
            toast.error(errorMessage, {
                duration: 4000,
                position: "top-center",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col sm:flex-row bg-gray-100">
            {/* Left Side */}
            <div className="sm:w-1/2 flex flex-col justify-center items-center bg-primary p-8 text-white rounded-r-3xl">
                <img src="/paltu_logo.svg" alt="Paltu Logo" className="mb-6" />
            </div>

            {/* Right Side */}
            <div className="sm:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-gray-100">
                <h2 className="text-3xl font-semibold mb-4">Reset Password</h2>
                <p className="text-gray-600">Enter your new password below.</p>

                <form
                    onSubmit={handleResetPassword}
                    className="mt-8 w-full max-w-md bg-white shadow-lg rounded-2xl p-6"
                >
                    {/* New Password Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            New Password
                        </label>
                        <input
                            placeholder="New Password"
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            placeholder="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 px-4 rounded-xl text-white bg-primary hover:bg-primary-dark transition ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Resetting Password..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
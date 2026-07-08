"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);

      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation currentPage="login" showCart={false} user={null} showMinimal={true} />

      <div
        className="min-h-screen bg-dot-grid flex items-center justify-center px-4 py-16"
        role="main"
        aria-label="Login page"
      >
        <div className="w-full max-w-sm anim-fade-up">
          {/* Wordmark above card */}
          <div className="mb-8 text-center">
            <p className="font-code font-semibold tracking-widest text-base uppercase" style={{ color: 'var(--accent)' }}>
              🔧 Torque Auto Parts
            </p>
            <p className="font-code text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              Quality Car Parts Online
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-xl p-8"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--edge-mid)',
            }}
          >
            <h1 className="font-display text-2xl mb-6" style={{ color: 'var(--text-1)' }}>
              Sign in
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-code font-medium mb-2 uppercase tracking-wide"
                  style={{ color: 'var(--text-2)' }}
                >
                  Email
                </label>
                <input
                  id="email"
                  data-testid="email-input"
                  type="text"
                  aria-label="Email address input"
                  aria-describedby="email-error"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@example.com"
                  className={`field ${emailError ? 'field-error' : ''}`}
                />
                {emailError && (
                  <p id="email-error" data-testid="email-error" className="text-xs mt-1.5" style={{ color: 'var(--danger)' }} role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-code font-medium mb-2 uppercase tracking-wide"
                  style={{ color: 'var(--text-2)' }}
                >
                  Password
                </label>
                <input
                  id="password"
                  data-testid="password-input"
                  type="password"
                  aria-label="Password input"
                  aria-describedby="password-error"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  placeholder="••••••••"
                  className={`field ${passwordError ? 'field-error' : ''}`}
                />
                {passwordError && (
                  <p id="password-error" data-testid="password-error" className="text-xs mt-1.5" style={{ color: 'var(--danger)' }} role="alert">
                    {passwordError}
                  </p>
                )}
              </div>

              {error && (
                <div
                  data-testid="error-message"
                  className="px-4 py-3 rounded text-sm"
                  style={{
                    background: 'var(--danger-dim)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                  }}
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                data-testid="login-button"
                disabled={loading}
                aria-label={loading ? "Logging in, please wait" : "Log in button"}
                aria-busy={loading}
                className="btn-amber w-full mt-2"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-6 font-code" style={{ color: 'var(--text-3)' }}>
            Secure checkout · Trade prices · Fast delivery
          </p>
        </div>
      </div>
    </>
  );
}

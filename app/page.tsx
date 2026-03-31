"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  useEffect(() => {
    if (!siteKey) return
    const id = "recaptcha-v3"
    if (document.getElementById(id)) return
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.id = id
    document.head.appendChild(script)
  }, [siteKey])

  const handleLogin = async () => {
    setError(null)
    if (!siteKey) {
      console.error("reCAPTCHA site key not set")
      setError("Unable to complete login at the moment.")
      return
    }
    const grecaptcha = (window as any).grecaptcha
    if (!grecaptcha) {
      console.error("grecaptcha not yet available")
      setError("Please wait a moment and try again.")
      return
    }

    setIsSubmitting(true)
    try {
      const token = await grecaptcha.execute(siteKey, { action: "login" })
      const result = await signIn("credentials", {
        username,
        password,
        recaptchaToken: token,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.error) {
        if (result.error === "RATE_LIMIT") {
          setError("Too many attempts. Please wait a minute and try again.")
        } else {
          setError("Invalid username or password.")
        }
        return
      }

      if (result?.ok && result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error("reCAPTCHA execution failed", err)
      setError("Unable to complete login. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white/95 backdrop-blur-md border border-emerald-200 shadow-2xl rounded-4xl overflow-hidden">
        <div className="bg-linear-to-r from-emerald-600 to-teal-500 px-6 py-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
        </div>

        <div className="p-6 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !username || !password}
              className="w-full rounded-2xl bg-emerald-600 text-white py-3 text-sm font-semibold shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transition disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState("admin@example.com");
  const [password,setPassword]=useState("admin123456");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(event:FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response=await fetch("/api/v1/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:email.trim(),password}),
      });
      const payload=await response.json();
      if(!response.ok||!payload.success) {
        setError(payload.error?.message||"ایمیل یا رمز عبور اشتباه است.");
        return;
      }
      const token = payload.data?.accessToken;
      if (token) {
        try {
          localStorage.setItem("admin_token", token);
          sessionStorage.setItem("admin_token", token);
          document.cookie = `access_token=${token}; path=/; secure; samesite=none; partitioned; max-age=900`;
        } catch {}
      }
      window.location.href = token ? `/admin?t=${encodeURIComponent(token)}` : "/admin";
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="admin-login-page">
      <form onSubmit={submit} className="admin-login-card">
        <h1 style={{marginTop:0}}>ورود به پنل مدیریت</h1>
        <label className="admin-login-field">ایمیل<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" required /></label>
        <label className="admin-login-field">رمز عبور<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" minLength={8} required /></label>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button disabled={loading} type="submit" style={{width:"100%",padding:12}}>{loading?"در حال ورود…":"ورود"}</button>
        <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(64,76,52, 0.12)", border: "1px solid rgba(64,76,52, 0.25)", borderRadius: 12, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>اطلاعات حساب پیش‌فرض:</div>
          <div>ایمیل: <strong dir="ltr">admin@example.com</strong></div>
          <div>رمز عبور: <strong dir="ltr">admin123456</strong></div>
          <button
            type="button"
            onClick={() => { setEmail("admin@example.com"); setPassword("admin123456"); }}
            style={{ marginTop: 8, width: "100%", padding: "7px 10px", fontSize: 12, background: "#fff", border: "1px solid #ccc", borderRadius: 8, cursor: "pointer" }}
          >
            درج خودکار مشخصات پیش‌فرض
          </button>
        </div>
      </form>
    </main>
  );
}
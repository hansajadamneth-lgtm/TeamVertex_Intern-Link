"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type User = { fullName: string; email: string; role: string; education?: string; location?: string; bio?: string; skills?: string[] };
export default function ProfilePage(){
 const [user,setUser]=useState<User|null>(null),[error,setError]=useState("");
 useEffect(()=>{fetch("/api/auth/me",{cache:"no-store"}).then(async(r)=>{const j=await r.json();if(!r.ok||!j.success)throw new Error(j.message||"Please sign in.");setUser(j.user)}).catch((e:Error)=>setError(e.message));},[]);
 return <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-6 text-[#17233b]"><section className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
   <Link href={user?.role==="employer"?"/employer":user?.role==="admin"?"/admin/dashboard":"/home"} className="text-sm text-[#ff7417]">← Back to InternLink</Link><h1 className="mt-5 text-3xl font-bold">My profile</h1>
   {error && <p role="alert" className="mt-4 text-red-600">{error} <Link href="/login" className="underline">Login</Link></p>}
   {!user && !error && <p className="mt-4 text-sm">Loading profile...</p>}
   {user && <div className="mt-6 space-y-4"><div><h2 className="text-xl font-semibold">{user.fullName}</h2><p className="text-sm text-slate-500">{user.email} · {user.role}</p></div>
     <p className="text-sm text-slate-500">{user.location || "Location not provided"}</p>
     {user.role==="student" && <p className="text-sm">{user.education || "Add your education in the CV builder."}</p>}
     {user.role==="student" && <p className="whitespace-pre-wrap text-sm">{user.bio || "Add a summary in the CV builder."}</p>}
     {user.role==="student" && <div className="flex flex-wrap gap-2">{(user.skills||[]).map((skill)=><span key={skill} className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700">{skill}</span>)}</div>}
     <div className="flex flex-wrap gap-3 pt-5">
       {user.role==="student" && <Link href="/cv-builder" className="rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white">Build / edit CV</Link>}
       <Link href="/profile/edit" className="rounded-xl border px-5 py-3 text-sm">Account details</Link>
       {user.role==="student" && <Link href="/recommendations" className="rounded-xl border px-5 py-3 text-sm">My matches</Link>}
       {user.role==="employer" && <Link href="/employer" className="rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white">Company dashboard</Link>}
       {user.role==="admin" && <Link href="/admin/dashboard" className="rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white">Admin dashboard</Link>}
     </div></div>}
 </section></main>;
}

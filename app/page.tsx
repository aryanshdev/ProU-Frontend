"use client"
import Link from "next/link";
import {
  
  Layout,
  Database,
  Layers,
 
  Code,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const signIn = ()=>{
    router.push(process.env.NEXT_PUBLIC_BACKEND_URL+"/auth/google")
  }
  return (
  
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-blue-500/30">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md fixed w-full z-50">
        <div className="mx-auto flex h-16 px-6 md:px-16 items-center justify-between ">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            EmpTrack
          </span>
          <Link
            href="https://github.com/aryanshdev/ProU-Submission"
            target="_blank"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Code className="h-4 w-4" />
            <span>Source Code</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-16 text-center ">
        <div className="mb-8 inline-flex items-center rounded-full  bg-blue-500/40 px-5 py-1 text-sm text-blue-400 backdrop-blur-xl ">
          ProU Task Submission
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
          Managing Employees <br />
          <span className="text-zinc-500">made easier.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          A full-stack demo project for Track 1 & 2 & 3 For ProU Submission By
          <span className="block font-semibold">
            Aryansh Gupta - 22BCE10404
          </span>
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            className="flex h-12 items-center gap-2 rounded-lg bg-white px-8 text-black font-semibold hover:bg-gray-200 transition-all"
            onClick={() => signIn()}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Feature Section */}
        <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
          {/* Frontend Task */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-left hover:border-blue-500/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-2">
              <Layout className="h-6 w-6 stroke-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Track 1: Frontend
            </h3>
            <p className="text-sm text-zinc-400">
              <span className="font-semibold">Task:</span> Build a functional,
              responsive frontend using mock JSON data. Emphasis on UI/UX,
              interactivity, and clean code.
            </p>
          </div>

          {/* Backend Task*/}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-left hover:border-blue-500/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-2">
              <Database className="h-6 w-6 stroke-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Track 2: Backend
            </h3>
            <p className="text-sm text-zinc-400">
              <span className="font-semibold">Task:</span> Design and implement
              RESTful APIs to manage Employees and Tasks with real database CRUD
              operations.
            </p>
          </div>

          {/* Fullstack Display */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-left hover:border-blue-500/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-2">
              <Layers className="h-6 w-6 stroke-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Track 3: Full Stack
            </h3>
            <p className="text-sm text-zinc-400">
              <span className="font-semibold">Task:</span> Build an integrated
              web app with both frontend UI and backend APIs connected to a
              database.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-base text-gray-400">
        <p>Built by Aryansh Gupta for ProU Evaluation</p>
      </footer>
    </div>
  );
}

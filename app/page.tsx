// File: app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Osvaldo Panguana
        </h1>
        <p className="text-xl text-slate-300">
          IT Systems Administrator • Cloud Enthusiast • Python & JavaScript Developer
        </p>

        <div className="flex gap-4">
          <Link href="/projects">
            <Button className="text-lg px-6 py-4">View Projects</Button>
          </Link>
          <Link href="/resume">
            <Button variant="outline" className="text-lg px-6 py-4 text-white border-white">
              View Resume
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-800 border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">About Me</h2>
            <p className="text-slate-300">
              With 8+ years of experience in systems and network administration, I specialize in hybrid IT infrastructures, cloud technologies (Azure, M365, VMware), and automation using PowerShell and Python. Passionate about building secure, scalable systems and mentoring IT teams across global environments.
            </p>
          </CardContent>
        </Card>

        <Link href="/contact" className="inline-flex items-center gap-2 text-sky-400 hover:underline">
          Let’s connect <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}

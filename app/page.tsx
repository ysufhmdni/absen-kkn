import Link from "next/link";
import {
  Command,
  KeyRound,
  ShieldCheck,
  ScrollText,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { IdentityMesh } from "@/components/identity-mesh";

const stats = [
  { label: "Anggota KKN", value: "25" },
  { label: "Doa", value: "Unlimited" },
  { label: "Proker", value: "Gaada Proker Kita mah" },
];

const features = [
  {
    icon: KeyRound,
    title: "Single Sign-On",
    description:
      "Satu login untuk seluruh aplikasi internal Pupuk Kujang — dari ERP, e-office, hingga sistem produksi. Tidak ada lagi kata sandi terpisah per sistem.",
  },
  {
    icon: ShieldCheck,
    title: "Kontrol akses berbasis peran",
    description:
      "Hak akses mengikuti jabatan dan unit kerja. Saat seseorang pindah divisi, aksesnya menyesuaikan otomatis — tidak tertinggal, tidak berlebihan.",
  },
  {
    icon: ScrollText,
    title: "Jejak audit menyeluruh",
    description:
      "Setiap permintaan, persetujuan, dan perubahan akses tercatat dan dapat ditelusuri, siap untuk kebutuhan audit internal maupun eksternal.",
  },
];

const flow = [
  { step: "01", title: "Ajukan akses", body: "Karyawan mengajukan akses sistem lewat portal, lengkap dengan alasan penggunaan." },
  { step: "02", title: "Disetujui atasan", body: "Permintaan diteruskan ke atasan langsung dan pemilik sistem untuk persetujuan." },
  { step: "03", title: "Diberikan otomatis", body: "Setelah disetujui, IAM Kujang memberikan akses ke sistem terkait tanpa tiket manual." },
  { step: "04", title: "Ditinjau berkala", body: "Akses ditinjau ulang secara berkala agar tetap sesuai dengan peran saat ini." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b border-border/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="h-5 w-5 text-accent" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              KKN Taringgul Tonggoh 2026
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="#fitur" className="transition-colors hover:text-foreground">
              Fitur
            </Link>
            <Link href="#alur" className="transition-colors hover:text-foreground">
              Alur Akses
            </Link>
            <Link href="#keamanan" className="transition-colors hover:text-foreground">
              Keamanan
            </Link>
          </nav>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="login" />}
          >
            sok login ah
          </Button>
        </div>
      </header>

      {/* Hero — split panel, echoing the product's own sign-in screen */}
      <section className="grid border-b border-border/60 md:grid-cols-2">
        <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden bg-panel p-8 md:min-h-[620px] md:p-12">
          <div className="mesh-grid pointer-events-none absolute inset-0 opacity-40" />
          <IdentityMesh className="pointer-events-none absolute inset-0 h-full w-full opacity-90" />
          <div className="relative flex items-center gap-2">
            <Command className="h-5 w-5 text-accent" strokeWidth={2.2} />
          </div>
          <div className="relative max-w-sm">
            <p className="font-display text-2xl font-medium leading-snug text-balance md:text-3xl">
              Kata desy kalo ga absen denda bos.
            </p>
            <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Dibangun oleh UCUP & API maaf capslock
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-16">
          <Badge
            variant="outline"
            className="w-fit border-accent/30 bg-accent/10 font-mono uppercase tracking-wide text-accent"
          >
            Identity &amp; Access Management
          </Badge>
          <h1 className="mt-5 max-w-lg font-display text-4xl font-semibold leading-[1.08] text-balance md:text-5xl">
            Harayu kasep/geulis sok geura absen atuh ah well.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Cita cita kamu apa? Pilot. Kalo kamu? hmmmmmmm sama kamuu
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg">
              Lanjut Absen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="container py-24 md:py-32">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-wide text-accent">
            Fitur utama
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-balance md:text-4xl">
            Dibuat untuk cara Pupuk Kujang bekerja.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="bg-panel">
              <CardHeader>
                <f.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                <CardTitle className="mt-3">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* CTA */}
      <section id="keamanan" className="container py-24 md:py-32">
        <div className="line-grid relative overflow-hidden rounded-2xl border border-border bg-panel px-8 py-14 text-center md:px-16 md:py-20">
          <h2 className="mx-auto max-w-lg font-display text-3xl font-semibold leading-tight text-balance md:text-4xl">
            Siap merapikan akses tim Anda?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
            Hubungi UCUP & API kalo absen kalian mau dibenerin,
            nuhun ach asek asek
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">
              Hubungi Ucup / API
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Built by Ucup dan Api Ganteng Banget asik asik joss.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Jangan macem macem sama kita berdua.
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Cita cita kamu apa?
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
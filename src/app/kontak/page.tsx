export const metadata = {
  title: "Kontak Kami",
  description: "Hubungi redaksi Jagat News untuk pertanyaan atau kerjasama.",
}

import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function KontakPage() {
  return (
    <div className="bg-background pb-16 pt-8 lg:pt-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Hubungi <span className="text-blue-600 dark:text-blue-500">Kami</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Punya pertanyaan, masukan, atau ingin menjalin kerjasama? Jangan
            ragu untuk menghubungi tim kami.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Info Kontak */}
          <div className="space-y-8 animate-fade-in-left">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Alamat Kantor</h3>
                  <p className="mt-1 text-muted-foreground">
                    Jl. Jenderal Sudirman No. 123<br />
                    Jakarta Pusat, 10220<br />
                    Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Telepon</h3>
                  <p className="mt-1 text-muted-foreground">
                    +62 21 555 1234<br />
                    Senin - Jumat, 09:00 - 17:00 WIB
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="mt-1 text-muted-foreground">
                    redaksi@jagatnews.com<br />
                    info@jagatnews.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Kontak */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Kirim Pesan
            </h2>
            <form className="space-y-5" action="#">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <Input type="text" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Alamat Email
                </label>
                <Input type="email" placeholder="nama@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Subjek
                </label>
                <Input type="text" placeholder="Pertanyaan / Kerjasama" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Pesan
                </label>
                <textarea
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  rows={4}
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>
              <Button type="submit" className="w-full">
                Kirim Pesan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

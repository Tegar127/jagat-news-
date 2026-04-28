import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertCircle className="h-16 w-16" />
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        404
      </h1>
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
        dipindahkan.
      </p>
      <Button asChild size="lg" className="rounded-full shadow-lg">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}

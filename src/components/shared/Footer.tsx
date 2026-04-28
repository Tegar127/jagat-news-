import Link from "next/link"
import { Newspaper, Send, Globe, MessageCircle, Share2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Jagat News</span>
            </Link>
            <p className="mb-6 text-sm text-slate-400 leading-relaxed">
              Portal berita terdepan yang menyajikan informasi akurat, terkini, dan
              terpercaya dari seluruh dunia. Kami berkomitmen pada jurnalisme berkualitas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-blue-600 hover:text-white"
                aria-label="Facebook"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-blue-400 hover:text-white"
                aria-label="Twitter"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-blue-700 hover:text-white"
                aria-label="LinkedIn"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              Navigasi
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/tentang" className="transition-colors hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="transition-colors hover:text-white">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="transition-colors hover:text-white">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/syarat" className="transition-colors hover:text-white">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              Kategori Populer
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/berita?kategori=teknologi"
                  className="transition-colors hover:text-white"
                >
                  Teknologi
                </Link>
              </li>
              <li>
                <Link
                  href="/berita?kategori=olahraga"
                  className="transition-colors hover:text-white"
                >
                  Olahraga
                </Link>
              </li>
              <li>
                <Link
                  href="/berita?kategori=politik"
                  className="transition-colors hover:text-white"
                >
                  Politik
                </Link>
              </li>
              <li>
                <Link
                  href="/berita?kategori=ekonomi"
                  className="transition-colors hover:text-white"
                >
                  Ekonomi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              Berlangganan Newsletter
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Dapatkan berita terbaru langsung di inbox Anda setiap pagi.
            </p>
            <form className="flex" action="#">
              <input
                type="email"
                placeholder="Alamat email..."
                className="w-full rounded-l-md border-0 bg-slate-800 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Jagat News. Hak Cipta Dilindungi.</p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <Link href="/privasi" className="hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/syarat" className="hover:text-slate-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

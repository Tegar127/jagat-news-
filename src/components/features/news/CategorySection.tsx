import Link from "next/link"
import { Briefcase, Cpu, Scale, TrendingUp, Globe } from "lucide-react"

// Note: React Icons is not installed yet, using Lucide equivalents for now.
const categories = [
  {
    name: "Politik",
    icon: <Briefcase className="h-8 w-8" />,
    color: "text-red-500",
    hoverBg: "hover:bg-red-50 dark:hover:bg-red-950/50",
    href: "/berita?kategori=politik",
  },
  {
    name: "Teknologi",
    icon: <Cpu className="h-8 w-8" />,
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/50",
    href: "/berita?kategori=teknologi",
  },
  {
    name: "Olahraga",
    icon: <TrendingUp className="h-8 w-8" />,
    color: "text-green-500",
    hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/50",
    href: "/berita?kategori=olahraga",
  },
  {
    name: "Ekonomi",
    icon: <Scale className="h-8 w-8" />,
    color: "text-yellow-500",
    hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-950/50",
    href: "/berita?kategori=ekonomi",
  },
  {
    name: "Internasional",
    icon: <Globe className="h-8 w-8" />,
    color: "text-indigo-500",
    hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
    href: "/berita?kategori=internasional",
  },
]

export function CategorySection() {
  return (
    <section className="bg-card py-16 lg:py-24 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-slide-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Jelajahi Berdasarkan Kategori
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Temukan berita yang relevan dengan minat Anda dengan cepat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {categories.map((c, index) => (
            <Link
              key={c.name}
              href={c.href}
              className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-transparent bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl ${c.hoverBg}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`mb-4 inline-flex items-center justify-center rounded-full bg-card p-4 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white ${c.color}`}
              >
                {c.icon}
              </div>
              <h3 className="font-bold text-card-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {c.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

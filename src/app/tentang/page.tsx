export const metadata = {
  title: "Tentang Kami",
  description: "Mengenal lebih dekat Jagat News dan tim di baliknya.",
}

export default function TentangPage() {
  return (
    <div className="bg-background pb-16 pt-8 lg:pt-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Tentang <span className="text-blue-600 dark:text-blue-500">Jagat News</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Portal berita independen yang didedikasikan untuk menyajikan
            informasi paling akurat, objektif, dan terkini.
          </p>
        </div>

        <div className="space-y-12">
          <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h2 className="mb-4 border-b border-border pb-2 text-2xl font-bold text-foreground">
              Visi Kami
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Menjadi sumber informasi terpercaya nomor satu di Indonesia yang
              mengedepankan jurnalisme berkualitas, integritas, dan keberimbangan
              dalam setiap berita yang kami sajikan kepada masyarakat.
            </p>
          </section>

          <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="mb-4 border-b border-border pb-2 text-2xl font-bold text-foreground">
              Misi Kami
            </h2>
            <ul className="list-inside list-disc space-y-3 text-lg leading-relaxed text-muted-foreground">
              <li>Menyajikan berita dengan fakta yang akurat dan terverifikasi.</li>
              <li>Memberikan edukasi kepada masyarakat melalui liputan mendalam.</li>
              <li>Mendorong diskursus publik yang sehat dan konstruktif.</li>
              <li>Beradaptasi dengan teknologi untuk pengalaman membaca terbaik.</li>
            </ul>
          </section>

          <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <h2 className="mb-4 border-b border-border pb-2 text-2xl font-bold text-foreground">
              Tim Kami
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Kami terdiri dari jurnalis berpengalaman, editor profesional, dan
              pakar teknologi yang bekerja tanpa lelah untuk memastikan Anda
              mendapatkan berita terbaik setiap harinya.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

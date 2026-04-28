import React, { useEffect } from 'react';
import { Target, Eye, Gem, Award, Briefcase, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const aboutContent = {
    hero: {
        tagline: "Menyajikan Berita Terkini dan Terpercaya",
        title: "Platform Berita Terdepan di Indonesia.",
        description: "Kami hadir untuk memberikan Anda informasi terbaru, akurat, dan mendalam dari berbagai penjuru dunia, langsung ke genggaman Anda.",
        buttonText: "Mulai Membaca",
        buttonLink: "/berita"
    },
    ourStory: {
        heading: "Siapa Kami",
        title: "Kisah di Balik Jagat News: Membangun Jembatan Informasi.",
        paragraphs: [
            "Jagat News lahir dari visi untuk menyajikan berita yang tidak hanya cepat, tetapi juga akurat dan berimbang. Kami memahami kebutuhan masyarakat akan informasi yang dapat dipercaya di tengah derasnya arus informasi.",
            "Dengan memanfaatkan teknologi terkini, kami menciptakan platform berita yang terintegrasi, menyajikan berita dari berbagai kategori, mulai dari politik, ekonomi, olahraga, hingga teknologi.",
            "Sejak didirikan, kami terus berinovasi untuk menjadi sumber informasi utama bagi masyarakat Indonesia. Kami berdedikasi untuk menyajikan berita yang mendidik, mencerahkan, dan memberdayakan."
        ],
        imageUrl: "https://placehold.co/800x500/60A5FA/FFFFFF?text=Jagat+News+Story",
    },
    values: [
        { icon: <Target className="w-8 h-8 text-blue-600" />, title: "Akurat & Terpercaya", description: "Setiap berita yang kami sajikan telah melalui proses verifikasi yang ketat untuk memastikan akurasinya." },
        { icon: <Eye className="w-8 h-8 text-teal-600" />, title: "Berimbang & Objektif", description: "Kami menyajikan berita dari berbagai sudut pandang untuk memberikan gambaran yang utuh dan objektif." },
        { icon: <Gem className="w-8 h-8 text-yellow-600" />, title: "Integritas Jurnalistik", description: "Menjunjung tinggi standar etika dan kualitas tertinggi dalam setiap liputan." },
        { icon: <Award className="w-8 h-8 text-green-600" />, title: "Cepat & Terkini", description: "Menyajikan informasi terbaru secepat mungkin tanpa mengorbankan akurasi." },
        { icon: <Briefcase className="w-8 h-8 text-red-600" />, title: "Profesionalisme", description: "Menyediakan berita dengan standar profesionalisme dan dedikasi tinggi." },
    ],
    team: [
        { id: 1, name: "Tegar", title: "Chief Executive Officer", imageUrl: "https://placehold.co/300x300/6366F1/FFFFFF?text=Tegar" },
        { id: 2, name: "Teguh", title: "Chief Technology Officer", imageUrl: "https://placehold.co/300x300/10B981/FFFFFF?text=Teguh" },
        { id: 3, name: "Tegas", title: "Head of Editorial", imageUrl: "https://placehold.co/300x300/F59E0B/FFFFFF?text=Tegas" },
        { id: 4, name: "Tangkas", title: "Community & Partnership Lead", imageUrl: "https://placehold.co/300x300/3B82F6/FFFFFF?text=Tangkas" },
    ],
    cta: {
        title: "Siap Menjadi Lebih Terinformasi?",
        subtitle: "Bergabunglah dengan jutaan pembaca kami dan dapatkan berita terbaru setiap hari.",
        buttonText: "Daftar Sekarang",
        buttonLink: "/daftar"
    }
};

const SectionHeader = ({ subTitle, title, aosDelay = 0 }) => (
    <div className="text-center mb-12">
        {subTitle && (
            <p
                className="text-blue-600 text-sm font-semibold uppercase mb-2"
                data-aos="fade-down"
                data-aos-duration="700"
                data-aos-delay={aosDelay}
                data-aos-once="true"
            >
                {subTitle}
            </p>
        )}
        <h2
            className="text-3xl md:text-4xl font-bold text-foreground"
            data-aos="fade-down"
            data-aos-duration="700"
            data-aos-delay={aosDelay + 100}
            data-aos-once="true"
        >
            {title}
        </h2>
    </div>
);

const ValueCard = ({ value, index }) => (
    <div
        className="bg-card rounded-xl p-6 text-center flex flex-col items-center border border-custom transform hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-md"
        data-aos="fade-up"
        data-aos-delay={index * 120}
        data-aos-duration="800"
        data-aos-once="true"
    >
        <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
            {value.icon}
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">{value.title}</h3>
        <p className="text-muted-foreground text-center text-sm">{value.description}</p>
    </div>
);

const TeamMemberCard = ({ member, index }) => (
    <div
        className="bg-card rounded-xl shadow-md p-6 text-center border border-custom transform hover:scale-105 transition-all duration-300 flex flex-col items-center"
        data-aos="fade-up"
        data-aos-delay={index * 150}
        data-aos-duration="800"
        data-aos-once="true"
    >
        <img
            src={member.imageUrl}
            alt={member.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200 shadow-lg"
        />
        <h3 className="text-xl font-bold text-card-foreground">{member.name}</h3>
        <p className="text-blue-600 text-md font-medium">{member.title}</p>
    </div>
);

export default function AboutPage() {
    useEffect(() => {
        if (!AOS.instance) {
             AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true,
                offset: 120,
            });
        }
        AOS.refresh();
    }, []);

    return (
        <div className="bg-background text-foreground">
            <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
                    <p
                        className="text-blue-200 text-lg md:text-xl font-semibold mb-3"
                        data-aos="fade-up" data-aos-duration="700" data-aos-delay="100"
                    >
                        {aboutContent.hero.tagline}
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
                        data-aos="fade-up" data-aos-duration="800" data-aos-delay="200"
                    >
                        {aboutContent.hero.title}
                    </h1>
                    <p
                        className="text-lg opacity-90 max-w-2xl mx-auto mb-10"
                        data-aos="fade-up" data-aos-duration="900" data-aos-delay="300"
                    >
                        {aboutContent.hero.description}
                    </p>
                    <a
                        href={aboutContent.hero.buttonLink}
                        className="inline-flex items-center bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        data-aos="zoom-in" data-aos-duration="800" data-aos-delay="400"
                    >
                        {aboutContent.hero.buttonText}
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>

            <section className="py-16 bg-card">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p
                                className="text-blue-600 text-sm font-semibold uppercase mb-2"
                                data-aos="fade-right" data-aos-duration="700" data-aos-once="true"
                            >
                                {aboutContent.ourStory.heading}
                            </p>
                            <h2
                                className="text-3xl md:text-4xl font-bold text-card-foreground mb-6"
                                data-aos="fade-right" data-aos-duration="800" data-aos-delay="100" data-aos-once="true"
                            >
                                {aboutContent.ourStory.title}
                            </h2>
                            {aboutContent.ourStory.paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-lg text-muted-foreground leading-relaxed mb-4"
                                    data-aos="fade-up" data-aos-duration="800" data-aos-delay={200 + index * 100} data-aos-once="true"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        <div>
                            <img
                                src={aboutContent.ourStory.imageUrl}
                                alt="Our Story"
                                className="w-full h-auto rounded-xl shadow-xl border border-custom"
                                data-aos="fade-left" data-aos-duration="900" data-aos-delay="200" data-aos-once="true"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionHeader subTitle="Prinsip Kami" title="Nilai-Nilai Inti Kami" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {aboutContent.values.map((value, index) => (
                            <ValueCard key={value.title} value={value} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-card">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionHeader subTitle="Orang-Orang di Balik Layar" title="Temui Tim Kami" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {aboutContent.team.map((member, index) => (
                            <TeamMemberCard key={member.id} member={member} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-blue-700 text-white text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        data-aos="fade-up" data-aos-duration="800" data-aos-delay="100"
                    >
                        {aboutContent.cta.title}
                    </h2>
                    <p
                        className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8"
                        data-aos="fade-up" data-aos-duration="800" data-aos-delay="200"
                    >
                        {aboutContent.cta.subtitle}
                    </p>
                    <a
                        href={aboutContent.cta.buttonLink}
                        className="inline-flex items-center bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        data-aos="zoom-in" data-aos-duration="800" data-aos-delay="300"
                    >
                        {aboutContent.cta.buttonText}
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>
        </div>
    );
}
"use client"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Calendar, MapPin, Users, Moon, Sun, Clock, ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Calculate time until event (July 15, 2025)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('July 15, 2025').getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="border-b sticky top-0 z-50 backdrop-blur-md bg-background/70">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          {/* Logo - visible on all screen sizes */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold flex items-center gap-2">
              <Image src="/techfest-logo.svg" alt="Logo" width={32} height={32} className="animate-bounce-in" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">TechFest</span>
            </span>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4 transition-all duration-200 hover:text-primary">
              About
            </Link>
            <Link href="/schedule" className="text-sm font-medium hover:underline underline-offset-4 transition-all duration-200 hover:text-primary">
              Schedule
            </Link>
            <Link href="/speakers" className="text-sm font-medium hover:underline underline-offset-4 transition-all duration-200 hover:text-primary">
              Speakers
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4 transition-all duration-200 hover:text-primary">
              Contact
            </Link>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 text-white border-0">
                Register Now
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="hover:border-primary transition-all duration-300">
                Admin Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[380px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                      <Image src="/techfest-logo.svg" alt="Logo" width={32} height={32} />
                      <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">TechFest</span>
                    </Link>
                  </div>

                  <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
                    {[
                      { name: "About", href: "/about" },
                      { name: "Schedule", href: "/schedule" },
                      { name: "Speakers", href: "/speakers" },
                      { name: "Sponsors", href: "/sponsors" },
                      { name: "Venue", href: "/venue" },
                      { name: "Contact", href: "/contact" },
                      { name: "FAQ", href: "/faq" },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-base font-medium py-3 px-3 hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col gap-4 p-4 border-t">
                    <Link href="/register" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 text-white border-0">
                        Register Now
                      </Button>
                    </Link>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full">
                        Admin Login
                      </Button>
                    </Link>

                    <div className="flex gap-4 pt-4 justify-center">
                      {[
                        { name: 'twitter', icon: '/icons/social/twitter.svg' },
                        { name: 'facebook', icon: '/icons/social/facebook.svg' },
                        { name: 'instagram', icon: '/icons/social/instagram.svg' },
                        { name: 'linkedin', icon: '/icons/social/linkedin.svg' }
                      ].map((social) => (
                        <Link
                          key={social.name}
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-muted-foreground/20 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                        >
                          <span className="sr-only">{social.name}</span>
                          <Image src={social.icon} alt={social.name} width={16} height={16} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">

        <section className="w-full py-12 md:py-20 lg:py-28 bg-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary),0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(var(--secondary),0.15),transparent_50%)]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-muted-foreground/10 px-3 py-1 text-sm">
                  <span className="font-medium">July 15-17, 2025</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                    TechFest 2025
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                    Join us for the biggest tech event of the year. Network with industry leaders, attend workshops, and
                    experience cutting-edge technology.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/register">
                    <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 text-white border-0 shadow-lg">
                      Register Now
                    </Button>
                  </Link>
                  <Link href="/schedule">
                    <Button variant="outline" size="lg" className="px-8">
                      View Schedule
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm">July 15-17, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm">GCET, India</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm">5000+ Attendees</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] h-[360px] sm:h-[400px] lg:h-[450px] overflow-hidden rounded-xl shadow-2xl transform transition-all hover:scale-[1.02] duration-500 border border-border/40">
                  <Image
                    src="/tech-event.jpg"
                    alt="TechFest 2025"
                    fill
                    className="object-cover object-center animate-fade-in"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 mix-blend-overlay"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white/90 text-sm sm:text-base font-medium">Experience the future of technology in 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Timer Section */}
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/5 to-purple-600/5"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Event Starts In
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                  Mark your calendar and be ready for the biggest tech event of the year!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto mt-10">
              <div className="bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-6 rounded-xl shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">{timeLeft.days}</span>
                <span className="text-muted-foreground text-sm mt-2 font-medium">Days</span>
              </div>
              <div className="bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-6 rounded-xl shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">{timeLeft.hours}</span>
                <span className="text-muted-foreground text-sm mt-2 font-medium">Hours</span>
              </div>
              <div className="bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-6 rounded-xl shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">{timeLeft.minutes}</span>
                <span className="text-muted-foreground text-sm mt-2 font-medium">Minutes</span>
              </div>
              <div className="bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-6 rounded-xl shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">{timeLeft.seconds}</span>
                <span className="text-muted-foreground text-sm mt-2 font-medium">Seconds</span>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/register" className="group relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_50%,#3b82f6_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-8 py-1 text-base font-medium backdrop-blur-3xl">
                  Register Today <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Speakers Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  Featured Speakers
                </h2>
                <p className="text-muted-foreground text-lg">
                  Learn from the brightest minds in the tech industry
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-12">
              {[
                {
                  name: "Dr. Priya Sharma",
                  role: "AI Research Director, TechCorp",
                  bio: "Leading AI researcher with groundbreaking work in machine learning and neural networks.",
                  image: "/speakers/priya_sharma.jpg"
                },
                {
                  name: "Rahul Verma",
                  role: "CTO, Future Systems",
                  bio: "Pioneering software architect revolutionizing cloud infrastructure and distributed systems.",
                  image: "/speakers/rahul_verma.jpg"
                },
                {
                  name: "Aishwarya Patel",
                  role: "Blockchain Specialist",
                  bio: "Web3 innovator developing solutions for decentralized finance and smart contracts.",
                  image: "/speakers/aishwarya_patel.jpg"
                }
              ].map((speaker, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center space-y-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-all duration-300 shadow-md">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{speaker.name}</h3>
                    <p className="text-sm text-primary/80 font-medium">{speaker.role}</p>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    {speaker.bio}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2 group-hover:bg-primary/10 transition-colors duration-300">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/speakers">
                <Button variant="outline" className="group">
                  View All Speakers
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Event Highlights Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.05),transparent_30%,transparent_70%,rgba(var(--secondary),0.05))]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Event Highlights
                </h2>
                <p className="text-muted-foreground text-lg">
                  Discover what makes TechFest 2025 the most anticipated tech event of the year
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-start gap-8 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  title: "Keynote Presentations",
                  description: "Hear from industry leaders and innovators about the future of technology.",
                  icon: "/icons/presentation.svg"
                },
                {
                  title: "Interactive Workshops",
                  description: "Hands-on sessions to learn new skills and technologies from experts.",
                  icon: "/icons/workshop.svg"
                },
                {
                  title: "Networking Sessions",
                  description: "Connect with peers, potential employers, and collaborators in the tech industry.",
                  icon: "/icons/networking.svg"
                },
                {
                  title: "Product Showcases",
                  description: "Experience the latest tech products and innovations from leading companies.",
                  icon: "/icons/product.svg"
                },
                {
                  title: "Hackathon Challenges",
                  description: "Compete in coding challenges with prizes for the most innovative solutions.",
                  icon: "/icons/hackathon.svg"
                },
                {
                  title: "Career Fair",
                  description: "Meet with recruiters from top tech companies hiring for various positions.",
                  icon: "/icons/career.svg"
                }
              ].map((highlight, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start space-y-3 rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Image
                      src={highlight.icon}
                      alt={highlight.title}
                      width={24}
                      height={24}
                      className="text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{highlight.title}</h3>
                    <p className="text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/register">
                <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 text-white border-0 shadow-lg">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--primary),0.03),transparent_70%)]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  Our Sponsors
                </h2>
                <p className="text-muted-foreground text-lg">
                  Partnering with leading technology companies to bring you the best experience
                </p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8 py-8">
              {[
                { name: "TechCorp", logo: "/sponsors/techcorp.svg" },
                { name: "Cloudify", logo: "/sponsors/cloudify.svg" },
                { name: "DataWave", logo: "/sponsors/datawave.svg" },
                { name: "AIMatrix", logo: "/sponsors/aimatrix.svg" },
                { name: "SecureBlock", logo: "/sponsors/secureblock.svg" },
                { name: "NexusTech", logo: "/sponsors/nexustech.svg" },
                { name: "DevForge", logo: "/sponsors/devforge.svg" },
                { name: "QuantumCode", logo: "/sponsors/quantumcode.svg" }
              ].map((sponsor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-105 bg-background/60 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm hover:shadow-md hover:border-primary/20 dark:bg-white"
                >
                  <div className="relative h-12 w-36 md:h-16 md:w-40">
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Interested in sponsoring TechFest 2025?
              </p>
              <Link href="/contact">
                <Button variant="outline" className="group">
                  Become a Sponsor
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-16 md:py-24 lg:py-28 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(var(--primary),0.02),transparent_30%,transparent_70%,rgba(var(--secondary),0.02))]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  What Attendees Say
                </h2>
                <p className="text-muted-foreground text-lg">
                  Hear from past attendees about their experience at TechFest
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-12">
              {[
                {
                  name: "Neha Sharma",
                  role: "Software Engineer, InfoTech",
                  testimonial: "TechFest was an incredible experience! The workshops were informative and the networking opportunities were invaluable. Can't wait for next year!",
                  image: "/testimonials/neha_sharma.jpg"
                },
                {
                  name: "Ankit Gupta",
                  role: "Product Manager, TechSolutions",
                  testimonial: "The speakers were world-class and I learned so much that I could immediately apply to my work. The organization was flawless!",
                  image: "/testimonials/ankit_gupta.jpg"
                },
                {
                  name: "Meera Verma",
                  role: "Data Scientist, Analytics India",
                  testimonial: "As someone new to the industry, TechFest provided me with insights and connections that have accelerated my career. Highly recommended!",
                  image: "/testimonials/meera_verma.jpg"
                },
                {
                  name: "Raj Patel",
                  role: "CTO, InnovateNow",
                  testimonial: "We found amazing talent at TechFest last year. The caliber of attendees and the quality of conversations made it worth every penny.",
                  image: "/testimonials/raj_patel.jpg"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="relative flex flex-col p-6 bg-background/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-primary/10"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 flex items-center justify-center bg-primary rounded-full text-primary-foreground text-2xl font-bold shadow-md">
                    "
                  </div>
                  <p className="text-muted-foreground italic mb-4 pt-2">"{testimonial.testimonial}"</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/50 shadow-sm">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.03),transparent_50%)]"></div>
        <div className="container px-4 py-10 md:py-16 md:px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4 sm:col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image src="/techfest-logo.svg" alt="Logo" width={40} height={40} />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">TechFest</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The premier tech event bringing together innovators, developers, and industry leaders from around the world.
              </p>
              <div className="flex gap-4">
                {[
                  { name: 'twitter', icon: '/icons/social/twitter.svg' },
                  { name: 'facebook', icon: '/icons/social/facebook.svg' },
                  { name: 'instagram', icon: '/icons/social/instagram.svg' },
                  { name: 'linkedin', icon: '/icons/social/linkedin.svg' }
                ].map((social) => (
                  <Link
                    key={social.name}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-muted-foreground/20 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                  >
                    <span className="sr-only">{social.name}</span>
                    <Image src={social.icon} alt={social.name} width={16} height={16} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold">Quick Links</h4>
              <ul className="space-y-3">
                {['About', 'Speakers', 'Schedule', 'Venue', 'FAQ'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center">
                      <ArrowRight className="mr-2 h-3 w-3" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>GCET, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                  </svg>
                  <span>nk10nikhil@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a1 1 0 0 1 1 .75l1.13 4.52a1 1 0 0 1-.29 1L9.91 11.09a16 16 0 0 0 6 6l1.82-1.82a1 1 0 0 1 1-.29l4.52 1.13a1 1 0 0 1 .75 1z" />
                  </svg>
                  <span>+91 7777048666</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold">Subscribe</h4>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest about TechFest 2025
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background/70 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="sm" className="h-10 w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 text-white border-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              © 2025 TechFest. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

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

  // Calculate time until event (May 15, 2025)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('May 15, 2025').getTime();
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
    <div className="flex flex-col min-h-screen">
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
          <nav className="hidden md:flex items-center gap-6">
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
              <SheetContent side="right" className="w-[80%] sm:w-[380px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsMenuOpen(false)}>
                      <Image src="/techfest-logo.svg" alt="Logo" width={32} height={32} />
                      <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">TechFest</span>
                    </Link>
                  </div>

                  <nav className="flex flex-col gap-4 py-6">
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
                        className="text-base font-medium py-2 px-1 hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col gap-4 pt-6 border-t">
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
                      {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                        <Link
                          key={social}
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-muted-foreground/20 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                        >
                          <span className="sr-only">{social}</span>
                          <div className="h-4 w-4" />
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">TechFest 2025</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join us for the biggest tech event of the year. Network with industry leaders, attend workshops, and
                    experience cutting-edge technology.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="px-8">
                      Register Now
                    </Button>
                  </Link>
                  <Link href="/schedule">
                    <Button variant="outline" size="lg" className="px-8">
                      View Schedule
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>May 15-17, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Tech Convention Center, Delhi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Expected Attendance: 5000+</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Countdown: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-xl transform transition-all hover:scale-105 duration-500">
                  <Image
                    src="/tech-event.jpg"
                    alt="TechFest 2025"
                    fill
                    className="object-cover object-center animate-fade-in"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 mix-blend-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Timer Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/10 to-purple-600/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Event Starts In
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Mark your calendar and be ready for the biggest tech event of the year!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
              <div className="bg-background flex flex-col items-center justify-center p-6 rounded-lg shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.days}</span>
                <span className="text-muted-foreground text-sm mt-2">Days</span>
              </div>
              <div className="bg-background flex flex-col items-center justify-center p-6 rounded-lg shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.hours}</span>
                <span className="text-muted-foreground text-sm mt-2">Hours</span>
              </div>
              <div className="bg-background flex flex-col items-center justify-center p-6 rounded-lg shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.minutes}</span>
                <span className="text-muted-foreground text-sm mt-2">Minutes</span>
              </div>
              <div className="bg-background flex flex-col items-center justify-center p-6 rounded-lg shadow-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.seconds}</span>
                <span className="text-muted-foreground text-sm mt-2">Seconds</span>
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  Featured Speakers
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Learn from the brightest minds in the tech industry.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
              {[1, 2, 3].map((speaker) => (
                <div key={speaker} className="group flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in-right" style={{ animationDelay: `${speaker * 0.1}s` }}>
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-all duration-300">
                    <Image
                      src="/speaker.jpg"
                      alt={`Speaker ${speaker}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-xl font-bold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">CTO, Tech Company</p>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Renowned expert in artificial intelligence and machine learning with over 15 years of experience.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  Our Sponsors
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Partnering with leading technology companies to bring you the best experience.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 md:grid-cols-4 gap-8 py-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sponsor) => (
                <div key={sponsor} className="flex items-center justify-center p-4 grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110">
                  <div className="relative h-10 w-24 md:h-16 md:w-32">
                    <div className="absolute inset-0 bg-gray-300/50 dark:bg-gray-700/50 rounded-md animate-pulse"></div>
                    <div className="flex items-center justify-center h-full">
                      <span className="text-muted-foreground text-xs md:text-sm font-medium">Sponsor {sponsor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground">
                Interested in sponsoring TechFest 2025?
                <Link href="/contact" className="text-primary ml-1 hover:underline underline-offset-4">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  What Attendees Say
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from past attendees about their experience at TechFest.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 md:grid-cols-2 gap-8 py-12">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Software Engineer",
                  testimonial: "TechFest was an incredible experience! The workshops were informative and the networking opportunities were invaluable. Can't wait for next year!",
                  image: "/placeholder-user.jpg"
                },
                {
                  name: "Michael Chen",
                  role: "Product Manager",
                  testimonial: "The speakers were world-class and I learned so much that I could immediately apply to my work. The organization was flawless!",
                  image: "/placeholder-user.jpg"
                },
                {
                  name: "Priya Sharma",
                  role: "Data Scientist",
                  testimonial: "As someone new to the industry, TechFest provided me with insights and connections that have accelerated my career. Highly recommended!",
                  image: "/placeholder-user.jpg"
                },
                {
                  name: "Alex Rodriguez",
                  role: "CTO, Startup Inc.",
                  testimonial: "We found amazing talent at TechFest last year. The caliber of attendees and the quality of conversations made it worth every penny.",
                  image: "/placeholder-user.jpg"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="relative flex flex-col p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-primary/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -top-5 -left-5 w-10 h-10 flex items-center justify-center bg-primary rounded-full text-primary-foreground text-2xl font-bold">
                    "
                  </div>
                  <p className="text-muted-foreground italic mb-4">"{testimonial.testimonial}"</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/50">
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
      <footer className="border-t bg-muted/20">
        <div className="container px-4 py-10 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image src="/techfest-logo.svg" alt="Logo" width={40} height={40} />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">TechFest</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The premier tech event bringing together innovators, developers, and industry leaders.
              </p>
              <div className="flex gap-4">
                {/* Social Media Links */}
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-muted-foreground/20 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Speakers', 'Schedule', 'Venue', 'FAQ'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tech Convention Center</li>
                <li>123 Tech Park, Delhi</li>
                <li>info@techfest2025.com</li>
                <li>+91 123-456-7890</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-semibold">Subscribe</h4>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest about TechFest 2025
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="sm" className="h-10 px-4">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t">
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

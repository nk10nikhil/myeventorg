"use client"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ArrowRight, Calendar, MapPin, Users, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutPage() {
    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-12 md:py-20 lg:py-28 bg-muted relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary),0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(var(--secondary),0.15),transparent_50%)]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="inline-block rounded-lg bg-muted-foreground/10 px-3 py-1 text-sm">
                                <span className="font-medium">About Us</span>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
                                    About TechFest 2025
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                                    Discover the story behind India's largest technology festival and our mission to inspire the next generation of innovators.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span className="text-sm">Since 2018</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span className="text-sm">Delhi, India</span>
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
                                    src="/event-hero.jpg"
                                    alt="TechFest Team"
                                    fill
                                    className="object-cover object-center animate-fade-in"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 mix-blend-overlay"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white/90 text-sm sm:text-base font-medium">Building the future through technology and innovation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="w-full py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/5 to-purple-600/5"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Our Story
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                From humble beginnings to India's premier tech event
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="space-y-5">
                            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/30 shadow-sm">
                                <h3 className="text-xl font-bold mb-3">How It All Started</h3>
                                <p className="text-muted-foreground">
                                    TechFest began in 2018 as a small gathering of tech enthusiasts in a university auditorium. Founded by a group of passionate developers who wanted to create a platform for knowledge sharing and networking, the first event attracted just 120 attendees but sparked tremendous enthusiasm.
                                </p>
                            </div>

                            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/30 shadow-sm">
                                <h3 className="text-xl font-bold mb-3">Growing Year by Year</h3>
                                <p className="text-muted-foreground">
                                    By 2020, TechFest had grown to over 1,000 attendees and featured speakers from major tech companies. Despite the challenges of the pandemic, we pivoted to a successful virtual format, expanding our reach globally. The 2022 hybrid event marked our return to in-person gatherings with over 3,000 participants.
                                </p>
                            </div>

                            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/30 shadow-sm">
                                <h3 className="text-xl font-bold mb-3">TechFest Today</h3>
                                <p className="text-muted-foreground">
                                    Now in 2025, TechFest has evolved into India's largest technology festival, attracting over 5,000 attendees, 100+ speakers, and partnerships with leading tech companies. Our comprehensive program of keynotes, workshops, hackathons, and networking sessions makes TechFest the most anticipated tech event in South Asia.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5] lg:aspect-square">
                                <Image
                                    src="/tech-event.jpg"
                                    alt="TechFest First Event"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white/90 text-xs">TechFest 2018</p>
                                </div>
                            </div>
                            <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5] lg:aspect-square">
                                <Image
                                    src="/placeholder.jpg"
                                    alt="TechFest Growth"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white/90 text-xs">TechFest 2022</p>
                                </div>
                            </div>
                            <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5] lg:aspect-square">
                                <Image
                                    src="/placeholder.jpg"
                                    alt="TechFest Virtual"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white/90 text-xs">Virtual TechFest 2020</p>
                                </div>
                            </div>
                            <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5] lg:aspect-square">
                                <Image
                                    src="/placeholder.jpg"
                                    alt="TechFest Today"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white/90 text-xs">TechFest 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.05),transparent_30%,transparent_70%,rgba(var(--secondary),0.05))]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Our Mission & Vision
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                What drives us and where we're headed
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-xl border border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                                    <path d="M12 2v2" />
                                    <path d="M12 22v-2" />
                                    <path d="m17 20.66-1-1.73" />
                                    <path d="M11 10.27 7 3.34" />
                                    <path d="m20.66 17-1.73-1" />
                                    <path d="m3.34 7 1.73 1" />
                                    <path d="M14 12h8" />
                                    <path d="M2 12h2" />
                                    <path d="m20.66 7-1.73 1" />
                                    <path d="m3.34 17 1.73-1" />
                                    <path d="m17 3.34-1 1.73" />
                                    <path d="m7 20.66 1-1.73" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-muted-foreground mb-6">
                                TechFest's mission is to democratize access to cutting-edge technology knowledge and create opportunities for innovation through collaborative learning. We aim to bridge the gap between industry experts and aspiring technologists, fostering a community that drives technological advancement and problem-solving.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Facilitate knowledge sharing across technological domains</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Nurture the next generation of tech leaders and innovators</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Create a diverse and inclusive tech community</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-xl border border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-muted-foreground mb-6">
                                We envision TechFest becoming the global epicenter for technological innovation and learning in the next decade. By 2030, we aim to expand our reach to over 50,000 participants annually across multiple countries, establishing TechFest as the most influential tech event in Asia.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Become Asia's premier platform for tech innovation showcase</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Drive industry transformation through idea exchange</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Foster technological solutions for global challenges</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="w-full py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Our Core Values
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                The principles that guide everything we do
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto grid max-w-6xl items-start gap-8 py-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                        {[
                            {
                                title: "Innovation",
                                description: "We embrace cutting-edge ideas and technologies, constantly pushing boundaries to showcase what's next in the tech world.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M12 2v8"></path>
                                        <path d="m4.93 10.93 1.41 1.41"></path>
                                        <path d="M2 18h2"></path>
                                        <path d="M20 18h2"></path>
                                        <path d="m19.07 10.93-1.41 1.41"></path>
                                        <path d="M22 22H2"></path>
                                        <path d="m16 6-4 4-4-4"></path>
                                        <path d="M16 18a4 4 0 0 0-8 0"></path>
                                    </svg>
                                )
                            },
                            {
                                title: "Inclusivity",
                                description: "We create a welcoming environment where people of all backgrounds and skill levels can learn, share, and grow together.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                )
                            },
                            {
                                title: "Quality",
                                description: "We strive for excellence in every aspect of TechFest, from speaker selection to workshop content to overall experience.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="m12 15 2 2 4-4"></path>
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                    </svg>
                                )
                            },
                            {
                                title: "Collaboration",
                                description: "We believe in the power of working together to solve problems and create opportunities across the tech ecosystem.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M17 5H7V8H17V5Z"></path>
                                        <path d="M7 11H17V14H7V11Z"></path>
                                        <path d="M7 17H17V20H7V17Z"></path>
                                        <path d="M4 5C4 5.55228 3.55228 6 3 6C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4C3.55228 4 4 4.44772 4 5Z"></path>
                                        <path d="M4 12C4 12.5523 3.55228 13 3 13C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11C3.55228 11 4 11.4477 4 12Z"></path>
                                        <path d="M4 19C4 19.5523 3.55228 20 3 20C2.44772 20 2 19.5523 2 19C2 18.4477 2.44772 18 3 18C3.55228 18 4 18.4477 4 19Z"></path>
                                        <path d="M20 19C20 19.5523 20.4477 20 21 20C21.5523 20 22 19.5523 22 19C22 18.4477 21.5523 18 21 18C20.4477 18 20 18.4477 20 19Z"></path>
                                        <path d="M20 12C20 12.5523 20.4477 13 21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11C20.4477 11 20 11.4477 20 12Z"></path>
                                        <path d="M20 5C20 5.55228 20.4477 6 21 6C21.5523 6 22 5.55228 22 5C22 4.44772 21.5523 4 21 4C20.4477 4 20 4.44772 20 5Z"></path>
                                    </svg>
                                )
                            },
                            {
                                title: "Education",
                                description: "We are committed to fostering learning and skill development for attendees at all career stages.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="m2 8 10-5 10 5-10 5Z"></path>
                                        <path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"></path>
                                        <path d="M14 22v-4a2 2 0 1 0-4 0v4"></path>
                                    </svg>
                                )
                            },
                            {
                                title: "Sustainability",
                                description: "We're committed to reducing our environmental impact and promoting sustainable technologies and practices.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M2 22c1.25-1.67 2.04-3.92 2.5-6.5"></path>
                                        <path d="M14 22c-1.25-1.67-2.04-3.92-2.5-6.5"></path>
                                        <path d="M8 22c.92-1.67 1.68-3.92 2-6.5"></path>
                                        <path d="M20 8.54l-7.23 3.8a1 1 0 0 1-1.47-.8V1.5"></path>
                                        <path d="M7 10.54l7.23 3.8a1 1 0 0 0 1.47-.8V3.5"></path>
                                    </svg>
                                )
                            }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-start space-y-3 rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {value.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">{value.title}</h3>
                                    <p className="text-muted-foreground">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Team Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(var(--primary),0.02),transparent_30%,transparent_70%,rgba(var(--secondary),0.02))]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Our Leadership Team
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Meet the passionate individuals behind TechFest
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-6">
                        {[
                            {
                                name: "Vikram Mehta",
                                role: "Founder & CEO",
                                bio: "Tech entrepreneur with 15+ years of experience in building successful startups.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Neha Sharma",
                                role: "Chief Operating Officer",
                                bio: "Former Google executive with expertise in scaling tech events and operations.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Arjun Patel",
                                role: "Chief Technology Officer",
                                bio: "Full-stack developer and tech evangelist passionate about emerging technologies.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Priya Singh",
                                role: "Head of Partnerships",
                                bio: "Relationship builder with a track record of securing strategic tech partnerships.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Raj Kumar",
                                role: "Marketing Director",
                                bio: "Digital marketing expert specialized in growing tech events and communities.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Ananya Desai",
                                role: "Program Director",
                                bio: "Former tech conference organizer with expertise in curating compelling content.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Kiran Reddy",
                                role: "Community Manager",
                                bio: "Community builder passionate about fostering inclusive tech ecosystems.",
                                image: "/placeholder-user.jpg"
                            },
                            {
                                name: "Sanjay Joshi",
                                role: "Head of Innovation",
                                bio: "Product designer and innovation specialist driving TechFest's creative initiatives.",
                                image: "/placeholder-user.jpg"
                            }
                        ].map((member, index) => (
                            <div
                                key={index}
                                className="group flex flex-col items-center space-y-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/40 group-hover:border-primary transition-all duration-300 shadow-md">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-all duration-500"
                                    />
                                </div>
                                <div className="space-y-1 text-center">
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                                    <p className="text-sm text-primary/80 font-medium">{member.role}</p>
                                </div>
                                <p className="text-sm text-center text-muted-foreground">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sponsors & Partners Section */}
            <section className="w-full py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Our Sponsors & Partners
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                TechFest is made possible by the support of these industry leaders
                            </p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-center">Platinum Sponsors</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
                                {["placeholder-logo.svg", "placeholder-logo.svg", "placeholder-logo.svg", "placeholder-logo.svg"].map((logo, index) => (
                                    <div key={index} className="bg-background/80 rounded-xl shadow-sm border border-border/40 hover:border-primary/20 p-6 w-full max-w-[180px] h-[100px] flex items-center justify-center transition-all duration-300 hover:shadow-md">
                                        <Image
                                            src={`/${logo}`}
                                            alt={`Platinum Sponsor ${index + 1}`}
                                            width={120}
                                            height={60}
                                            className="object-contain max-h-[60px] opacity-80 hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-center">Gold Sponsors</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 items-center justify-items-center">
                                {["placeholder-logo.svg", "placeholder-logo.svg", "placeholder-logo.svg", "placeholder-logo.svg", "placeholder-logo.svg"].map((logo, index) => (
                                    <div key={index} className="bg-background/80 rounded-xl shadow-sm border border-border/40 hover:border-primary/20 p-4 w-full max-w-[150px] h-[80px] flex items-center justify-center transition-all duration-300">
                                        <Image
                                            src={`/${logo}`}
                                            alt={`Gold Sponsor ${index + 1}`}
                                            width={100}
                                            height={50}
                                            className="object-contain max-h-[50px] opacity-80 hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-center">Partners</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center justify-items-center">
                                {Array(6).fill("placeholder-logo.svg").map((logo, index) => (
                                    <div key={index} className="bg-background/80 rounded-xl shadow-sm border border-border/40 hover:border-primary/20 p-3 w-full max-w-[120px] h-[70px] flex items-center justify-center transition-all duration-300">
                                        <Image
                                            src={`/${logo}`}
                                            alt={`Partner ${index + 1}`}
                                            width={80}
                                            height={40}
                                            className="object-contain max-h-[40px] opacity-70 hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <Link href="/sponsors">
                                <Button variant="outline" className="gap-2 group">
                                    Become a Sponsor
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.05),transparent_30%,transparent_70%,rgba(var(--secondary),0.05))]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                What Attendees Say
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Experiences shared by our previous TechFest participants
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                name: "Ankit Sharma",
                                title: "Software Engineer @ Amazon",
                                quote: "TechFest was a game-changer for my career. The workshops helped me level up my skills, and I made connections that led to my current job at Amazon.",
                                avatar: "/testimonials/placeholder.jpg",
                                year: "TechFest 2023"
                            },
                            {
                                name: "Priya Patel",
                                title: "Startup Founder",
                                quote: "As a founder, TechFest gave me the platform to showcase my startup to investors and potential customers. We secured our seed funding after the pitch competition!",
                                avatar: "/testimonials/placeholder.jpg",
                                year: "TechFest 2022"
                            },
                            {
                                name: "Rahul Verma",
                                title: "AI Researcher",
                                quote: "The networking opportunities at TechFest are unmatched. I connected with peers in the AI research community and formed collaborations that resulted in two published papers.",
                                avatar: "/testimonials/placeholder.jpg",
                                year: "TechFest 2023"
                            },
                            {
                                name: "Meera Iyer",
                                title: "Product Manager @ Microsoft",
                                quote: "The quality of speakers and content was exceptional. I gained insights into product management best practices that I've since implemented in my team with great results.",
                                avatar: "/testimonials/placeholder.jpg",
                                year: "TechFest 2022"
                            },
                            {
                                name: "Vikrant Desai",
                                title: "Tech Entrepreneur",
                                quote: "As someone launching a tech startup, TechFest provided the perfect platform to validate our idea and get feedback from industry experts. Invaluable experience!",
                                avatar: "/testimonials/placeholder.jpg",
                                year: "TechFest 2023"
                            },
                            {
                                name: "Shreya Gupta",
                                title: "UX Designer",
                                quote: "The design workshops at TechFest were cutting-edge and hands-on. I left with practical skills that immediately improved my work and impressed my clients.",
                                avatar: "/testimonials/placeholder.jpg",
                                year: "TechFest 2023"
                            }
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="flex flex-col space-y-4 rounded-xl p-6 border border-border/40 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{testimonial.name}</h3>
                                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="absolute -top-2 -left-2 h-6 w-6 text-primary/40"
                                        >
                                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                                            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                                        </svg>
                                        <p className="text-muted-foreground pl-4">
                                            "{testimonial.quote}"
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-primary">{testimonial.year}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <Link href="/testimonials">
                            <Button variant="outline" className="gap-2 group">
                                View More Testimonials
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--secondary),0.05),transparent_70%)]"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                        <div className="space-y-2 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Find answers to common questions about TechFest 2025
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <Accordion type="single" collapsible className="w-full">
                            {[
                                {
                                    question: "When and where is TechFest 2025 taking place?",
                                    answer: "TechFest 2025 will be held on July 15, 2025, at the Delhi International Convention Center in New Delhi, India. The event will run from 9:00 AM to 6:00 PM."
                                },
                                {
                                    question: "How can I register for TechFest 2025?",
                                    answer: "You can register through our website by visiting the Registration page. Early bird registration is open until March 1, 2025, with discounted rates. We offer individual tickets, group packages, and student discounts."
                                },
                                {
                                    question: "What topics will be covered at TechFest 2025?",
                                    answer: "TechFest 2025 will feature sessions on artificial intelligence, blockchain, cloud computing, cybersecurity, data science, IoT, mobile development, product management, UX/UI design, and emerging technologies. Our full agenda will be published two months before the event."
                                },
                                {
                                    question: "Are there opportunities for networking at TechFest?",
                                    answer: "Absolutely! TechFest includes dedicated networking sessions, an expo area, roundtable discussions, a hackathon, and social events. Our mobile app will also help you connect with other attendees based on shared interests."
                                },
                                {
                                    question: "Can I become a speaker or presenter at TechFest 2025?",
                                    answer: "Yes, we welcome speaker applications! Our call for proposals (CFP) is open until January 15, 2025. Visit our 'Become a Speaker' page to submit your proposal and learn about our selection criteria."
                                },
                                {
                                    question: "Are there sponsorship opportunities available?",
                                    answer: "We offer various sponsorship packages for companies interested in gaining visibility at TechFest. These range from booth space to speaking slots to branded experiences. Please contact our partnerships team at partnerships@techfest2025.com for details."
                                },
                                {
                                    question: "Is there accommodation available for out-of-town attendees?",
                                    answer: "We've partnered with several hotels near the venue offering special rates for TechFest attendees. Booking information will be provided upon registration. Early booking is recommended as availability is limited."
                                },
                                {
                                    question: "What COVID-19 safety measures will be in place?",
                                    answer: "TechFest 2025 will follow all local health guidelines in effect at the time of the event. This may include vaccination requirements, testing protocols, or mask mandates. We will communicate all safety measures to attendees before the event."
                                }
                            ].map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/40">
                                    <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors duration-200">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="text-center mt-8">
                            <p className="text-muted-foreground">
                                Still have questions? Contact us at{" "}
                                <a href="mailto:info@techfest2025.com" className="text-primary hover:underline">
                                    info@techfest2025.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-16 md:py-24 relative overflow-hidden bg-primary/5">
                <div className="absolute inset-0 -z-10 bg-[url('/tech-event.jpg')] bg-cover bg-fixed bg-center opacity-5"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="mx-auto max-w-3xl text-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Join Us at TechFest 2025
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Be part of India's biggest tech event and help shape the future of technology
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="gap-2 group">
                                    Register Now
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/sponsors">
                                <Button size="lg" variant="outline" className="gap-2 group">
                                    Become a Sponsor
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>July 15, 2025</span>
                            <span className="text-muted-foreground">•</span>
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Delhi International Convention Center</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
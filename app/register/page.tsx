"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import Link from "next/link"
import {
  Ticket,
  CalendarDays,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Redirect to payment page with order ID
      router.push(`/payment?orderId=${data.orderId}`)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section with Gradient Background */}
      <div className="hero-gradient py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <Link href="/">
              <Image
                src="/techfest-logo.svg"
                alt="TechFest 2025"
                width={80}
                height={80}
                className="h-16 w-16 mb-2 animate-bounce-in"
              />
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight animate-fade-in">
              Register for TechFest 2025
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-[700px] animate-fade-in">
              Join us for the most exciting tech event of the year with renowned speakers,
              workshops, and networking opportunities.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Registration Form */}
          <Card className="w-full shadow-lg animate-slide-in-left">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Event Registration</CardTitle>
              <CardDescription>
                Enter your details below to register for TechFest 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                        </FormControl>
                        <FormDescription>
                          We&apos;ll send your ticket to this email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="7777***666" {...field} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                        </FormControl>
                        <FormDescription>
                          For verification and event updates via SMS
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full gradient-btn mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Register Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Ticket className="h-4 w-4" />
                Registration fee: ₹999 (including taxes)
              </p>
            </CardFooter>
          </Card>

          {/* Event Details */}
          <div className="space-y-6 animate-slide-in-right">
            <Card className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src="/tech-event.jpg"
                  alt="TechFest 2025 venue"
                  className="object-cover"
                  fill
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Date & Time</h4>
                      <p className="text-sm text-muted-foreground">June 15-18, 2025 | 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Venue</h4>
                      <p className="text-sm text-muted-foreground">International Convention Center, Mumbai</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Attendees</h4>
                      <p className="text-sm text-muted-foreground">Limited to 1,000 participants</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Attend TechFest 2025?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Networking Opportunities</h4>
                    <p className="text-sm text-muted-foreground">Connect with industry leaders and tech enthusiasts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Workshops & Hands-on Labs</h4>
                    <p className="text-sm text-muted-foreground">Learn new skills with practical, guided sessions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Inspiring Speakers</h4>
                    <p className="text-sm text-muted-foreground">Hear from renowned technology leaders and innovators.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Early Access to New Tech</h4>
                    <p className="text-sm text-muted-foreground">Preview cutting-edge products and technologies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-bold">Limited Time Offer</h3>
                  </div>
                  <span className="text-sm bg-primary-foreground text-primary px-2 py-1 rounded-full font-medium">20% OFF</span>
                </div>
                <p className="mt-2 text-sm opacity-90">Early bird registrations closing in 7 days. Register now to avail the special discount!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

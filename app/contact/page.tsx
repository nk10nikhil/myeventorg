import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | TechFest 2025',
    description: 'Get in touch with the TechFest 2025 team for any queries or support',
};

export default function ContactsPage() {
    return (
        <div className="container mx-auto py-16 px-4 md:px-6">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Contact Us
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Have questions about TechFest 2025? We're here to help! Reach out to our team for any inquiries.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <Input id="name" placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input id="email" type="email" placeholder="Your email" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                                Subject
                            </label>
                            <Input id="subject" placeholder="What is this regarding?" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                Message
                            </label>
                            <Textarea
                                id="message"
                                placeholder="Your message"
                                rows={5}
                            />
                        </div>
                        <Button type="submit" className="w-full md:w-auto">
                            Send Message
                        </Button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Mail className="h-6 w-6" />
                                <CardTitle className="text-xl">Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    <a href="mailto:nk10nikhil@gmail.com" className="hover:underline">
                                        nk10nikhil@gmail.com
                                    </a>
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Phone className="h-6 w-6" />
                                <CardTitle className="text-xl">Phone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    <a href="tel:+917777048666" className="hover:underline">
                                        +91 7777048666
                                    </a>
                                </p>

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <MapPin className="h-6 w-6" />
                                <CardTitle className="text-xl">Venue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Galgotias College<br />
                                    Knowledge Park II<br />
                                    Greater Noida, 201310<br />
                                    UP, India
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 h-80 overflow-hidden rounded-lg border">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.7510465684927!2d77.49684438896342!3d28.456920153847165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea1a83be5989%3A0x6a3690bfa642b5c3!2sGalgotias%20College!5e0!3m2!1sen!2sin!4v1746768899421!5m2!1sen!2sin" width="100%" height="100%"   loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>

            <div className="mt-20 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>How can I register for TechFest 2025?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                You can register for TechFest 2025 through our website's registration page. Simply fill out the required information and complete the payment process.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Are there any group discounts available?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Yes, we offer special discounts for groups of 5 or more participants. Please contact our support team for more information about group registrations.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Can I get a refund if I can't attend?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Refunds are available up to 30 days before the event with a 15% processing fee. After that, we can transfer your registration to someone else or offer credit for next year's event.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Will the sessions be recorded?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Yes, all sessions will be recorded and made available to registered participants after the event. You'll receive access to the recordings within a week of the event's conclusion.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { Metadata } from "next";
import Link from "next/link";
import SpeakerImage from "@/components/speaker-image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
    title: 'Speakers | TechFest 2025',
    description: 'Meet our industry-leading speakers and experts at TechFest 2025',
};

export default function SpeakersPage() {
    return (
        <div className="container mx-auto py-16 px-4 md:px-6">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Our Speakers
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Learn from industry leaders, innovators, and technology experts at TechFest 2025.
                </p>
            </div>

            <Tabs defaultValue="keynote" className="max-w-5xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="keynote">Keynote Speakers</TabsTrigger>
                    <TabsTrigger value="tech">Technical Experts</TabsTrigger>
                    <TabsTrigger value="panel">Panel Moderators</TabsTrigger>
                    <TabsTrigger value="workshop">Workshop Leaders</TabsTrigger>
                </TabsList>

                <TabsContent value="keynote" className="space-y-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/aishwarya-patel.jpg"
                                    alt="Aishwarya Patel"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Aishwarya Patel</CardTitle>
                                    <Badge variant="secondary">Day 1</Badge>
                                </div>
                                <CardDescription>CTO at FutureTech</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Pioneer in AI and distributed systems with over 15 years of experience building scalable technology products. Previously led engineering teams at Google and Meta.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">AI</Badge>
                                    <Badge className="mr-2">Future Tech</Badge>
                                    <Badge>Leadership</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/rajiv-mehta.jpg"
                                    alt="Rajiv Mehta"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Rajiv Mehta</CardTitle>
                                    <Badge variant="secondary">Day 2</Badge>
                                </div>
                                <CardDescription>Blockchain Architect</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Leading authority on Web3 technologies and decentralized applications. Founded two successful blockchain startups and authored "The Decentralized Future" guidebook.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Web3</Badge>
                                    <Badge className="mr-2">Blockchain</Badge>
                                    <Badge>DApps</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/maya-patel.jpg"
                                    alt="Maya Patel"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Maya Patel</CardTitle>
                                    <Badge variant="secondary">Day 3</Badge>
                                </div>
                                <CardDescription>Sustainability Expert</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Combining technology with sustainable practices, Maya has advised Fortune 500 companies on reducing their carbon footprint while leveraging technology for environmental monitoring.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Sustainability</Badge>
                                    <Badge className="mr-2">Climate Tech</Badge>
                                    <Badge>Green IT</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/ravi-sharma.jpg"
                                    alt="Ravi Sharma"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Ravi Sharma</CardTitle>
                                    <Badge variant="secondary">Day 3</Badge>
                                </div>
                                <CardDescription>Serial Entrepreneur</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Founded five successful technology startups, with two acquisitions by industry giants. Passionate about mentoring the next generation of tech entrepreneurs.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Entrepreneurship</Badge>
                                    <Badge className="mr-2">Innovation</Badge>
                                    <Badge>Venture Capital</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tech" className="space-y-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/neha-gupta.jpg"
                                    alt="Neha Gupta"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Neha Gupta</CardTitle>
                                    <Badge variant="outline">Day 2</Badge>
                                </div>
                                <CardDescription>Senior Frontend Engineer</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Frontend architecture specialist with a focus on React performance optimization and state management. Core contributor to several open source projects.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">React</Badge>
                                    <Badge className="mr-2">Frontend</Badge>
                                    <Badge>Performance</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/dr-sanjay-kumar.jpg"
                                    alt="Dr. Sanjay Kumar"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Dr. Sanjay Kumar</CardTitle>
                                    <Badge variant="outline">Day 3</Badge>
                                </div>
                                <CardDescription>Quantum Researcher</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Leading quantum computing research at the intersection of theoretical physics and practical applications. Ph.D. from MIT with post-doctoral research at CERN.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Quantum Computing</Badge>
                                    <Badge className="mr-2">Physics</Badge>
                                    <Badge>Algorithms</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/dr-anand-krishnan.jpg"
                                    alt="Dr. Anand Krishnan"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Dr. Anand Krishnan</CardTitle>
                                    <Badge variant="outline">Day 2</Badge>
                                </div>
                                <CardDescription>ML Engineer</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Specialized in deploying machine learning models at scale. Previously worked on recommendation systems at Netflix and autonomous systems at Tesla.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Machine Learning</Badge>
                                    <Badge className="mr-2">MLOps</Badge>
                                    <Badge>Deep Learning</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="panel" className="space-y-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/dr-rajan-kapoor.jpg"
                                    alt="Dr. Rajan Kapoor"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Dr. Rajan Kapoor</CardTitle>
                                    <Badge>Day 1</Badge>
                                </div>
                                <CardDescription>AI Ethicist & Researcher</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Expert on ethical implications of artificial intelligence and author of "AI Ethics in Practice." Leading the panel on "AI Revolution: Opportunities and Challenges."</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">AI Ethics</Badge>
                                    <Badge className="mr-2">Policy</Badge>
                                    <Badge>Research</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/sunita-reddy.jpg"
                                    alt="Sunita Reddy"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Sunita Reddy</CardTitle>
                                    <Badge>Day 2</Badge>
                                </div>
                                <CardDescription>VP Engineering</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>20+ years experience in engineering leadership at scale. Known for transforming engineering cultures and building diverse tech teams. Moderating the panel on "Tech Leadership."</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Leadership</Badge>
                                    <Badge className="mr-2">Engineering</Badge>
                                    <Badge>Diversity</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="workshop" className="space-y-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/vikram-singh.jpg"
                                    alt="Vikram Singh"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Vikram Singh</CardTitle>
                                    <Badge variant="destructive">Day 1</Badge>
                                </div>
                                <CardDescription>Lead DevOps Engineer</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Kubernetes and cloud-native infrastructure expert. Created popular open-source tools for cloud deployments. Leading the "Hands-on Cloud Native Development" workshop.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">DevOps</Badge>
                                    <Badge className="mr-2">Kubernetes</Badge>
                                    <Badge>Cloud</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/priya-sharma.jpg"
                                    alt="Priya Sharma"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Priya Sharma</CardTitle>
                                    <Badge variant="destructive">Day 1</Badge>
                                </div>
                                <CardDescription>Security Expert</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Cybersecurity consultant specializing in application security. Former white-hat hacker who has helped secure systems for financial institutions worldwide.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Security</Badge>
                                    <Badge className="mr-2">Cybersecurity</Badge>
                                    <Badge>Pentesting</Badge>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="overflow-hidden flex flex-col">
                            <div className="relative h-[240px] w-full">
                                <SpeakerImage
                                    src="/speakers/arjun-malhotra.jpg"
                                    alt="Arjun Malhotra"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Arjun Malhotra</CardTitle>
                                    <Badge variant="destructive">Day 3</Badge>
                                </div>
                                <CardDescription>Product Architect</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>Expert in rapid application development and low-code platforms. Has built over 50 enterprise applications across industries using innovative approaches.</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-4">
                                <div>
                                    <Badge className="mr-2">Low-Code</Badge>
                                    <Badge className="mr-2">Rapid Development</Badge>
                                    <Badge>UX</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold mb-6">Become a Speaker</h2>
                <p className="max-w-2xl mx-auto mb-8">
                    Are you an expert in your field with insights to share? We're always looking for diverse voices and fresh perspectives for our events.
                </p>
                <a href="#" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium inline-block hover:bg-primary/90 transition-colors">
                    Apply to Speak
                </a>
            </div>

            <div className="mt-16 text-center bg-muted p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Download Speaker Profiles</h2>
                <p className="max-w-2xl mx-auto mb-6">
                    Get detailed speaker biographies, session information, and contact details for networking purposes.
                </p>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                    Download PDF
                </button>
            </div>
        </div>
    );
}
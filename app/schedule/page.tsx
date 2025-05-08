import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const metadata = {
    title: 'Schedule | TechFest 2025',
    description: 'Schedule of sessions, workshops, and activities for TechFest 2025',
};

export default function SchedulePage() {
    return (
        <div className="container mx-auto py-16 px-4 md:px-6">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Event Schedule
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Plan your TechFest experience. All sessions, workshops, and networking events in one place.
                </p>
            </div>

            <Tabs defaultValue="day1" className="max-w-5xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="day1">Day 1 - May 25</TabsTrigger>
                    <TabsTrigger value="day2">Day 2 - May 26</TabsTrigger>
                    <TabsTrigger value="day3">Day 3 - May 27</TabsTrigger>
                </TabsList>

                <TabsContent value="day1" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Opening Day - Innovation & Trends</h2>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>8:00 AM - 9:30 AM</span>
                                <Badge>Registration & Breakfast</Badge>
                            </CardTitle>
                            <CardDescription>Main Hall</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Registration opens. Welcome kits and badges distribution. Networking breakfast.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>10:00 AM - 11:00 AM</span>
                                <Badge variant="secondary">Keynote</Badge>
                            </CardTitle>
                            <CardDescription>Main Stage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Opening Keynote: The Future of Technology</h3>
                            <p className="mb-2">A visionary talk on upcoming tech trends and how they will shape our future.</p>
                            <p className="text-sm font-medium">Speaker: Aishwarya Patel, CTO at FutureTech</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>11:30 AM - 12:30 PM</span>
                                <Badge variant="outline">Panel Discussion</Badge>
                            </CardTitle>
                            <CardDescription>Innovation Theater</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">AI Revolution: Opportunities and Challenges</h3>
                            <p className="mb-2">Industry leaders discuss the impact of AI across different sectors.</p>
                            <p className="text-sm font-medium">Moderator: Dr. Rajan Kapoor</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>12:30 PM - 2:00 PM</span>
                                <Badge>Lunch Break</Badge>
                            </CardTitle>
                            <CardDescription>Dining Area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Networking lunch with exhibitors and speakers.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>2:00 PM - 3:30 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription>Tech Lab A</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Hands-on Cloud Native Development</h3>
                            <p className="mb-2">Practical workshop on microservices architecture and cloud deployment.</p>
                            <p className="text-sm font-medium">Instructor: Vikram Singh, Lead DevOps Engineer</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>4:00 PM - 5:30 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription>Tech Lab B</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Building Secure Applications</h3>
                            <p className="mb-2">Best practices for implementing security in your applications.</p>
                            <p className="text-sm font-medium">Instructor: Priya Sharma, Security Expert</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>6:00 PM - 8:00 PM</span>
                                <Badge variant="secondary">Networking</Badge>
                            </CardTitle>
                            <CardDescription>Terrace Garden</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Welcome Reception</h3>
                            <p>Evening networking event with refreshments and entertainment.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="day2" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Day 2 - Deep Dive & Skills</h2>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>9:00 AM - 10:00 AM</span>
                                <Badge variant="secondary">Keynote</Badge>
                            </CardTitle>
                            <CardDescription>Main Stage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Web3 and the Decentralized Future</h3>
                            <p className="mb-2">Exploring the potential of blockchain and decentralized applications.</p>
                            <p className="text-sm font-medium">Speaker: Rajiv Mehta, Blockchain Architect</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>10:30 AM - 12:00 PM</span>
                                <Badge variant="outline">Technical Session</Badge>
                            </CardTitle>
                            <CardDescription>Developer Zone</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Advanced React Patterns</h3>
                            <p className="mb-2">Optimizing performance and maintainability in large React applications.</p>
                            <p className="text-sm font-medium">Speaker: Neha Gupta, Senior Frontend Engineer</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>12:00 PM - 1:30 PM</span>
                                <Badge>Lunch Break</Badge>
                            </CardTitle>
                            <CardDescription>Dining Area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Themed lunch with topic-based tables for focused discussions.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>1:30 PM - 3:00 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription>Tech Lab A</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Machine Learning in Production</h3>
                            <p className="mb-2">Deploying and scaling ML models in production environments.</p>
                            <p className="text-sm font-medium">Instructor: Dr. Anand Krishnan, ML Engineer</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>3:30 PM - 5:00 PM</span>
                                <Badge variant="outline">Panel Discussion</Badge>
                            </CardTitle>
                            <CardDescription>Innovation Theater</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Tech Leadership: Building High-Performance Teams</h3>
                            <p className="mb-2">CTOs and Engineering Managers share insights on tech leadership.</p>
                            <p className="text-sm font-medium">Moderator: Sunita Reddy, VP Engineering</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>5:30 PM - 7:30 PM</span>
                                <Badge variant="secondary">Hackathon</Badge>
                            </CardTitle>
                            <CardDescription>Collaboration Space</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Mini-Hackathon Kickoff</h3>
                            <p>Form teams and start working on 24-hour innovation challenges.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="day3" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Final Day - Future & Connections</h2>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>9:00 AM - 10:00 AM</span>
                                <Badge variant="secondary">Keynote</Badge>
                            </CardTitle>
                            <CardDescription>Main Stage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Sustainable Technology for a Better Future</h3>
                            <p className="mb-2">How tech can help address climate change and sustainability challenges.</p>
                            <p className="text-sm font-medium">Speaker: Maya Patel, Sustainability Expert</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>10:30 AM - 12:00 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription>Tech Lab B</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Low-Code Development for Rapid Prototyping</h3>
                            <p className="mb-2">Using modern tools to accelerate application development.</p>
                            <p className="text-sm font-medium">Instructor: Arjun Malhotra, Product Architect</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>12:00 PM - 1:30 PM</span>
                                <Badge>Lunch Break</Badge>
                            </CardTitle>
                            <CardDescription>Dining Area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Final networking lunch with special dessert bar.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>1:30 PM - 3:00 PM</span>
                                <Badge variant="secondary">Hackathon</Badge>
                            </CardTitle>
                            <CardDescription>Main Stage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Hackathon Presentations & Awards</h3>
                            <p>Teams present their solutions followed by judges' feedback and awards ceremony.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>3:30 PM - 4:30 PM</span>
                                <Badge variant="outline">Technical Session</Badge>
                            </CardTitle>
                            <CardDescription>Developer Zone</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Quantum Computing: The Next Frontier</h3>
                            <p className="mb-2">Introduction to quantum computing concepts and their potential applications.</p>
                            <p className="text-sm font-medium">Speaker: Dr. Sanjay Kumar, Quantum Researcher</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>5:00 PM - 6:30 PM</span>
                                <Badge variant="secondary">Closing Keynote</Badge>
                            </CardTitle>
                            <CardDescription>Main Stage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">Transforming Ideas into Impact</h3>
                            <p className="mb-2">Inspirational talk on taking innovations from concept to global impact.</p>
                            <p className="text-sm font-medium">Speaker: Ravi Sharma, Serial Entrepreneur</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>7:00 PM - 10:00 PM</span>
                                <Badge>Closing Party</Badge>
                            </CardTitle>
                            <CardDescription>Terrace Garden</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mb-2">TechFest Celebration</h3>
                            <p>Farewell dinner, music, and celebration to conclude the event.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Event Venues</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                    <Card>
                        <CardHeader>
                            <CardTitle>Main Stage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Located in the Grand Ballroom, Level 1. Capacity: 800 people. All keynotes and major presentations.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tech Labs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Tech Lab A & B are on Level 2. Each equipped with workstations for hands-on workshops. Capacity: 100 people each.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Innovation Theater</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Located on Level 2. An intimate space for panel discussions and specialized talks. Capacity: 200 people.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-16 text-center bg-muted p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Download the TechFest App</h2>
                <p className="max-w-2xl mx-auto mb-6">
                    Get the most out of your TechFest experience with our mobile app. Access real-time schedule updates, speaker info, networking features, and more.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium">
                        App Store
                    </button>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium">
                        Google Play
                    </button>
                </div>
            </div>
        </div>
    );
}
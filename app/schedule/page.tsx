import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

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

            <div className="mb-10 flex justify-center space-x-4">
                <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Add to Calendar
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Filter by Track
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    View Venue Map
                </Button>
            </div>

            <Tabs defaultValue="day1" className="max-w-5xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="day1">Day 1 - July 15</TabsTrigger>
                    <TabsTrigger value="day2">Day 2 - July 16</TabsTrigger>
                    <TabsTrigger value="day3">Day 3 - July 17</TabsTrigger>
                </TabsList>

                <TabsContent value="day1" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Opening Day - Innovation & Trends</h2>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>8:00 AM - 9:30 AM</span>
                                <Badge>Registration & Breakfast</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Hall
                            </CardDescription>
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
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Stage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">The Future of Technology: Trends Shaping Our Digital Landscape</p>
                            <p>Opening keynote by Aishwarya Patel, CTO of FutureTech, exploring the most significant technological trends that will reshape industries in the next decade.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>60 minutes</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>11:15 AM - 12:30 PM</span>
                                <Badge variant="outline">Panel Discussion</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Hall A
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">AI Revolution: Opportunities and Challenges</p>
                            <p>Industry experts discuss the current state of AI, ethical considerations, and what the future holds. Moderated by Dr. Rajan Kapoor.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>75 minutes</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>12:30 PM - 2:00 PM</span>
                                <Badge>Lunch Break</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Food Court
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Networking lunch with themed tables for different industries and interests. Special dietary options available.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>2:00 PM - 4:00 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Tech Lab 1
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Hands-on Cloud Native Development</p>
                            <p>Learn practical Kubernetes and container orchestration with Vikram Singh, Lead DevOps Engineer. Bring your laptop for this hands-on session.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">Limited to 50 participants</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>120 minutes</span>
                            </div>
                            <div className="mt-3">
                                <Badge className="mr-2 bg-blue-100 text-blue-800">DevOps Track</Badge>
                                <Badge className="bg-blue-100 text-blue-800">Pre-registration Required</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>4:30 PM - 6:00 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Security Lab
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Practical Application Security</p>
                            <p>Learn how to identify and fix common security vulnerabilities with Priya Sharma, Security Expert. Live demo of penetration testing techniques.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">Limited to 40 participants</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>90 minutes</span>
                            </div>
                            <div className="mt-3">
                                <Badge className="mr-2 bg-red-100 text-red-800">Security Track</Badge>
                                <Badge className="bg-blue-100 text-blue-800">Pre-registration Required</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>7:00 PM - 10:00 PM</span>
                                <Badge>Networking Event</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Rooftop Garden
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Welcome reception with food, drinks, and entertainment. Great opportunity to connect with speakers and fellow attendees in a relaxed environment.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="day2" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Day 2 - Deep Dives & Skill Building</h2>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>9:00 AM - 10:00 AM</span>
                                <Badge>Breakfast & Networking</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Hall
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Day 2 kickoff with continental breakfast and themed networking tables.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>10:00 AM - 11:00 AM</span>
                                <Badge variant="secondary">Keynote</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Stage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Building the Decentralized Future</p>
                            <p>Rajiv Mehta shares insights on the evolution of Web3 technologies and how decentralization is reshaping digital ownership and governance.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>60 minutes</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>11:15 AM - 12:30 PM</span>
                                <Badge variant="outline">Parallel Sessions</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-md">
                                    <p className="font-medium">React Performance Optimization</p>
                                    <p className="text-sm text-muted-foreground mb-2">Neha Gupta - Hall A</p>
                                    <p className="text-sm">Advanced techniques to optimize React applications for speed and user experience.</p>
                                    <Badge className="mt-2 bg-green-100 text-green-800">Frontend Track</Badge>
                                </div>
                                <div className="p-4 border rounded-md">
                                    <p className="font-medium">ML at Scale: From POC to Production</p>
                                    <p className="text-sm text-muted-foreground mb-2">Dr. Anand Krishnan - Hall B</p>
                                    <p className="text-sm">Practical strategies for deploying machine learning models at scale.</p>
                                    <Badge className="mt-2 bg-purple-100 text-purple-800">Data Science Track</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>12:30 PM - 2:00 PM</span>
                                <Badge>Lunch Break</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Food Court
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Lunch with special guest tables hosted by speakers and industry experts.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>2:00 PM - 3:30 PM</span>
                                <Badge variant="outline">Panel Discussion</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Stage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Tech Leadership: Building High-Performing Teams</p>
                            <p>Industry leaders discuss strategies for technical leadership, team building, and fostering innovation. Moderated by Sunita Reddy.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>90 minutes</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>4:00 PM - 6:00 PM</span>
                                <Badge variant="outline">Parallel Sessions</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-md">
                                    <p className="font-medium">Quantum Computing: Present and Future</p>
                                    <p className="text-sm text-muted-foreground mb-2">Dr. Sanjay Kumar - Hall A</p>
                                    <p className="text-sm">Understanding quantum computing fundamentals and practical applications on the horizon.</p>
                                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">Emerging Tech Track</Badge>
                                </div>
                                <div className="p-4 border rounded-md">
                                    <p className="font-medium">Building Sustainable Tech</p>
                                    <p className="text-sm text-muted-foreground mb-2">Maya Patel - Hall B</p>
                                    <p className="text-sm">Strategies for reducing carbon footprint in software development and IT operations.</p>
                                    <Badge className="mt-2 bg-green-100 text-green-800">Sustainability Track</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>7:00 PM - 10:00 PM</span>
                                <Badge>Startup Showcase</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Exhibition Hall
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>30 innovative startups showcase their products and services. Includes pitch competition and networking with investors.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="day3" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Final Day - Future Perspectives & Implementation</h2>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>9:00 AM - 10:00 AM</span>
                                <Badge>Breakfast & Networking</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Hall
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Final day kickoff with breakfast and reflection tables on key learnings from the previous days.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>10:00 AM - 11:00 AM</span>
                                <Badge variant="secondary">Keynote</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Stage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Technology for a Sustainable Future</p>
                            <p>Maya Patel explores how technology can be a powerful force for environmental sustainability and addressing climate change.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>60 minutes</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>11:15 AM - 12:30 PM</span>
                                <Badge variant="destructive">Workshop</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Tech Lab 2
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Rapid Application Development with Low-Code</p>
                            <p>Arjun Malhotra demonstrates how to build enterprise-grade applications in record time using low-code platforms.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">Limited to 40 participants</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>75 minutes</span>
                            </div>
                            <div className="mt-3">
                                <Badge className="mr-2 bg-blue-100 text-blue-800">Development Track</Badge>
                                <Badge className="bg-blue-100 text-blue-800">Pre-registration Required</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>12:30 PM - 2:00 PM</span>
                                <Badge>Lunch Break</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Food Court
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Final networking lunch with wrap-up discussions.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>2:00 PM - 3:30 PM</span>
                                <Badge variant="outline">Fireside Chat</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Stage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">From Startup to Success: The Entrepreneurial Journey</p>
                            <p>Ravi Sharma shares his journey of building multiple successful technology ventures, with insights on navigating challenges and scaling products.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>90 minutes</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>4:00 PM - 5:30 PM</span>
                                <Badge variant="outline">Closing Session</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Main Stage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">Future Forward: Key Takeaways and Next Steps</p>
                            <p>Conference summary, key insights from all tracks, and announcement of next year's event. Includes audience Q&A and final networking opportunity.</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4 mr-1" /> <span className="mr-4">All Attendees</span>
                                <Clock className="h-4 w-4 mr-1" /> <span>90 minutes</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold mb-6">Need Help Planning Your Schedule?</h2>
                <p className="max-w-2xl mx-auto mb-8">
                    Use our Schedule Builder tool to create a personalized agenda based on your interests and track preferences.
                </p>
                <Button className="mr-4">
                    Build My Schedule
                </Button>
                <Button variant="outline">
                    Download Full Schedule (PDF)
                </Button>
            </div>
        </div>
    );
}
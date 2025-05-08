"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import ClientOnly from "@/components/client-only"

// Configure page as server-side only
export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
    return (
        <ClientOnly>
            <SettingsPageContent />
        </ClientOnly>
    )
}

// Main component content
function SettingsPageContent() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Admin profile state
    const [profileData, setProfileData] = useState({
        name: "",
        email: ""
    })

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    // Event settings state
    const [eventSettings, setEventSettings] = useState({
        eventName: "TechFest 2025",
        eventDates: "May 15-17, 2025",
        eventVenue: "Tech Convention Center, Delhi",
        expectedAttendance: "5000+"
    })

    // Registration settings state
    const [registrationSettings, setRegistrationSettings] = useState({
        registrationPrice: "999",
        registrationsOpen: true
    })

    // Fetch admin data on component mount
    useEffect(() => {
        if (status === "authenticated") {
            fetchAdminData()
        }
    }, [status])

    const fetchAdminData = async () => {
        try {
            // In a real implementation, you would fetch the admin's data
            setProfileData({
                name: session?.user?.name || "Admin User",
                email: session?.user?.email || "admin@techfest.com"
            })

            // In a real implementation, you would fetch event settings from API
            // For now, we'll use the default values set above

            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching admin data:", error)
            toast({
                title: "Error",
                description: "Failed to load admin settings",
                variant: "destructive"
            })
            setIsLoading(false)
        }
    }

    // Handle profile update
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // In a real implementation, you would send the updated profile to an API
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call

            toast({
                title: "Profile Updated",
                description: "Your profile information has been updated successfully."
            })
        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Handle password change
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "New password and confirm password do not match",
                variant: "destructive"
            })
            return
        }

        setIsSaving(true)

        try {
            // In a real implementation, you would send the password change to an API
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call

            // Reset password fields
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })

            toast({
                title: "Password Changed",
                description: "Your password has been changed successfully."
            })
        } catch (error) {
            console.error("Error changing password:", error)
            toast({
                title: "Error",
                description: "Failed to change password",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Handle event settings update
    const handleEventSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // In a real implementation, you would send the updated event settings to an API
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call

            toast({
                title: "Event Settings Updated",
                description: "Event settings have been updated successfully."
            })
        } catch (error) {
            console.error("Error updating event settings:", error)
            toast({
                title: "Error",
                description: "Failed to update event settings",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Handle registration settings update
    const handleRegistrationSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // In a real implementation, you would send the updated registration settings to an API
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call

            toast({
                title: "Registration Settings Updated",
                description: "Registration settings have been updated successfully."
            })
        } catch (error) {
            console.error("Error updating registration settings:", error)
            toast({
                title: "Error",
                description: "Failed to update registration settings",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    // Don't render the full UI until we're authenticated
    if (status !== "authenticated") {
        return null
    }

    return (
        <AdminLayout>
            <div className="container py-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
                        <p className="text-muted-foreground">Manage your account and event settings</p>
                    </div>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="event">Event</TabsTrigger>
                            <TabsTrigger value="registration">Registration</TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Settings</CardTitle>
                                    <CardDescription>Manage your administrator profile information.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                placeholder="Your email"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Password Tab */}
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your administrator password.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Event Tab */}
                        <TabsContent value="event">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Settings</CardTitle>
                                    <CardDescription>Configure your event details shown on the website.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleEventSettingsUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="eventName">Event Name</Label>
                                            <Input
                                                id="eventName"
                                                value={eventSettings.eventName}
                                                onChange={(e) => setEventSettings({ ...eventSettings, eventName: e.target.value })}
                                                placeholder="TechFest 2025"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="eventDates">Event Dates</Label>
                                            <Input
                                                id="eventDates"
                                                value={eventSettings.eventDates}
                                                onChange={(e) => setEventSettings({ ...eventSettings, eventDates: e.target.value })}
                                                placeholder="May 15-17, 2025"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="eventVenue">Event Venue</Label>
                                            <Input
                                                id="eventVenue"
                                                value={eventSettings.eventVenue}
                                                onChange={(e) => setEventSettings({ ...eventSettings, eventVenue: e.target.value })}
                                                placeholder="Tech Convention Center, Delhi"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expectedAttendance">Expected Attendance</Label>
                                            <Input
                                                id="expectedAttendance"
                                                value={eventSettings.expectedAttendance}
                                                onChange={(e) => setEventSettings({ ...eventSettings, expectedAttendance: e.target.value })}
                                                placeholder="5000+"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Registration Tab */}
                        <TabsContent value="registration">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Registration Settings</CardTitle>
                                    <CardDescription>Configure registration options for your event.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleRegistrationSettingsUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="registrationPrice">Registration Price (₹)</Label>
                                            <Input
                                                id="registrationPrice"
                                                value={registrationSettings.registrationPrice}
                                                onChange={(e) => setRegistrationSettings({ ...registrationSettings, registrationPrice: e.target.value })}
                                                placeholder="999"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                id="registrationsOpen"
                                                type="checkbox"
                                                checked={registrationSettings.registrationsOpen}
                                                onChange={(e) => setRegistrationSettings({ ...registrationSettings, registrationsOpen: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="registrationsOpen" className="text-sm font-medium">
                                                Registrations Open
                                            </Label>
                                        </div>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AdminLayout>
    )
}
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Download,
    Loader2,
    MoreHorizontal,
    QrCode,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Mail,
    Trash2,
    Eye,
    CheckCircle2
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import ClientOnly from "@/components/client-only"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"

// Configure page as server-side only
export const dynamic = 'force-dynamic'

interface Registration {
    id: string
    name: string
    email: string
    phone: string
    paymentVerified: boolean
    paymentId?: string
    orderId: string
    amount: number
    qrCode?: string
    qrUsed: boolean
    createdAt: string
}

export default function AdminRegistrationsPage() {
    return (
        <ClientOnly>
            <RegistrationsPageContent />
        </ClientOnly>
    )
}

// Main component content
function RegistrationsPageContent() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
    const [viewRegistration, setViewRegistration] = useState<Registration | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isResendingEmail, setIsResendingEmail] = useState(false)
    const [isMarkingCheckedIn, setIsMarkingCheckedIn] = useState(false)

    // Filters
    const [filters, setFilters] = useState({
        paymentStatus: "all", // all, paid, pending
        checkInStatus: "all", // all, checkedIn, notCheckedIn
        dateRange: "all", // all, today, week, month
    })

    // Sort options
    const [sortOption, setSortOption] = useState("dateDesc") // dateDesc, dateAsc, nameAsc, nameDesc

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    useEffect(() => {
        if (status === "authenticated") {
            fetchRegistrations()
        }
    }, [status])

    const fetchRegistrations = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/registrations")
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch registrations")
            }

            setRegistrations(data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching registrations:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load registrations",
                variant: "destructive"
            })
            setLoading(false)
        }
    }

    const exportToCSV = () => {
        if (registrations.length === 0) return

        const headers = ["Registration ID", "Name", "Email", "Phone", "Payment Status", "Payment ID", "Order ID", "Amount", "Check-in Status", "Registration Date"]

        const csvData = filteredRegistrations.map((reg) => [
            reg.id,
            reg.name,
            reg.email,
            reg.phone,
            reg.paymentVerified ? "Paid" : "Pending",
            reg.paymentId || "N/A",
            reg.orderId,
            `₹${(reg.amount / 100).toFixed(2)}`,
            reg.qrUsed ? "Checked In" : "Not Checked In",
            new Date(reg.createdAt).toLocaleDateString()
        ])

        const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)

        link.setAttribute("href", url)
        link.setAttribute("download", `techfest-registrations-${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Filter registrations based on search term and filters
    const filteredRegistrations = registrations.filter((reg) => {
        // Search filter
        const matchesSearch =
            reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.phone.includes(searchTerm);

        // Payment status filter
        const matchesPaymentStatus =
            filters.paymentStatus === "all" ||
            (filters.paymentStatus === "paid" && reg.paymentVerified) ||
            (filters.paymentStatus === "pending" && !reg.paymentVerified);

        // Check-in status filter
        const matchesCheckInStatus =
            filters.checkInStatus === "all" ||
            (filters.checkInStatus === "checkedIn" && reg.qrUsed) ||
            (filters.checkInStatus === "notCheckedIn" && !reg.qrUsed);

        // Date range filter
        let matchesDateRange = true;
        const regDate = new Date(reg.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filters.dateRange === "today") {
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);
            matchesDateRange = regDate >= today && regDate <= todayEnd;
        } else if (filters.dateRange === "week") {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - 7);
            matchesDateRange = regDate >= weekStart;
        } else if (filters.dateRange === "month") {
            const monthStart = new Date(today);
            monthStart.setMonth(today.getMonth() - 1);
            matchesDateRange = regDate >= monthStart;
        }

        return matchesSearch && matchesPaymentStatus && matchesCheckInStatus && matchesDateRange;
    }).sort((a, b) => {
        // Sort registrations based on sort option
        switch (sortOption) {
            case "dateDesc":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "dateAsc":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "nameAsc":
                return a.name.localeCompare(b.name);
            case "nameDesc":
                return b.name.localeCompare(a.name);
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    // Pagination
    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const paginatedRegistrations = filteredRegistrations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRegistrations(paginatedRegistrations.map(reg => reg.id));
        } else {
            setSelectedRegistrations([]);
        }
    };

    const handleSelectRegistration = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedRegistrations([...selectedRegistrations, id]);
        } else {
            setSelectedRegistrations(selectedRegistrations.filter(regId => regId !== id));
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedRegistrations.length === 0) return;

        try {
            if (action === "checkin") {
                setIsMarkingCheckedIn(true);
                // In a real implementation, you would send a request to mark registrations as checked in
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

                // Update local state
                setRegistrations(registrations.map(reg =>
                    selectedRegistrations.includes(reg.id)
                        ? { ...reg, qrUsed: true }
                        : reg
                ));

                toast({
                    title: "Registrations Updated",
                    description: `${selectedRegistrations.length} registrations marked as checked in.`
                });

                setIsMarkingCheckedIn(false);
                setSelectedRegistrations([]);
            } else if (action === "export") {
                exportToCSV();
            }
        } catch (error) {
            console.error(`Error performing bulk action ${action}:`, error);
            toast({
                title: "Error",
                description: "Failed to perform bulk action",
                variant: "destructive"
            });
            setIsMarkingCheckedIn(false);
        }
    };

    const handleResendEmail = async (id: string) => {
        setIsResendingEmail(true);

        try {
            // In a real implementation, you would call an API to resend the email
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            toast({
                title: "Email Sent",
                description: "QR code email has been resent to the registrant."
            });
        } catch (error) {
            console.error("Error resending email:", error);
            toast({
                title: "Error",
                description: "Failed to resend email",
                variant: "destructive"
            });
        } finally {
            setIsResendingEmail(false);
        }
    };

    const handleMarkCheckedIn = async (id: string) => {
        setIsMarkingCheckedIn(true);

        try {
            // In a real implementation, you would call an API to mark as checked in
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            // Update local state
            setRegistrations(registrations.map(reg =>
                reg.id === id ? { ...reg, qrUsed: true } : reg
            ));

            toast({
                title: "Registration Updated",
                description: "Attendee has been marked as checked in."
            });
        } catch (error) {
            console.error("Error marking as checked in:", error);
            toast({
                title: "Error",
                description: "Failed to mark as checked in",
                variant: "destructive"
            });
        } finally {
            setIsMarkingCheckedIn(false);
        }
    };

    const confirmDelete = (id: string) => {
        setConfirmDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!confirmDeleteId) return;

        setDeleteLoading(true);

        try {
            // In a real implementation, you would call an API to delete the registration
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            // Update local state
            setRegistrations(registrations.filter(reg => reg.id !== confirmDeleteId));

            toast({
                title: "Registration Deleted",
                description: "The registration has been deleted."
            });

            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting registration:", error);
            toast({
                title: "Error",
                description: "Failed to delete registration",
                variant: "destructive"
            });
        } finally {
            setDeleteLoading(false);
            setConfirmDeleteId(null);
        }
    };

    const resetFilters = () => {
        setFilters({
            paymentStatus: "all",
            checkInStatus: "all",
            dateRange: "all"
        });
        setSearchTerm("");
        setSortOption("dateDesc");
    };

    if (status === "loading" || loading) {
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
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
                            <p className="text-muted-foreground">
                                Manage all registrations for TechFest 2025. {filteredRegistrations.length} registrations found.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => fetchRegistrations()}
                                disabled={loading}
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => exportToCSV()}
                                disabled={filteredRegistrations.length === 0}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button onClick={() => router.push("/admin/scan")}>
                                <QrCode className="mr-2 h-4 w-4" />
                                Scan QR
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, email or phone..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Select
                                value={sortOption}
                                onValueChange={setSortOption}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dateDesc">Newest first</SelectItem>
                                    <SelectItem value="dateAsc">Oldest first</SelectItem>
                                    <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                                    <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                                </SelectContent>
                            </Select>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                        <SheetDescription>
                                            Filter registrations by various criteria
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="paymentStatus">Payment Status</Label>
                                            <Select
                                                value={filters.paymentStatus}
                                                onValueChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                                            >
                                                <SelectTrigger id="paymentStatus">
                                                    <SelectValue placeholder="Select payment status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="paid">Paid</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="checkInStatus">Check-in Status</Label>
                                            <Select
                                                value={filters.checkInStatus}
                                                onValueChange={(value) => setFilters({ ...filters, checkInStatus: value })}
                                            >
                                                <SelectTrigger id="checkInStatus">
                                                    <SelectValue placeholder="Select check-in status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="checkedIn">Checked In</SelectItem>
                                                    <SelectItem value="notCheckedIn">Not Checked In</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dateRange">Date Range</Label>
                                            <Select
                                                value={filters.dateRange}
                                                onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                                            >
                                                <SelectTrigger id="dateRange">
                                                    <SelectValue placeholder="Select date range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Time</SelectItem>
                                                    <SelectItem value="today">Today</SelectItem>
                                                    <SelectItem value="week">Last 7 Days</SelectItem>
                                                    <SelectItem value="month">Last 30 Days</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                                        <SheetClose asChild>
                                            <Button>Apply Filters</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    {selectedRegistrations.length > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-md">
                            <p className="text-sm">
                                {selectedRegistrations.length} {selectedRegistrations.length === 1 ? 'registration' : 'registrations'} selected
                            </p>
                            <div className="ml-auto flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction("checkin")}
                                    disabled={isMarkingCheckedIn}
                                >
                                    {isMarkingCheckedIn ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    Mark as Checked In
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleBulkAction("export")}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Selected
                                </Button>
                            </div>
                        </div>
                    )}

                    <Card>
                        <CardContent className="p-0">
                            {filteredRegistrations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <p className="text-muted-foreground mb-2">No registrations found</p>
                                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40px]">
                                                    <Checkbox
                                                        checked={paginatedRegistrations.length > 0 && selectedRegistrations.length === paginatedRegistrations.length}
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Payment</TableHead>
                                                <TableHead>Check-in</TableHead>
                                                <TableHead>Registration Date</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedRegistrations.map((registration) => (
                                                <TableRow key={registration.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedRegistrations.includes(registration.id)}
                                                            onCheckedChange={(checked) => handleSelectRegistration(registration.id, checked === true)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{registration.name}</TableCell>
                                                    <TableCell>{registration.email}</TableCell>
                                                    <TableCell>{registration.phone}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={registration.paymentVerified ? "success" : "outline"}>
                                                            {registration.paymentVerified ? "Paid" : "Pending"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={registration.qrUsed ? "success" : "outline"}>
                                                            {registration.qrUsed ? "Checked In" : "Not Checked In"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => setViewRegistration(registration)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                {registration.paymentVerified && !registration.qrUsed && (
                                                                    <DropdownMenuItem onClick={() => handleMarkCheckedIn(registration.id)}>
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Mark as Checked In
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {registration.paymentVerified && (
                                                                    <DropdownMenuItem onClick={() => handleResendEmail(registration.id)}>
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        Resend QR Email
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={() => confirmDelete(registration.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between px-4 py-2 border-t">
                                            <div className="text-sm text-muted-foreground">
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRegistrations.length)} of {filteredRegistrations.length} registrations
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                        let pageNumber: number;
                                                        if (totalPages <= 5) {
                                                            pageNumber = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNumber = i + 1;
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNumber = totalPages - 4 + i;
                                                        } else {
                                                            pageNumber = currentPage - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={i}
                                                                variant={pageNumber === currentPage ? "default" : "outline"}
                                                                size="sm"
                                                                className="w-8 h-8 p-0"
                                                                onClick={() => setCurrentPage(pageNumber)}
                                                            >
                                                                {pageNumber}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Registration Detail Dialog */}
            {viewRegistration && (
                <Dialog open={!!viewRegistration} onOpenChange={(open) => !open && setViewRegistration(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Registration Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about this registration
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <div className="font-medium">Name:</div>
                                <div className="col-span-2">{viewRegistration.name}</div>

                                <div className="font-medium">Email:</div>
                                <div className="col-span-2">{viewRegistration.email}</div>

                                <div className="font-medium">Phone:</div>
                                <div className="col-span-2">{viewRegistration.phone}</div>

                                <div className="font-medium">Registration ID:</div>
                                <div className="col-span-2 break-all">{viewRegistration.id}</div>

                                <div className="font-medium">Registration Date:</div>
                                <div className="col-span-2">{new Date(viewRegistration.createdAt).toLocaleString()}</div>

                                <div className="font-medium">Payment Status:</div>
                                <div className="col-span-2">
                                    <Badge variant={viewRegistration.paymentVerified ? "success" : "outline"}>
                                        {viewRegistration.paymentVerified ? "Paid" : "Pending"}
                                    </Badge>
                                </div>

                                {viewRegistration.paymentVerified && (
                                    <>
                                        <div className="font-medium">Payment ID:</div>
                                        <div className="col-span-2">{viewRegistration.paymentId || "N/A"}</div>
                                    </>
                                )}

                                <div className="font-medium">Order ID:</div>
                                <div className="col-span-2">{viewRegistration.orderId}</div>

                                <div className="font-medium">Amount:</div>
                                <div className="col-span-2">₹{(viewRegistration.amount / 100).toFixed(2)}</div>

                                <div className="font-medium">Check-in Status:</div>
                                <div className="col-span-2">
                                    <Badge variant={viewRegistration.qrUsed ? "success" : "outline"}>
                                        {viewRegistration.qrUsed ? "Checked In" : "Not Checked In"}
                                    </Badge>
                                </div>

                                {viewRegistration.qrUsed && (
                                    <>
                                        <div className="font-medium">Checked in on:</div>
                                        <div className="col-span-2">Not available</div>
                                    </>
                                )}
                            </div>

                            {viewRegistration.paymentVerified && viewRegistration.qrCode && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">QR Code:</p>
                                    <div className="flex justify-center bg-white p-2 rounded-md">
                                        <img
                                            src={`data:image/png;base64,${viewRegistration.qrCode}`}
                                            alt="QR Code"
                                            className="w-40 h-40"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex space-x-2 sm:justify-start">
                            {viewRegistration.paymentVerified && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        handleResendEmail(viewRegistration.id);
                                    }}
                                    disabled={isResendingEmail}
                                >
                                    {isResendingEmail ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Mail className="mr-2 h-4 w-4" />
                                    )}
                                    Resend QR Email
                                </Button>
                            )}
                            {viewRegistration.paymentVerified && !viewRegistration.qrUsed && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        handleMarkCheckedIn(viewRegistration.id);
                                        setViewRegistration(null);
                                    }}
                                    disabled={isMarkingCheckedIn}
                                >
                                    {isMarkingCheckedIn ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    Mark as Checked In
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Registration</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this registration? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 sm:justify-start">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
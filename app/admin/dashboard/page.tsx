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
import { Download, Loader2, QrCode, Search } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { DashboardStats } from "@/components/dashboard-stats"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    fetchRegistrations()
  }, [status, router])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/registrations")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch registrations")
      }

      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load registrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (registrations.length === 0) return

    const headers = ["Registration ID", "Name", "Email", "Phone", "Payment Status", "QR Used"]
    const csvData = registrations.map((reg) => [
      reg.id,
      reg.name,
      reg.email,
      reg.phone,
      reg.paymentVerified ? "Paid" : "Pending",
      reg.qrUsed ? "Yes" : "No",
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

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm),
  )

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage registrations and check-ins for TechFest 2025.</p>
          </div>

          <DashboardStats />

          <div className="flex items-center justify-between">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} disabled={registrations.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={() => router.push("/admin/scan")}>
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registrations</CardTitle>
              <CardDescription>View and manage all event registrations.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="flex justify-center py-8 text-muted-foreground">No registrations found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

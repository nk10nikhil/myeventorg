"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/ui/charts"
import { Loader2 } from "lucide-react"

interface Registration {
  id: string
  name: string
  email: string
  phone: string
  paymentVerified: boolean
  qrUsed: boolean
  createdAt: string
}

export function DashboardStats() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/registrations")
      const data = await response.json()

      if (!response.ok) {
        throw new Error("Failed to fetch registrations")
      }

      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalRegistrations = registrations.length
  const confirmedPayments = registrations.filter((reg) => reg.paymentVerified).length
  const checkedIn = registrations.filter((reg) => reg.qrUsed).length
  const pendingPayments = totalRegistrations - confirmedPayments

  // Calculate revenue
  const revenue = confirmedPayments * 999 // ₹999 per registration

  // Prepare chart data
  const getChartData = () => {
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
    }

    const dateLabels: string[] = []
    const registrationData: number[] = []
    const checkinData: number[] = []

    // Generate date labels based on timeframe
    if (timeframe === "week") {
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        dateLabels.push(date.toLocaleDateString("en-US", { weekday: "short" }))

        const dayRegistrations = registrations.filter((reg) => {
          const regDate = new Date(reg.createdAt)
          return regDate.toDateString() === date.toDateString()
        })

        registrationData.push(dayRegistrations.length)
        checkinData.push(dayRegistrations.filter((reg) => reg.qrUsed).length)
      }
    } else if (timeframe === "month") {
      // Group by week for month view
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(startDate)
        weekStart.setDate(startDate.getDate() + i * 7)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)

        dateLabels.push(`Week ${i + 1}`)

        const weekRegistrations = registrations.filter((reg) => {
          const regDate = new Date(reg.createdAt)
          return regDate >= weekStart && regDate <= weekEnd
        })

        registrationData.push(weekRegistrations.length)
        checkinData.push(weekRegistrations.filter((reg) => reg.qrUsed).length)
      }
    } else {
      // Group by month for year view
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate)
        monthDate.setMonth(startDate.getMonth() + i)

        dateLabels.push(monthDate.toLocaleDateString("en-US", { month: "short" }))

        const monthRegistrations = registrations.filter((reg) => {
          const regDate = new Date(reg.createdAt)
          return regDate.getMonth() === monthDate.getMonth() && regDate.getFullYear() === monthDate.getFullYear()
        })

        registrationData.push(monthRegistrations.length)
        checkinData.push(monthRegistrations.filter((reg) => reg.qrUsed).length)
      }
    }

    return {
      labels: dateLabels,
      datasets: [
        {
          label: "Registrations",
          data: registrationData,
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
        },
        {
          label: "Check-ins",
          data: checkinData,
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          borderColor: "rgb(16, 185, 129)",
        },
      ],
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">{pendingPayments} pending payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedPayments}</div>
            <p className="text-xs text-muted-foreground">
              {((confirmedPayments / totalRegistrations) * 100 || 0).toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedIn}</div>
            <p className="text-xs text-muted-foreground">
              {((checkedIn / confirmedPayments) * 100 || 0).toFixed(1)}% attendance rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">₹999 per registration</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Analytics</CardTitle>
          <Tabs defaultValue="week" onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="week">Last 7 Days</TabsTrigger>
              <TabsTrigger value="month">Last Month</TabsTrigger>
              <TabsTrigger value="year">Last Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart data={getChartData()} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

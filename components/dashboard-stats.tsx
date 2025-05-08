"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, DoughnutChart } from "@/components/ui/charts"
import { Loader2, TrendingUp, TrendingDown, Activity, Users, CreditCard, CheckSquare, CalendarClock, UserPlus, RefreshCw } from "lucide-react"

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
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchRegistrationData()
  }, [])

  const fetchRegistrationData = async () => {
    try {
      const response = await fetch("/api/admin/registrations")
      if (!response.ok) {
        throw new Error("Failed to fetch registrations")
      }
      const data = await response.json()
      setRegistrations(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching registration data:", error)
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await fetchRegistrationData()
      // Add a slight delay to make the refresh animation noticeable
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    } catch (error) {
      setIsRefreshing(false)
    }
  }

  const totalRegistrations = registrations.length
  const confirmedPayments = registrations.filter((reg) => reg.paymentVerified).length
  const pendingPayments = totalRegistrations - confirmedPayments
  const checkedIn = registrations.filter((reg) => reg.qrUsed).length
  const notCheckedIn = confirmedPayments - checkedIn

  // Calculate revenue based on a fixed ticket price
  const revenue = confirmedPayments * 999
  const potentialRevenue = pendingPayments * 999

  // Get registration trend (compared to previous period)
  const getRegistrationTrend = () => {
    const now = new Date()
    let currentPeriodStart: Date
    let previousPeriodStart: Date

    switch (timeframe) {
      case "week":
        currentPeriodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        break
      case "month":
        currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        break
      case "year":
        currentPeriodStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        previousPeriodStart = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000)
        break
      default:
        currentPeriodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    }

    const currentPeriodRegs = registrations.filter(reg =>
      new Date(reg.createdAt) >= currentPeriodStart
    ).length

    const previousPeriodRegs = registrations.filter(reg =>
      new Date(reg.createdAt) >= previousPeriodStart &&
      new Date(reg.createdAt) < currentPeriodStart
    ).length

    if (previousPeriodRegs === 0) return { percentage: 100, increasing: true }

    const percentChange = ((currentPeriodRegs - previousPeriodRegs) / previousPeriodRegs) * 100
    return {
      percentage: Math.abs(Math.round(percentChange)),
      increasing: percentChange >= 0
    }
  }

  const trend = getRegistrationTrend()

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
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          borderRadius: 4,
          tension: 0.3,
        },
        {
          label: "Check-ins",
          data: checkinData,
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
          borderRadius: 4,
          tension: 0.3,
        },
      ],
    }
  }

  // Get doughnut chart data for payment status
  const getPaymentChart = () => {
    return {
      labels: ['Paid', 'Pending'],
      datasets: [
        {
          data: [confirmedPayments, pendingPayments],
          backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)'],
          borderColor: ['rgb(16, 185, 129)', 'rgb(245, 158, 11)'],
          borderWidth: 1,
          hoverOffset: 5
        }
      ]
    }
  }

  // Get doughnut chart data for check-in status
  const getCheckinChart = () => {
    return {
      labels: ['Checked In', 'Not Checked In'],
      datasets: [
        {
          data: [checkedIn, confirmedPayments - checkedIn],
          backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(107, 114, 128, 0.7)'],
          borderColor: ['rgb(59, 130, 246)', 'rgb(107, 114, 128)'],
          borderWidth: 1,
          hoverOffset: 5
        }
      ]
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
      {/* Header stats with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        <button
          onClick={refreshData}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <div className="flex items-center mt-1 gap-1 text-xs">
              {trend.increasing ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-500">{trend.percentage}% increase</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-red-500">{trend.percentage}% decrease</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs previous {timeframe}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{pendingPayments} pending payment</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 bg-gradient-to-r from-green-500/10 to-green-600/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Confirmed Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <div className="text-2xl font-bold">{confirmedPayments}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Activity className="h-3.5 w-3.5" />
              <span>{((confirmedPayments / totalRegistrations) * 100 || 0).toFixed(1)}% conversion rate</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">₹{potentialRevenue.toLocaleString()} potential revenue</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
              <CheckSquare className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <div className="text-2xl font-bold">{checkedIn}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Users className="h-3.5 w-3.5" />
              <span>{((checkedIn / confirmedPayments) * 100 || 0).toFixed(1)}% attendance rate</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{notCheckedIn} paid registrants not checked in</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CalendarClock className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <div className="text-2xl font-bold">₹{revenue.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <CreditCard className="h-3.5 w-3.5" />
              <span>₹999 per registration</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Next payout: May 15, 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registration Analytics</CardTitle>
            <Tabs defaultValue="week" onValueChange={setTimeframe} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                <TabsTrigger value="month">Last Month</TabsTrigger>
                <TabsTrigger value="year">Last Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart data={getChartData()} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-rows-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Breakdown of payment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex justify-center">
                <DoughnutChart data={getPaymentChart()} />
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Paid ({confirmedPayments})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Pending ({pendingPayments})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check-in Status</CardTitle>
              <CardDescription>Paid registrants check-in rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex justify-center">
                <DoughnutChart data={getCheckinChart()} />
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Checked In ({checkedIn})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm">Not Checked In ({notCheckedIn})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

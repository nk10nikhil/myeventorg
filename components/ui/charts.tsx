"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

// Get chart colors based on theme
const useChartColors = (isDark: boolean) => {
  return {
    gridColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    textColor: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
  };
};

interface ChartProps {
  data: any;
}

export function BarChart({ data }: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { gridColor, textColor } = useChartColors(isDark);
  const chartRef = useRef<Chart | null>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 4,
        bodyFont: {
          family: "Inter, sans-serif",
        },
        titleFont: {
          family: "Inter, sans-serif",
          weight: 700 as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Bar data={data} options={options} />;
}

export function LineChart({ data }: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { gridColor, textColor } = useChartColors(isDark);
  const chartRef = useRef<Chart | null>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 4,
        bodyFont: {
          family: "Inter, sans-serif",
        },
        titleFont: {
          family: "Inter, sans-serif",
          weight: 700 as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
          drawBorder: false,
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          padding: 8,
          font: {
            family: "Inter, sans-serif",
          },
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Line data={data} options={options} />;
}

export function DoughnutChart({ data }: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textColor } = useChartColors(isDark);
  const chartRef = useRef<Chart | null>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        display: false,
        labels: {
          color: textColor,
          padding: 20,
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 4,
        bodyFont: {
          family: "Inter, sans-serif",
        },
        titleFont: {
          family: "Inter, sans-serif",
          weight: 700 as const,
        },
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (acc: number, data: number) => acc + data,
              0,
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Doughnut data={data} options={options} />;
}

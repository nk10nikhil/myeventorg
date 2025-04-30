"use client"

import { useEffect, useState, ReactNode } from "react"

interface ClientOnlyProps {
    children: ReactNode
}

/**
 * Component that only renders its children on the client side
 * This prevents hydration errors with authentication hooks
 */
export default function ClientOnly({ children }: ClientOnlyProps) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return <>{children}</>
}
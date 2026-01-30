"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex sticky top-0 z-10 items-center bg-background/80 backdrop-blur-md p-4 pb-2 justify-between">
      <Link href="/" className="text-foreground flex size-12 shrink-0 items-center justify-start">
        <ArrowLeft className="size-6" />
      </Link>
      <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 text-center">{title}</h2>
      <div className="flex size-12 shrink-0" />
    </div>
  )
}

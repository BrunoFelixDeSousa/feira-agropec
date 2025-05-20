"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden h-full group">
      <Link href={link}>
        <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center h-full">
          <motion.div
            className="mb-1 sm:mb-2 text-green-600 dark:text-green-400"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
          <h3 className="text-sm sm:text-base font-bold mb-0.5 sm:mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Link>
    </Card>
  )
}

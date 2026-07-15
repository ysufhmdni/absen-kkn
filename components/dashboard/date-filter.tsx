"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateFilter({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(date, "yyyy-MM-dd"))
    router.push(`/dashboard/admin?${params.toString()}`)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
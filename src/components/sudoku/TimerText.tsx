import { formatTime } from "@/lib/utils"
import React from "react"

interface TimerTextProps {
    timer: number
};

export const TimerText: React.FC<TimerTextProps> = ({
    timer
}) => {
    return <span className="text-2xl font-medium">{formatTime(timer)}</span>
}
import React from "react";
import { ControlButton } from "./ControlButton";
import { useSudokuState } from "@/states/sudokuState";
import { Pencil } from "lucide-react";

export const PencilButton: React.FC = () => {
    const { isPencilMode, setState } = useSudokuState();
    return (
        <ControlButton isSelected={isPencilMode} Icon={Pencil} onClick={() => setState(prevState => ({ isPencilMode: !prevState.isPencilMode }))} />
    )
}
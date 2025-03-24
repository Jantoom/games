import React from "react";
import { ControlButton } from "./ControlButton";
import { useSudokuState } from "@/states/sudokuState";
import { Undo } from "lucide-react";

interface UndoButtonProps {
    undo: () => void;
}

export const UndoButton: React.FC<UndoButtonProps> = ({
    undo,
}) => {
    const { history } = useSudokuState();

    return (
        <ControlButton isSelected={false} Icon={Undo} onClick={undo} disabled={history.length === 0} className="w-[10%] h-auto aspect-square rounded-full active:bg-primary active:text-background"/>
    )
}
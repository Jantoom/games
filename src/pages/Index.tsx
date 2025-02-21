
import { SudokuBoard } from "@/components/SudokuBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <h1 className="text-4xl font-light mb-8 tracking-tight">Sudoku</h1>
      <SudokuBoard />
    </div>
  );
};

export default Index;

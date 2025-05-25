
import Board from "@/components/Board";
import { BoardProvider } from "@/context/BoardContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <BoardProvider>
        <div className="max-w-7xl mx-auto">
          <Board />
        </div>
      </BoardProvider>
    </div>
  );
};

export default Index;

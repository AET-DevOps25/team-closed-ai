import Board from "@/components/Board";
import { BoardProvider } from "@/context/BoardContext";
import { useProject } from "@/context/ProjectContext";

const BoardPage = () => {
  const { selectedProject } = useProject();

  return (
    <div className="p-4 md:p-6">
      <BoardProvider>
        <div className="max-w-7xl mx-auto">
          <Board selectedProject={selectedProject} />
        </div>
      </BoardProvider>
    </div>
  );
};

export default BoardPage;

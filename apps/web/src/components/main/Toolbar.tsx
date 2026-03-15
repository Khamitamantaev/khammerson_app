import { Button } from "@web/components/ui/button";
import { Settings, Play, FolderDown, X, Save, Download } from "lucide-react";
import { useCanvasStore, useCurrentCanvas } from "@web/store/FlowStore";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const Toolbar = () => {
  const { projectId } = useParams();
  const { isSidebarOpen, actions, currentCanvasId } = useCanvasStore();
  const activeCanvas = useCurrentCanvas();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Проверяем, находимся ли мы в глобальной библиотеке
  const isInGlobalLibrary = currentCanvasId === "global-library";

  const handleSave = () => {
    if (!activeCanvas) return;
    // TODO: добавить мутацию сохранения
  };

  const handleDownload = () => {
    if (!activeCanvas) return;
    // TODO: скачать проект
    console.log("Download canvas:", activeCanvas);
  };

  const handleRunProcess = async () => {
    if (!activeCanvas) {
      alert("Нет активного канваса!");
      return;
    }

    const startNode = activeCanvas.nodes![0];
    if (!startNode) {
      alert("Нет нод для генерации!");
      return;
    }

    // TODO: запустить генерацию проекта
    console.log("Generate project from node:", startNode.id);
  };

  const handleImportSuccess = () => {
    // TODO: обновить список канвасов
    console.log("Import success");
  };

  const handleToggleGlobalLibrary = () => {
    if (isInGlobalLibrary) {
      // Возвращаемся к первому доступному канвасу
      const userCanvases = useCanvasStore
        .getState()
        .canvases.filter((c) => c.id !== "global-library");
      const firstUserCanvas = userCanvases[0]?.id || null;
      actions.setCurrentCanvasId(firstUserCanvas);
    } else {
      // Переходим в глобальную библиотеку
      actions.setCurrentCanvasId("global-library");
    }
  };

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.setSidebarOpen(!isSidebarOpen)}
          className="text-slate-400 hover:text-white px-3"
        >
          <Settings className="h-4 w-4" />
          <span className="ml-2">
            {isSidebarOpen ? "Скрыть панель" : "Показать панель"}
          </span>
        </Button>

        {/* Отображаем информацию о текущем режиме */}
        {activeCanvas && !isInGlobalLibrary && (
          <div className="text-sm text-slate-400 px-3 py-1.5 bg-slate-800/50 rounded-md">
            Проект: <span className="text-cyan-400">{activeCanvas.title}</span>
          </div>
        )}
      </div>

      {/* Кнопки для обычного режима */}
      {activeCanvas && !isInGlobalLibrary && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex items-center gap-2 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <Save className="h-4 w-4" />
            Сохранить
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <Download className="h-4 w-4" />
            Скачать
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <FolderDown className="h-4 w-4" />
            Импорт
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 px-6"
            onClick={handleRunProcess}
          >
            <Play className="h-4 w-4 mr-2" />
            Сгенерировать
          </Button>
        </div>
      )}

      {/* Кнопки для глобального режима */}
      {isInGlobalLibrary && (
        <div className="flex items-center gap-3 flex-1 max-w-2xl justify-end">
          <Button
            variant="outline"
            onClick={handleToggleGlobalLibrary}
            className="flex items-center gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Settings className="h-4 w-4" />К редактору
          </Button>
        </div>
      )}

      {/* Модальное окно импорта (пока заглушка) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Импорт файлов
            </h3>
            <p className="text-slate-400 mb-4">Функция в разработке</p>
            <Button onClick={() => setIsImportModalOpen(false)}>Закрыть</Button>
          </div>
        </div>
      )}
    </div>
  );
};

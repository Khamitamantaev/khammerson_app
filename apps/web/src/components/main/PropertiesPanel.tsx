import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@web/store/FlowStore';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Временный компонент для свойств узла
const NodeProperties = () => {
  const { selectedNode } = useCanvasStore();

  if (!selectedNode) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Выберите узел для редактирования</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Название
        </label>
        <input
          type="text"
          value={selectedNode.data?.label || ''}
          onChange={(e) => {
            // TODO: обновить название узла
            console.log('Update label:', e.target.value);
          }}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Тип
        </label>
        <div className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300">
          {selectedNode.type || 'default'}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Позиция X
        </label>
        <input
          type="number"
          value={selectedNode.position?.x || 0}
          onChange={(e) => {
            // TODO: обновить позицию
            console.log('Update X:', e.target.value);
          }}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Позиция Y
        </label>
        <input
          type="number"
          value={selectedNode.position?.y || 0}
          onChange={(e) => {
            // TODO: обновить позицию
            console.log('Update Y:', e.target.value);
          }}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
        />
      </div>
    </div>
  );
};

export const PropertiesPanel = () => {
  const { selectedNode, isPropertiesPanelOpen, actions } = useCanvasStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне панели
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPropertiesPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        actions.setPropertiesPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPropertiesPanelOpen, actions]);

  // Автоматически открываем панель при выборе узла
  useEffect(() => {
    if (selectedNode) {
      actions.setPropertiesPanelOpen(true);
    }
  }, [selectedNode, actions]);

  return (
    <div className="flex h-full relative">
      <AnimatePresence>
        {isPropertiesPanelOpen && (
          <>
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-10"
              onClick={() => actions.setPropertiesPanelOpen(false)}
            />

            {/* Панель свойств */}
            <motion.div
              ref={panelRef}
              initial={{
                scale: 0.8,
                opacity: 0,
                y: -20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                y: 20,
              }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="fixed inset-0 m-auto h-[85vh] w-[90vw] max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl flex flex-col z-20 overflow-hidden"
            >
              {/* Заголовок */}
              <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <span>Свойства</span>
                    {selectedNode && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-400/30">
                        {selectedNode.type || 'node'}
                      </span>
                    )}
                  </h3>

                  <button
                    onClick={() => actions.setPropertiesPanelOpen(false)}
                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-red-500/20"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 overflow-y-auto p-6">
                <NodeProperties />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
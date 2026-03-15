import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Folder, File, Package, GitBranch, Star, Archive } from "lucide-react";
import { cn } from "@web/lib/utils";

// Базовый компонент ноды
const BaseNode = memo(
  ({ data, icon: Icon, iconColor, bgColor, borderColor, selected }: any) => {
    return (
      <div
        className={cn(
          "px-3 py-2 rounded-lg border shadow-lg backdrop-blur-sm min-w-[150px]",
          "transition-all duration-200",
          bgColor || "bg-slate-800/90",
          borderColor || "border-slate-700",
          selected && "ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20",
        )}
      >
        {/* Входящий хендл */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-cyan-400 border-2 border-slate-900"
        />

        {/* Содержимое ноды */}
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-200">
              {data.label || "Без названия"}
            </div>
            {data.description && (
              <div className="text-xs text-slate-400">{data.description}</div>
            )}
          </div>
        </div>

        {/* Исходящий хендл */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 bg-cyan-400 border-2 border-slate-900"
        />
      </div>
    );
  },
);

// Нода для файла
export const FileNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={File}
      iconColor="text-blue-400 bg-blue-500/10"
      bgColor="bg-blue-900/20"
      borderColor="border-blue-500/30"
    />
  );
});

// Нода для папки
export const FolderNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Folder}
      iconColor="text-amber-400 bg-amber-500/10"
      bgColor="bg-amber-900/20"
      borderColor="border-amber-500/30"
    />
  );
});

// Нода для пакета
export const PackageNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Package}
      iconColor="text-purple-400 bg-purple-500/10"
      bgColor="bg-purple-900/20"
      borderColor="border-purple-500/30"
    />
  );
});

// Нода для ветки
export const BranchNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={GitBranch}
      iconColor="text-green-400 bg-green-500/10"
      bgColor="bg-green-900/20"
      borderColor="border-green-500/30"
    />
  );
});

// Нода для избранного
export const StarredNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Star}
      iconColor="text-yellow-400 bg-yellow-500/10"
      bgColor="bg-yellow-900/20"
      borderColor="border-yellow-500/30"
    />
  );
});

// Нода для архива
export const ArchiveNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Archive}
      iconColor="text-gray-400 bg-gray-500/10"
      bgColor="bg-gray-900/20"
      borderColor="border-gray-500/30"
    />
  );
});

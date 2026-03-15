import {
  FileNode,
  FolderNode,
  PackageNode,
  BranchNode,
  StarredNode,
  ArchiveNode,
} from "./CustomNodes";

export const nodeTypes = {
  file: FileNode,
  folder: FolderNode,
  package: PackageNode,
  branch: BranchNode,
  starred: StarredNode,
  archived: ArchiveNode,
  default: FileNode, // По умолчанию файл
};

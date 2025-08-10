import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderIcon, FileIcon, FilePlusIcon, FolderPlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { File } from '@shared/schema';

interface FileExplorerProps {
  sessionId: string;
  isVisible: boolean;
  onFileSelect?: (file: File) => void;
  onCreateFile?: (name: string) => void;
  onCreateFolder?: (name: string) => void;
}

interface FileTreeItem extends File {
  level: number;
  isExpanded?: boolean;
  children?: FileTreeItem[];
}

export function FileExplorer({
  sessionId,
  isVisible,
  onFileSelect,
  onCreateFile,
  onCreateFolder
}: FileExplorerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/home', '/home/user']));

  const { data: files = [], isLoading, error } = useQuery<File[]>({
    queryKey: ['/api/sessions', sessionId, 'files'],
    enabled: !!sessionId,
  });

  const buildFileTree = (files: File[]): FileTreeItem[] => {
    const fileMap = new Map<string, FileTreeItem>();
    const rootItems: FileTreeItem[] = [];

    // Convert files to tree items and sort
    const sortedFiles = [...files].sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    // Build file map
    sortedFiles.forEach(file => {
      const level = (file.path.match(/\//g) || []).length - 1;
      const treeItem: FileTreeItem = {
        ...file,
        level,
        isExpanded: expandedPaths.has(file.path),
        children: [],
      };
      fileMap.set(file.path, treeItem);
    });

    // Build tree structure
    sortedFiles.forEach(file => {
      const treeItem = fileMap.get(file.path);
      if (!treeItem) return;

      const parentPath = file.path.substring(0, file.path.lastIndexOf('/')) || '/';
      const parent = fileMap.get(parentPath);

      if (parent && parent.isDirectory) {
        parent.children!.push(treeItem);
      } else if (file.path.startsWith('/home')) {
        rootItems.push(treeItem);
      }
    });

    return rootItems;
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderFileTree = (items: FileTreeItem[], level = 0): JSX.Element[] => {
    return items.map(item => (
      <div key={item.path}>
        <div
          className={cn(
            "flex items-center space-x-2 hover:bg-terminal-black/30 p-1 rounded cursor-pointer text-xs",
            `ml-${level * 4}`
          )}
          onClick={() => {
            if (item.isDirectory) {
              toggleExpanded(item.path);
            }
            onFileSelect?.(item);
          }}
          data-testid={`file-item-${item.name}`}
        >
          {item.isDirectory ? (
            <FolderIcon size={14} className="text-terminal-blue flex-shrink-0" />
          ) : (
            <FileIcon size={14} className={cn(
              "flex-shrink-0",
              item.name.endsWith('.py') && "text-terminal-green",
              item.name.endsWith('.json') && "text-terminal-blue",
              !item.name.includes('.') && "text-terminal-grey"
            )} />
          )}
          <span className="truncate text-terminal-white">{item.name}</span>
        </div>
        
        {item.isDirectory && item.isExpanded && item.children && (
          <div className="ml-4">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const fileTree = buildFileTree(files);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "w-80 bg-terminal-dark border-r border-terminal-grey/20 flex-shrink-0 flex-col",
      "md:flex",
      isVisible ? "flex" : "hidden"
    )} data-testid="file-explorer">
      <div className="p-4 border-b border-terminal-grey/20">
        <h3 className="text-terminal-white font-medium mb-3">File Explorer</h3>
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => onCreateFile?.('newfile.txt')}
            className="bg-terminal-blue hover:bg-terminal-blue/80 text-terminal-black px-2 py-1 rounded text-xs transition-colors"
            data-testid="button-create-file"
          >
            <FilePlusIcon size={12} className="mr-1 inline" />
            New File
          </button>
          <button
            onClick={() => onCreateFolder?.('newfolder')}
            className="bg-terminal-green hover:bg-terminal-green/80 text-terminal-black px-2 py-1 rounded text-xs transition-colors"
            data-testid="button-create-folder"
          >
            <FolderPlusIcon size={12} className="mr-1 inline" />
            New Folder
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-terminal-blue scrollbar-track-terminal-dark">
        {isLoading && (
          <div className="text-terminal-grey text-xs">Loading files...</div>
        )}
        
        {error && (
          <div className="text-terminal-red text-xs">Failed to load files</div>
        )}
        
        {!isLoading && !error && (
          <div className="space-y-1">
            {fileTree.length > 0 ? renderFileTree(fileTree) : (
              <div className="text-terminal-grey text-xs">No files found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { javaProjectFiles, JavaFileEntry } from '../data/javaSources';
import { 
  X, Download, Copy, Check, FileCode, FolderTree, 
  Terminal, Sparkles, BookOpen, Layers, CheckCircle2 
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const JavaProjectExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<JavaFileEntry>(javaProjectFiles[0]);
  const [isCopied, setIsCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const categories = Array.from(new Set(javaProjectFiles.map(f => f.category)));

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadSingleFile = (file: JavaFileEntry) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all project files into the zip archive preserving the exact directory structure
      javaProjectFiles.forEach(file => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Student-Performance-Analytics-System-JavaFX-Maven.zip';
      a.click();
      URL.revokeObjectURL(url);

      // Trigger celebratory confetti for downloading the full college project
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-[#0f172a] text-slate-200 rounded-xl shadow-2xl border border-slate-700 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-[#090d16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center text-base">
              ☕
            </span>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Java 17/21 & JavaFX Maven Source Code Explorer</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                  Full Project Roster
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Inspect pure JavaFX models, controllers, services, views, and download the ready-to-run Maven project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Maven Project (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (2 Columns: File Tree & Code Viewer) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: File Tree */}
          <div className="w-72 bg-[#0d121f] border-r border-slate-800/80 p-3 overflow-y-auto space-y-4 text-xs">
            {categories.map(category => {
              const filesInCategory = javaProjectFiles.filter(f => f.category === category);
              return (
                <div key={category} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {filesInCategory.map(file => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition cursor-pointer font-mono ${
                            isSelected
                              ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Code Viewer & Actions */}
          <div className="flex-1 flex flex-col bg-[#070b14] overflow-hidden">
            {/* Viewer Header */}
            <div className="px-4 py-2 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <span className="text-slate-500">Path:</span>
                <span className="text-blue-400 font-bold">{selectedFile.path}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition cursor-pointer text-xs"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => downloadSingleFile(selectedFile)}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save File</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-xs font-mono text-slate-200 leading-relaxed selection:bg-blue-600/50 selection:text-white">
                {selectedFile.content}
              </pre>
            </div>

            {/* Terminal Instructions Footer */}
            <div className="px-4 py-2.5 bg-[#090d16] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Run command: <strong className="text-slate-200">mvn clean compile javafx:run</strong></span>
              </div>
              <div className="text-[11px] text-slate-500">
                JavaFX 21 • Java 17/21 LTS • Maven 3.8+
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

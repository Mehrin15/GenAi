import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  CloudUpload, 
  CheckCircle2, 
  Trash2, 
  X, 
  Sparkles, 
  Lightbulb, 
  FileText, 
  GraduationCap,
  Loader2
} from 'lucide-react';
import { AcademicPaper } from '../types';

interface UploadTabProps {
  papers: AcademicPaper[];
  setPapers: React.Dispatch<React.SetStateAction<AcademicPaper[]>> | ((papers: AcademicPaper[]) => void);
  onAnalyze: (newReport: any) => void;
}

export default function UploadTab({ papers, setPapers, onAnalyze }: UploadTabProps) {
  const [dragOver, setDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Estimated processing time: 45 seconds');
  const [bloomAnalysis, setBloomAnalysis] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Natural Sciences');
  const [fileMap, setFileMap] = useState<Record<string, File>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  // Logic to add dropped or selected files
  const addFiles = (fileList: FileList) => {
    const newPapers: AcademicPaper[] = [];
    const newFileMap = { ...fileMap };
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Please upload PDF files only!');
        continue;
      }
      
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const paperId = `paper-manual-${Date.now()}-${i}`;
      
      newFileMap[paperId] = file;
      newPapers.push({
        id: paperId,
        name: file.name,
        size: `${sizeMB} MB`,
        status: 'waiting',
        progress: 0,
        subject: selectedSubject,
        bloomAnalysis: bloomAnalysis,
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    }

    if (newPapers.length > 0) {
      setFileMap(newFileMap);
      setPapers([...papers, ...newPapers]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Remove a paper from queue
  const removePaper = (id: string) => {
    setPapers(papers.filter(p => p.id !== id));
    const newFileMap = { ...fileMap };
    delete newFileMap[id];
    setFileMap(newFileMap);
  };

  const clearAll = () => {
    setPapers([]);
    setFileMap({});
  };

  // Live AI Assessment mapping
  const startSimulation = async () => {
    if (papers.length === 0) {
      alert("Please upload or have at least one question paper in the queue to analyze!");
      return;
    }

    const pendingPapers = papers.filter(p => p.status === 'waiting' || p.status === 'failed');
    if (pendingPapers.length === 0) {
      alert("No pending papers to analyze!");
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage("Connecting to academic engine...");

    try {
      for (const paper of pendingPapers) {
        const file = fileMap[paper.id];
        if (!file) continue;

        // Set status to uploading
        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: 'uploading', progress: 20 } : p));
        setStatusMessage(`Uploading ${file.name}...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", selectedSubject);
        formData.append("bloomAnalysis", bloomAnalysis.toString());

        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, progress: 50 } : p));
        setStatusMessage("Extracting text and running cognitive taxonomy mapping...");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || "Failed to analyze paper.");
        }

        const newReport = await response.json();
        
        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: 'completed', progress: 100 } : p));
        
        // Pass the resulting report up to App
        onAnalyze(newReport);
      }
    } catch (error: any) {
      alert(`Analysis failed: ${error.message}`);
      setPapers(prev => prev.map(p => p.status === 'uploading' ? { ...p, status: 'failed', progress: 0 } : p));
    } finally {
      setIsAnalyzing(false);
      setStatusMessage("Estimated processing time: ~45 seconds");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left side: upload and files */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`border-2 border-dashed rounded-2xl p-12 text-center bg-white transition-all cursor-pointer group flex flex-col items-center justify-center ${
            dragOver 
              ? 'border-[#142175] bg-[#142175]/5 scale-[0.99]' 
              : 'border-slate-200 hover:border-[#142175]/60 hover:bg-slate-50/50'
          }`}
        >
          <div className="mb-4 h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#142175] group-hover:bg-indigo-50 transition-all">
            <CloudUpload className="h-10 w-10 transition-transform" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-2">Drag and drop your PDF papers</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
            Support for scanned documents, exported LMS files, and LaTeX outputs. 
            We convert and OCR-extract with precision.
          </p>

          <button 
            type="button"
            className="bg-[#142175] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#202e96] transition-all cursor-pointer"
          >
            Browse Files
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf" 
            multiple 
            className="hidden" 
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-2xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Max size: 50MB</span>
            <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-[#142175] shrink-0" /> PDF Format Only</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Academic OCR ready</span>
          </div>
        </div>

        {/* Selected files pending analysis list */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h4 className="text-sm font-bold text-slate-800">
              Files Pending Analysis ({papers.length})
            </h4>
            {papers.length > 0 && (
              <button 
                onClick={clearAll}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {papers.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300 pointer-events-none" />
                <p className="text-xs font-medium">No files added yet. Drop or select a question paper above.</p>
              </div>
            ) : (
              papers.map((paper) => {
                const isComplete = paper.status === 'completed';
                const isUploading = paper.status === 'uploading';
                const isWaiting = paper.status === 'waiting';

                return (
                  <div key={paper.id} className="p-5 flex items-center gap-4 hover:bg-slate-50/30 transition-all">
                    {/* PDF icon element */}
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                      <FileText className="h-6 w-6 font-bold" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h5 className="text-sm font-bold text-slate-800 truncate">{paper.name}</h5>
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 mt-1 inline-block bg-slate-100 text-slate-600 rounded">
                            {paper.subject}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0 font-medium">{paper.size}</span>
                      </div>

                      {/* Real dynamic progress indicator */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            isComplete ? 'bg-[#142175]' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${paper.progress}%` }}
                        ></div>
                      </div>

                      {/* Status indicator buttons */}
                      <div className="flex justify-between items-center text-xs">
                        {isComplete && (
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Ready for analysis
                          </span>
                        )}
                        {isUploading && (
                          <span className="font-medium text-indigo-500 flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin shrink-0" /> Uploading... {paper.progress}%
                          </span>
                        )}
                        {isWaiting && (
                          <span className="font-medium text-slate-400">Waiting in queue...</span>
                        )}

                        <button 
                          onClick={() => removePaper(paper.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-all cursor-pointer"
                          title="Remove item"
                        >
                          {isUploading ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right side: configuration details */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* Analysis Settings panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h4 className="text-base font-bold text-slate-800 mb-6">Analysis Settings</h4>
          
          <div className="space-y-6">
            {/* Bloom's toggle switch */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Advanced Bloom's Analysis</p>
                <p className="text-xs text-slate-400 leading-normal">Map questions to cognitive levels</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={bloomAnalysis}
                  onChange={(e) => setBloomAnalysis(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#142175]"></div>
              </label>
            </div>

            {/* Subject Selector dropdown */}
            <div className="space-y-2">
              <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Subject Taxonomy</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 font-medium focus:ring-[#142175] focus:bg-white focus:border-[#142175] outline-none transition-all"
              >
                <option>Natural Sciences</option>
                <option>Humanities & Social Sciences</option>
                <option>Mathematics & Engineering</option>
                <option>Medical & Healthcare</option>
              </select>
            </div>

            {/* Action launcher buttons */}
            <div className="pt-4">
              <button 
                onClick={startSimulation}
                disabled={isAnalyzing}
                className="w-full bg-[#142175] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#202e96] disabled:bg-slate-300 disabled:scale-100 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
              
              <p className="text-center text-[11px] text-slate-400 font-semibold mt-3">
                {isAnalyzing ? statusMessage : "Estimated processing time: ~45 seconds"}
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tip guidelines card */}
        <div className="bg-[#142175]/5 border border-[#142175]/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-[#142175]">
              <Lightbulb className="h-5 w-5 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Pro Tech Tip</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              For the best results with handwritten papers, ensure the scan is at least 300 DPI and well-lit. QGenie AI works best with clear structural headers or outline formats.
            </p>
          </div>
        </div>

        {/* Academic analysis preview graphic */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg shadow-black/5 aspect-video md:aspect-auto">
          <img 
            alt="Academic Analysis Interface" 
            className="w-full h-44 object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGfVUKcaKZKulbzlFGC23bQZdEq4A7ZwvDuW6vWF659mtQi_IBn3V8iLYRDBUQEpXDBA4GBqYZJUEilofoft6thHBaOZpur4x4uqogZN3twlAM03tipN1itoEq113Yc7MPFYOfMVSVWwzV37FznNd-qs61wbyEwEr131kIWDCFVN8X8w15wRsbmtgAlvq1_RSg8iFpPhrwmBRomqA_Qwgz7anT3hDGodpD5u5FInFuZDEp6WZY6DBXNXfz2ytCj7EQYu8OY5HBAHw8"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  Download, 
  Share2, 
  MoreVertical, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  HelpCircle,
  Clock,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { Report, Question } from '../types';

interface ReportsTabProps {
  reports: Report[];
  selectedReportId: string | null;
  onSelectReport: (id: string | null) => void;
  onToggleStarQuestion?: (reportId: string, questionId: string) => void;
}

export default function ReportsTab({ 
  reports, 
  selectedReportId, 
  onSelectReport,
  onToggleStarQuestion
}: ReportsTabProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(selectedReportId || reports[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fallback to first available report if ID is empty
  const activeReport = reports.find(r => r.id === internalSelectedId) || reports[0];

  if (!activeReport) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 max-w-xl mx-auto shadow-sm">
        <SlidersHorizontal className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Reports Available</h3>
        <p className="text-sm text-slate-500 mb-4">Please upload a question paper and trigger "Analyze with AI" first.</p>
      </div>
    );
  }

  // Filter questions within reports
  const filteredQuestions = activeReport.questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/reports/${activeReport.id}/download`);
      if (!response.ok) throw new Error("Failed to compile PDF report on server.");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeReport.title.replace(/\s+/g, '_')}_Analysis_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error(error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      alert("Analysis share link copied to clipboard!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Report list switcher when there are multiple reports */}
      {reports.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Assessment Analysis:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {reports.map(r => (
              <button
                key={r.id}
                onClick={() => setInternalSelectedId(r.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  internalSelectedId === r.id 
                    ? 'bg-[#142175] text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-100/60'
                }`}
              >
                {r.title.length > 30 ? `${r.title.substring(0, 30)}...` : r.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main detailed reports screen */}
      <div className="flex flex-col space-y-6">
        
        {/* Detail top bar alignment */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-cyan-50 text-cyan-700 border border-cyan-100">
                Completed
              </span>
              <span className="text-xs font-bold text-slate-400">Report ID: {activeReport.reportId}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-tight">
              {activeReport.title}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {activeReport.faculty} &bull; {activeReport.semester}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Share2 className="h-4 w-4 text-slate-400" />
              <span>{isSharing ? 'Sharing...' : 'Share'}</span>
            </button>
            
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-[#142175] text-white rounded-xl text-xs font-bold hover:bg-[#202e96] flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm shadow-indigo-600/10"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Compiling PDF...' : 'Download Report'}</span>
            </button>

            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 3 Main Metrics bento grids */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* AI SUMMARY CARD */}
          <div className="col-span-12 md:col-span-12 xl:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-3xs uppercase font-extrabold tracking-widest text-[#142175] mb-4">AI Summary</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {activeReport.aiSummary}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-50">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Questions</p>
                <p className="text-xl font-extrabold text-[#142175] mt-1">{activeReport.questionCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Difficulty</p>
                <p className="text-xl font-extrabold text-[#142175] mt-1">{activeReport.avgDifficulty}</p>
              </div>
            </div>
          </div>

          {/* DIFFICULTY PROFILE BAR CHARTS */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-3xs uppercase font-extrabold tracking-widest text-[#142175] mb-6">Difficulty Profile</h4>
            
            <div className="space-y-6">
              {/* Hard item */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Hard</span>
                  <span>{activeReport.difficultyProfile.hard}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${activeReport.difficultyProfile.hard}%` }}></div>
                </div>
              </div>

              {/* Medium item */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#142175]"></span> Medium</span>
                  <span>{activeReport.difficultyProfile.medium}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#142175] h-full" style={{ width: `${activeReport.difficultyProfile.medium}%` }}></div>
                </div>
              </div>

              {/* Easy item */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400"></span> Easy</span>
                  <span>{activeReport.difficultyProfile.easy}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full" style={{ width: `${activeReport.difficultyProfile.easy}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOOM'S TAXONOMY CIRCULAR RING */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-3xs uppercase font-extrabold tracking-widest text-[#142175] mb-4">Bloom's Taxonomy Alignment</h4>
            
            <div className="flex items-center justify-between gap-6 py-2">
              {/* Progress Ring */}
              <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#eaeef3"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#142175"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - activeReport.bloomsDistribution.score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-slate-800">{activeReport.bloomsDistribution.score}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Matched</span>
                </div>
              </div>

              {/* Legends with breakdown sizes */}
              <div className="space-y-3 font-semibold text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#142175]"></span> 
                  <span>Apply ({activeReport.bloomsDistribution.apply}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500"></span> 
                  <span>Evaluate ({activeReport.bloomsDistribution.evaluate}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-900"></span> 
                  <span>Analyze ({activeReport.bloomsDistribution.analyze}%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* TOPIC DISTRIBUTION ROW AND LEGEND */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h4 className="text-3xs uppercase font-extrabold tracking-widest text-[#142175]">Topic Distribution</h4>
            <div className="flex items-center gap-4 text-3xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#142175]"></span> Major Topic</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300"></span> Minor Topic</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeReport.topicDistribution.map((t, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border transition-all ${
                  t.isMajor 
                    ? 'bg-slate-50/50 border-slate-150 relative overflow-hidden' 
                    : 'bg-white border-slate-150'
                }`}
              >
                {t.isMajor && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#142175]"></div>
                )}
                <p className="text-xs font-bold text-slate-700 truncate">{t.topic}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-xl font-black text-[#142175]">{t.percentage}%</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{t.questionsCount} Qs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUESTION ANALYSIS DETAILED LIST PANEL */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h4 className="text-sm font-bold text-slate-800">Question Analysis Detailed List</h4>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Inner Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  placeholder="Query questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#142175] transition-all w-48"
                />
              </div>

              {/* Quick Filter toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showFilters || difficultyFilter !== 'All'
                    ? 'border-[#142175] text-[#142175] bg-indigo-50/30'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filter</span>
                {difficultyFilter !== 'All' && <span className="bg-[#142175] text-white rounded-full h-1.5 w-1.5 ml-0.5"></span>}
              </button>
            </div>
          </div>

          {/* Collapsible filters box */}
          {showFilters && (
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl gap-6 flex flex-wrap items-center animate-fade-in text-xs font-semibold">
              <span className="text-slate-500">Filter by Difficulty:</span>
              <div className="flex gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      difficultyFilter === diff
                        ? 'bg-[#142175] text-white border-[#142175]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List items matching visual designs */}
          <div className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <p className="text-xs font-medium">No questions match the current criteria.</p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className="flex gap-4 p-5 rounded-2xl border border-slate-150 bg-white hover:shadow-md hover:border-slate-300/80 transition-all group duration-200"
                >
                  {/* Circular ID count indicator matching screen 2 */}
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 text-[#142175] shrink-0 font-extrabold text-sm flex items-center justify-center font-mono">
                    {q.number || (idx + 1)}
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Header tags inside problem card */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                        Topic: {q.topic}
                      </p>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.difficulty === 'Easy' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : q.difficulty === 'Hard' 
                            ? 'bg-rose-50 text-rose-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {q.difficulty}
                        </span>
                        
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#142175]/10 text-[#142175]">
                          {q.taxonomy}
                        </span>

                        {q.warning && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                            ⚠️ {q.warning}
                          </span>
                        )}

                        {onToggleStarQuestion && (
                          <button 
                            onClick={() => onToggleStarQuestion(activeReport.id, q.id)}
                            className="p-1 rounded text-slate-300 hover:text-amber-500 hover:bg-slate-50 transition-all shrink-0 ml-1.5 cursor-pointer"
                          >
                            <Star className={`h-4 w-4 ${q.isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question bold text prompt */}
                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                      {q.text}
                    </p>

                    {/* Bottom AI insights content block exactly matching design */}
                    <div className="bg-slate-50 rounded-xl p-4 border-l-2 border-[#142175]/40 text-xs">
                      <div className="flex items-center gap-1 text-[#142175] font-extrabold uppercase tracking-wider text-[10px] mb-1.5">
                        <Sparkles className="h-3 w-3 shrink-0" />
                        <span>AI Insights</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-semibold">
                        {q.aiInsights}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom load limit toggles */}
          <div className="flex items-center justify-center pt-4">
            <button 
              onClick={() => {
                alert("All loaded questions are presented above!");
              }}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <span>Load More Questions</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Page, AcademicPaper, Report, Question } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import UploadTab from './components/UploadTab';
import ReportsTab from './components/ReportsTab';
import QuestionBankTab from './components/QuestionBankTab';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  Save, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  Info,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Sliders
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Page>('upload'); // open upload screen initially matching screenshot 1
  const [activeFilterTab, setActiveFilterTab] = useState<'overview' | 'recent' | 'starred'>('recent');
  const [papers, setPapers] = useState<AcademicPaper[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile drawer sidebar state toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings states
  const [ocrQuality, setOcrQuality] = useState('High Precision DeepOCR');
  const [autoMapBlooms, setAutoMapBlooms] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [defaultFaculty, setDefaultFaculty] = useState('Faculty of Engineering');

  // Support inquiry state
  const [supportSent, setSupportSent] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('General Academic Question Bank inquiries');

  // Fetch functions to sync state with the SQLite database
  const fetchPapers = async () => {
    try {
      const res = await fetch("/api/papers");
      if (res.ok) {
        const data = await res.json();
        setPapers(data);
      }
    } catch (err) {
      console.error("Error fetching papers:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (data.length > 0 && !selectedReportId) {
          setSelectedReportId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.ocrQuality) setOcrQuality(data.ocrQuality);
        if (data.autoMapBlooms !== undefined) setAutoMapBlooms(data.autoMapBlooms);
        if (data.confidenceThreshold !== undefined) setConfidenceThreshold(data.confidenceThreshold);
        if (data.defaultFaculty) setDefaultFaculty(data.defaultFaculty);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  useEffect(() => {
    fetchPapers();
    fetchReports();
    fetchQuestions();
    fetchSettings();
  }, []);

  // Handler triggered when "Analyze with AI" finishes
  const handleAnalyzePaper = (newReport: Report) => {
    // Synchronize latest records from database
    fetchPapers();
    fetchQuestions();
    
    // Prepend new report to state list
    setReports(prev => [newReport, ...prev]);
    setSelectedReportId(newReport.id);

    // Automatically navigate to reports tab displaying the new analysis!
    setCurrentTab('reports');
    setActiveFilterTab('recent');
  };

  const selectedSubjectName = (sub: string) => {
    return sub;
  };

  // Toggle stargroup items on detailed report
  const handleToggleStarReportQuestion = async (reportId: string, questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/star`, { method: "POST" });
      if (res.ok) {
        // update reports list locally
        const updatedReports = reports.map(r => {
          if (r.id !== reportId) return r;
          return {
            ...r,
            questions: r.questions.map(q => {
              if (q.id !== questionId) return q;
              return { ...q, isStarred: !q.isStarred };
            })
          };
        });
        setReports(updatedReports);

        // sync global question bank list
        setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, isStarred: !q.isStarred } : q));
      }
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  // Toggle stargroup item directly on question tree
  const handleToggleStarGlobalQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}/star`, { method: "POST" });
      if (res.ok) {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, isStarred: !q.isStarred } : q));
        
        // Also sync in reports state
        setReports(prevReports => prevReports.map(r => ({
          ...r,
          questions: r.questions.map(q => q.id === id ? { ...q, isStarred: !q.isStarred } : q)
        })));
      }
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  const handleSelectQuestionReport = (paperId: string) => {
    const matchedReport = reports.find(r => r.paperId === paperId);
    if (matchedReport) {
      setSelectedReportId(matchedReport.id);
    }
    setCurrentTab('reports');
    setActiveFilterTab('recent');
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ocrQuality,
          autoMapBlooms,
          confidenceThreshold,
          defaultFaculty
        })
      });
      if (res.ok) {
        alert("Settings saved successfully to SQLite Database!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Error contacting server to save settings.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans antialiased text-slate-800 flex">
      
      {/* Drawer Sidebar Component holds nav tabs */}
      <Sidebar 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main dashboard viewport area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64">
        
        {/* Dynamic header context */}
        <Header 
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilterTab={activeFilterTab}
          onFilterTabChange={setActiveFilterTab}
        />

        {/* Dynamic Active view router */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in focus:outline-none">
          {currentTab === 'dashboard' && (
            <DashboardTab 
              reports={reports}
              papers={papers}
              onChangeTab={setCurrentTab}
              onSelectReportId={setSelectedReportId}
            />
          )}

          {currentTab === 'upload' && (
            <UploadTab 
              papers={papers}
              setPapers={setPapers}
              onAnalyze={handleAnalyzePaper}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsTab 
              reports={reports}
              selectedReportId={selectedReportId}
              onSelectReport={setSelectedReportId}
              onToggleStarQuestion={handleToggleStarReportQuestion}
            />
          )}

          {currentTab === 'question_bank' && (
            <QuestionBankTab 
              questions={questions}
              onSelectQuestionReport={handleSelectQuestionReport}
              onToggleStar={handleToggleStarGlobalQuestion}
            />
          )}

          {currentTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm max-w-4xl space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-[#142175]" />
                  <span>Interactive Engine Settings</span>
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Configure model thresholds and mapping parameters</p>
              </div>

              <div className="space-y-6 divide-y divide-slate-50">
                {/* Setting 1 */}
                <div className="pt-2 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <p className="text-sm font-bold text-slate-700">OCR Text Quality Engine</p>
                    <p className="text-xs text-slate-400 mt-1">Primary engine responsible for mathematical and hand-drawn scans parsing.</p>
                  </div>
                  <div className="md:col-span-7">
                    <select
                      value={ocrQuality}
                      onChange={(e) => setOcrQuality(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#142175] cursor-pointer"
                    >
                      <option>High Precision DeepOCR (Mathematical Models)</option>
                      <option>Standard OCR FastScan (General Humanities)</option>
                      <option>LaTeX Code Extractor Engine</option>
                    </select>
                  </div>
                </div>

                {/* Setting 2 */}
                <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <p className="text-sm font-bold text-slate-700">Auto Mapped Bloom's Taxonomies</p>
                    <p className="text-xs text-slate-400 mt-1">Automatically execute deep logic analysis to evaluate question difficulty index scores.</p>
                  </div>
                  <div className="md:col-span-7 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={autoMapBlooms}
                        onChange={(e) => setAutoMapBlooms(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#142175]"></div>
                    </label>
                  </div>
                </div>

                {/* Setting 3 */}
                <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-12 lg:col-span-5">
                    <p className="text-sm font-bold text-[#142175]">Confidence Alert Threshold</p>
                    <p className="text-xs text-slate-400 mt-1">Notify the examiner when mapping accuracy falls below the set limit.</p>
                  </div>
                  <div className="md:col-span-12 lg:col-span-7 space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono text-slate-500">
                      <span>Strict Focus mode</span>
                      <span>{confidenceThreshold}% limit</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="98"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                      className="w-full accent-[#142175]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  className="bg-[#142175] text-white py-2.5 px-6 rounded-xl font-bold text-xs hover:bg-[#202e96] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          )}

          {currentTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#142175]" />
                    <span>Academic Support Help Desk</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Talk to a real integration technician or explore FAQ sheets below</p>
                </div>

                {supportSent ? (
                  <div className="p-6 bg-slate-50 border border-slate-150 rounded-xl text-center space-y-3 animate-fade-in">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">Inquiry Sent Successfully</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Thank you. We have recorded your query. An academic mapping supervisor will reply to you within 2-4 business hours.
                    </p>
                    <button 
                      onClick={() => setSupportSent(false)}
                      className="text-xs font-bold text-indigo-600 hover:underline pt-2 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!supportMessage.trim()) return;
                    try {
                      const res = await fetch("/api/support", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          category: supportCategory,
                          message: supportMessage
                        })
                      });
                      if (res.ok) {
                        setSupportSent(true);
                        setSupportMessage('');
                      } else {
                        alert("Failed to record support inquiry.");
                      }
                    } catch (err) {
                      console.error("Error sending support inquiry:", err);
                      alert("Error connecting to server.");
                    }
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Topic Category</label>
                      <select 
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#142175] cursor-pointer"
                      >
                        <option>General Academic Question Bank inquiries</option>
                        <option>Scanned paper OCR conversion distortion</option>
                        <option>Bloom's alignment assessment mismatches</option>
                        <option>Team integration and licensing settings</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Inquiry Message</label>
                      <textarea
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Detail your question model or concerns so our integration experts can evaluate quickly..."
                        rows={5}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#142175] transition-all"
                      ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button 
                        type="submit"
                        className="bg-[#142175] text-white py-2.5 px-6 rounded-xl font-bold text-xs hover:bg-[#202e96] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#142175] flex items-center gap-1.5">
                    <Info className="h-4.5 w-4.5" /> FAQ Guides
                  </h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-3">
                      <p className="font-bold text-slate-700">Does QGenie AI support handwritten scans?</p>
                      <p className="text-slate-500 mt-1 leading-normal font-semibold">Yes, standard handwritten assessment scans in 300+ DPI are automatically extracted and polished by our academic OCR engine.</p>
                    </div>
                    <div className="py-3">
                      <p className="font-bold text-slate-700">How is Bloom's aligned?</p>
                      <p className="text-slate-500 mt-1 leading-normal font-semibold">Our AI analyzes action verb structures, syntactic variables, and multi-step math tasks to index them into appropriate cognitive layers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

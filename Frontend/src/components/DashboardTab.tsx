import { 
  Sparkles, 
  ArrowRight, 
  CloudUpload, 
  BookOpen, 
  BarChart2, 
  HelpCircle,
  Clock,
  TrendingUp,
  Brain,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Page, Report, AcademicPaper } from '../types';

interface DashboardTabProps {
  reports: Report[];
  papers: AcademicPaper[];
  onChangeTab: (tab: Page) => void;
  onSelectReportId: (id: string) => void;
}

export default function DashboardTab({ reports, papers, onChangeTab, onSelectReportId }: DashboardTabProps) {
  
  const handleViewReport = (reportId: string) => {
    onSelectReportId(reportId);
    onChangeTab('reports');
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial displaying header banner */}
      <div className="p-8 bg-gradient-to-r from-[#142175] to-[#2b3ba4] text-white rounded-2xl relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,40 70,20 100,100 L100,0 Z" fill="white"></path>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Active Platform
          </div>
          <h2 className="text-2xl font-bold tracking-tight">QGenie AI Academic Dashboard</h2>
          <p className="text-xs text-indigo-100 font-semibold leading-relaxed">
            Welcome back, Dr. Julian Dash. You have processed 24 question papers. All mapped taxonomy alignments look consistent.
          </p>
          
          <div className="pt-2">
            <button 
              onClick={() => onChangeTab('upload')}
              className="bg-white text-[#142175] py-2 px-5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <span>Upload papers</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Stats bento grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-xl bg-indigo-50 text-[#142175]">
            <CloudUpload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Loaded PDF Papers</p>
            <h4 className="text-xl font-black text-slate-800 mt-1">{papers.length}</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3 pending assessments</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[#0.5rem] p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-xl bg-violet-50 text-violet-600">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cognitive Index</p>
            <h4 className="text-xl font-black text-slate-800 mt-1">82% Match</h4>
            <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">Meets Bloom's benchmarks</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-xl bg-amber-50 text-amber-500">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Analysis Quality</p>
            <h4 className="text-xl font-black text-slate-800 mt-1">High Accuracy</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reviewed by Dr. Dash</p>
          </div>
        </div>

      </div>

      {/* Split details column list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent reports list table element */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">Recent Analyzed Assessments</h4>
            <button 
              onClick={() => onChangeTab('reports')}
              className="text-xs font-bold text-[#142175] hover:underline"
            >
              See all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <div key={report.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 hover:text-[#142175] cursor-pointer" onClick={() => handleViewReport(report.id)}>
                    {report.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {report.faculty} &bull; {report.semester}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-600">{report.questionCount} Questions Mapped</p>
                    <p className="text-[10px] font-bold text-indigo-500">{report.bloomsDistribution.score}% Alignment</p>
                  </div>
                  
                  <button 
                    onClick={() => handleViewReport(report.id)}
                    className="p-2 border border-slate-200 text-[#142175] rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    title="View report"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course subjects directory taxonomy overview */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Course Subject Alignment</h4>
          
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Natural Sciences</span>
                <span>82% Mapped</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-[#142175] h-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Mathematics & Eng</span>
                <span>74% Mapped</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-[#142175] h-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Humanities & Social</span>
                <span>65% Mapped</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-[#142175] h-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

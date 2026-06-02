import { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  HelpCircle, 
  Calendar, 
  User, 
  ChevronRight,
  ChevronLeft,
  BookOpen,
  BrainCircuit,
  Award,
  Link,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  ChevronDown
} from 'lucide-react';
import { Question } from '../types';

interface QuestionBankTabProps {
  questions: Question[];
  onSelectQuestionReport: (paperName: string) => void;
  onToggleStar: (id: string) => void;
}

export default function QuestionBankTab({ 
  questions, 
  onSelectQuestionReport,
  onToggleStar
}: QuestionBankTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All Levels');
  const [bloomFilter, setBloomFilter] = useState('All Taxonomy');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [currentPage, setCurrentPage] = useState(1);

  // Subject options
  const subjectOptions = ['All Subjects', 'Natural Sciences', 'Quantum Mechanics', 'Macroeconomics', 'Genetics & Bioethics', 'Mathematics & Engineering'];
  const difficultyOptions = ['All Levels', 'Easy', 'Medium', 'Hard', 'Difficulty: 3/10', 'Difficulty: 8/10', 'Difficulty: 9/10'];
  const bloomOptions = ['All Taxonomy', 'Apply', 'Evaluate', 'Analyze', 'Understanding', 'Evaluating', 'Analyzing'];

  // Global filtered questions list
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const qText = q.text.toLowerCase();
      const qCode = (q.code || '').toLowerCase();
      const qTopic = q.topic.toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = qText.includes(query) || qCode.includes(query) || qTopic.includes(query);
      
      const matchesDifficulty = difficultyFilter === 'All Levels' || 
                                q.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase().replace('all levels', '')) ||
                                (difficultyFilter === 'Easy' && q.difficulty === 'Easy') ||
                                (difficultyFilter === 'Medium' && q.difficulty === 'Medium') ||
                                (difficultyFilter === 'Hard' && q.difficulty === 'Hard');

      const matchesBloom = bloomFilter === 'All Taxonomy' || 
                           q.taxonomy.toLowerCase().includes(bloomFilter.toLowerCase().replace('all taxonomy', '')) ||
                           (bloomFilter === 'Apply' && q.taxonomy === 'Apply') ||
                           (bloomFilter === 'Evaluate' && q.taxonomy === 'Evaluate') ||
                           (bloomFilter === 'Analyze' && q.taxonomy === 'Analyze');

      const matchesSubject = subjectFilter === 'All Subjects' || 
                             q.topic.toLowerCase().includes(subjectFilter.toLowerCase().replace('all subjects', '')) ||
                             (subjectFilter === 'Mathematics & Engineering' && q.topic.includes('Calculus')) ||
                             (subjectFilter === 'Quantum Mechanics' && q.topic.includes('Quantum')) ||
                             (subjectFilter === 'Macroeconomics' && q.topic.includes('Econ')) ||
                             (subjectFilter === 'Genetics & Bioethics' && q.topic.includes('Genetics')) ||
                             (subjectFilter === 'Natural Sciences' && q.topic.includes('Thermodynamics'));

      return matchesSearch && matchesDifficulty && matchesBloom && matchesSubject;
    });
  }, [questions, searchQuery, difficultyFilter, bloomFilter, subjectFilter]);

  // Aggregate Metrics based on the list
  const metrics = useMemo(() => {
    const totalCount = filteredQuestions.length;
    const starredCount = filteredQuestions.filter(q => q.isStarred).length;
    
    // Cognitive Peak assessment finding frequency
    const taxonomyCounts: Record<string, number> = {};
    filteredQuestions.forEach(q => {
      const raw = q.taxonomy;
      taxonomyCounts[raw] = (taxonomyCounts[raw] || 0) + 1;
    });
    let peak = 'Analyzing';
    let max = 0;
    Object.entries(taxonomyCounts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        peak = k;
      }
    });

    const flaggedCount = filteredQuestions.filter(q => q.warning).length;

    return {
      peak,
      avgDifficulty: totalCount > 0 ? "6.8 / 10" : "0 / 10",
      papersLinked: "42",
      flagged: totalCount > 0 ? "14" : "0", 
    };
  }, [filteredQuestions]);

  const handleFullAnalysis = (q: Question) => {
    // Navigate to Reports view prefilled with standard topic
    if (q.code?.includes('PHYS')) {
      onSelectQuestionReport('paper-4'); // physics report ID
    } else {
      onSelectQuestionReport('paper-1'); // calculus/thermodynamics report ID
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top filter dropbar row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Question Bank</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Browsing 1,248 analyzed academic questions across 24 papers.
          </p>
        </div>

        {/* Triple standard select drop lists match screen 3 perfectly */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#142175] w-44"
            />
          </div>

          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Difficulty</p>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:border-[#142175] cursor-pointer"
            >
              {difficultyOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Bloom's Level</p>
            <select
              value={bloomFilter}
              onChange={(e) => setBloomFilter(e.target.value)}
              className="px-3.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:border-[#142175] cursor-pointer"
            >
              {bloomOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Subject</p>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:border-[#142175] cursor-pointer"
            >
              {subjectOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 4 columns stats metric grids */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Cognitive Peak */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-violet-50 text-violet-600">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cognitive Peak</p>
            <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{metrics.peak}</h4>
          </div>
        </div>

        {/* Metric 2: Avg difficulty */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-[#142175]/5 text-[#142175]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Difficulty</p>
            <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{metrics.avgDifficulty}</h4>
          </div>
        </div>

        {/* Metric 3: Papers Linked */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-teal-50 text-teal-600">
            <Link className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Papers Linked</p>
            <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{metrics.papersLinked}</h4>
          </div>
        </div>

        {/* Metric 4: Flagged Items */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flagged Items</p>
            <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{metrics.flagged}</h4>
          </div>
        </div>
      </div>

      {/* Main filter list items box */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl text-slate-400">
            <HelpCircle className="h-10 w-10 mx-auto text-slate-300 mb-2 pointer-events-none" />
            <p className="text-xs font-semibold">No questions found matching your filter criteria.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const hasWarning = !!q.warning;
            const borderAccentClass = hasWarning ? 'border-amber-500' : 'border-[#142175]';

            return (
              <div 
                key={q.id}
                className={`border-l-4 ${borderAccentClass} bg-white rounded-r-2xl border-y border-r border-slate-100 p-6 flex justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="space-y-4 flex-1">
                  
                  {/* Top categories and keys */}
                  <div className="flex items-center gap-2 flex-wrap text-[10px] font-extrabold uppercase tracking-wider">
                    <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200/60 text-slate-700">
                      {q.code || "MATH-302"}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50/50 rounded text-[#142175]">
                      {q.taxonomy}
                    </span>
                    <span className="text-slate-400 font-bold">
                      {q.difficulty}
                    </span>

                    {hasWarning && (
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-150 flex items-center gap-1">
                        ⚠️ {q.warning}
                      </span>
                    )}
                  </div>

                  {/* Bold central problem stem statement */}
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    {q.text}
                  </p>

                  <p className="text-xs text-slate-500 leading-normal font-semibold">
                    {q.aiInsights ? (q.aiInsights.length > 180 ? `${q.aiInsights.substring(0, 180)}...` : q.aiInsights) : "Requires in-depth analysis parameters."}
                  </p>

                  {/* Footer metadata alignment */}
                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{q.date || "May 2024 Final"}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{q.lecturer || "Prof. Schmidt"}</span>
                    </span>
                  </div>
                </div>

                {/* Right sidebar quick triggers */}
                <div className="flex flex-col justify-between items-end gap-4 shrink-0">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => onToggleStar(q.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-amber-500 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Star className={`h-4.5 w-4.5 ${q.isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  <button 
                    onClick={() => handleFullAnalysis(q)}
                    className="text-xs font-bold text-[#142175] hover:text-[#25339c] flex items-center gap-0.5 group transition-all mt-4 cursor-pointer"
                  >
                    <span>Full Analysis</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination component exactly matching third screenshot */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-400">
          Showing 1 to {filteredQuestions.length} of 1,248 questions
        </span>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button className="h-9 w-9 bg-[#142175] text-white rounded-xl text-xs font-bold shadow-sm">
            1
          </button>
          
          <button className="h-9 w-9 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
            2
          </button>

          <button className="h-9 w-9 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
            3
          </button>

          <span className="px-1.5 text-xs font-bold text-slate-400 tracking-widest">...</span>

          <button className="h-9 w-9 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
            63
          </button>

          <button 
            onClick={() => {
              alert("Jumped to next page.");
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

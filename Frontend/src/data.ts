import { Report, AcademicPaper, Question } from './types';

export const INITIAL_PAPERS: AcademicPaper[] = [
  {
    id: 'paper-1',
    name: 'Advanced_Calculus_Final_2023.pdf',
    size: '2.4 MB',
    status: 'completed',
    progress: 100,
    subject: 'Mathematics & Engineering',
    bloomAnalysis: true,
    uploadedAt: '2024-05-15'
  },
  {
    id: 'paper-2',
    name: 'Modern_History_Midterm.pdf',
    size: '1.8 MB',
    status: 'uploading',
    progress: 65,
    subject: 'Humanities & Social Sciences',
    bloomAnalysis: true,
    uploadedAt: '2024-06-01'
  },
  {
    id: 'paper-3',
    name: 'Organic_Chemistry_Unit_Test.pdf',
    size: '4.1 MB',
    status: 'waiting',
    progress: 0,
    subject: 'Natural Sciences',
    bloomAnalysis: false,
    uploadedAt: '2024-06-02'
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'report-1',
    paperId: 'paper-1',
    reportId: '#99281',
    title: 'Advanced Thermodynamics Final Examination',
    faculty: 'Faculty of Engineering',
    semester: 'Semester 2, 2024',
    aiSummary: 'The assessment demonstrates a strong emphasis on conceptual understanding and application-based problem solving. Topics related to Entropy and Heat Exchange show high engagement, while Question 4 has a high difficulty index that may require review.',
    questionCount: 24,
    avgDifficulty: 'Medium',
    difficultyProfile: {
      hard: 25,
      medium: 50,
      easy: 25
    },
    bloomsDistribution: {
      apply: 50,
      evaluate: 20,
      analyze: 30,
      score: 82
    },
    topicDistribution: [
      { topic: 'Laws of Thermodynamics', percentage: 42, questionsCount: 10, isMajor: true },
      { topic: 'Phase Transitions', percentage: 28, questionsCount: 7, isMajor: true },
      { topic: 'Entropy Dynamics', percentage: 18, questionsCount: 4, isMajor: false },
      { topic: 'Heat Cycles', percentage: 12, questionsCount: 3, isMajor: false }
    ],
    questions: [
      {
        id: 'q-1-1',
        number: 1,
        topic: 'Laws of Thermodynamics',
        difficulty: 'Easy',
        taxonomy: 'Apply',
        text: 'Calculate the entropy change when 2.0 moles of an ideal gas expand isothermally and reversibly from 10 L to 20 L at 298 K.',
        aiInsights: 'Classic application of the second law. Most students should master this within the first 2 weeks. Strong alignment with core curriculum objectives.',
        isStarred: false
      },
      {
        id: 'q-1-2',
        number: 2,
        topic: 'Heat Cycles',
        difficulty: 'Hard',
        taxonomy: 'Evaluate',
        text: 'Critically evaluate the efficiency limitations of a Carnot engine in real-world high-temperature industrial environments.',
        aiInsights: 'High cognitive demand. Requires synthesis of theoretical limits vs practical engineering constraints. Good differentiator for top-tier students.',
        isStarred: true
      },
      {
        id: 'q-1-3',
        number: 3,
        topic: 'Phase Transitions',
        difficulty: 'Medium',
        taxonomy: 'Analyze',
        text: 'Illustrate the triple point on a P-T diagram for water and explain why solid water (ice) is less dense than liquid water.',
        aiInsights: 'Requires visualization and conceptual linkage between molecular structure and macroscopic properties.',
        isStarred: false
      },
      {
        id: 'q-1-4',
        number: 4,
        topic: 'Entropy Dynamics',
        difficulty: 'Hard',
        taxonomy: 'Analyze',
        text: 'Prove that the entropy of an isolated system always increases in an irreversible process and explain the statistical interpretation of this law.',
        aiInsights: 'High student confusion historically observed here. Focus on the distinction between thermodynamic equilibrium states and microstates.',
        isStarred: false
      },
      {
        id: 'q-1-5',
        number: 5,
        topic: 'Laws of Thermodynamics',
        difficulty: 'Medium',
        taxonomy: 'Evaluate',
        text: 'Compare and contrast the Kelvin-Planck and Clausius statements of the second law of thermodynamics. Demonstrate their equivalence mathematically.',
        aiInsights: 'Ensures fundamental logical soundness. Excellent query for checking syntactic proof capability of students.',
        isStarred: false
      }
    ]
  },
  {
    id: 'report-2',
    paperId: 'paper-4',
    reportId: '#99144',
    title: 'Introductory Quantum Physics Exam',
    faculty: 'Faculty of Science',
    semester: 'Semester 1, 2024',
    aiSummary: 'The questions thoroughly query fundamental wave-particle duality and the Schrodinger equation. Cognitive load leans heavily towards "Analyze". Suggest balancing with simpler computational problems.',
    questionCount: 15,
    avgDifficulty: 'Hard',
    difficultyProfile: {
      hard: 60,
      medium: 30,
      easy: 10
    },
    bloomsDistribution: {
      apply: 30,
      evaluate: 10,
      analyze: 60,
      score: 74
    },
    topicDistribution: [
      { topic: 'Wave-Particle Duality', percentage: 50, questionsCount: 8, isMajor: true },
      { topic: 'Schrodinger Equation', percentage: 35, questionsCount: 5, isMajor: true },
      { topic: 'Quantum Tunnelling', percentage: 15, questionsCount: 2, isMajor: false }
    ],
    questions: [
      {
        id: 'q-2-1',
        number: 1,
        topic: 'Wave-Particle Duality',
        difficulty: 'Medium',
        taxonomy: 'Apply',
        text: 'Determine the de Broglie wavelength of an electron accelerated from rest through a potential difference of 100V.',
        aiInsights: 'Standard calculator-only retrieval problem. Very high success-rate expectation.'
      },
      {
        id: 'q-2-2',
        number: 2,
        topic: 'Schrodinger Equation',
        difficulty: 'Hard',
        taxonomy: 'Analyze',
        text: 'Describe the role of superposition in quantum gate operations for a Shor\'s algorithm implementation.',
        aiInsights: 'Excellent synthesis. Demands both algebraic grasp of quantum registers and computer science complex mapping.'
      }
    ]
  }
];

export const QUESTION_BANK_DATA: Question[] = [
  {
    id: 'qb-1',
    code: 'PHYS-204',
    topic: 'Quantum Mechanics',
    difficulty: 'Difficulty: 8/10',
    taxonomy: 'Analyzing',
    text: 'Describe the role of superposition in quantum gate operations for a Shor\'s algorithm implementation.',
    aiInsights: 'The question requires the candidate to synthesize knowledge of quantum mechanics and computational complexity...',
    date: 'May 2024 Final',
    lecturer: 'Prof. Schmidt',
    isStarred: false
  },
  {
    id: 'qb-2',
    code: 'ECON-101',
    topic: 'Macroeconomics',
    difficulty: 'Difficulty: 3/10',
    taxonomy: 'Understanding',
    text: 'Contrast the differences between a supply-side and demand-side economic shock during a global pandemic.',
    aiInsights: 'This question tests foundational macro-economic principles with a contemporary application...',
    date: 'Intro to Econ 2023',
    lecturer: 'Dr. Aris Thorne',
    isStarred: true
  },
  {
    id: 'qb-3',
    code: 'BIO-305',
    topic: 'Genetics & Bioethics',
    difficulty: 'Difficulty: 9/10',
    taxonomy: 'Evaluating',
    warning: 'Ambiguous phrasing',
    text: 'Evaluate the ethical implications of CRISPR-Cas9 in germline editing versus somatic cell therapy.',
    aiInsights: 'High-level evaluative question requiring complex moral and biological reasoning frameworks...',
    date: 'Bio-Ethics Seminar',
    lecturer: 'Prof. Li',
    isStarred: false
  }
];

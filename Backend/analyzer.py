import os
import json
import pdfplumber
from typing import List, Optional
from pydantic import BaseModel
from google import genai
from google.genai import types

# ----------------- PYDANTIC SCHEMAS FOR STRUCTURED OUTPUT -----------------

class BloomTaxonomyDistribution(BaseModel):
    apply: int
    evaluate: int
    analyze: int
    score: int # overall alignment percentage match (e.g. 0 to 100)

class DifficultyProfile(BaseModel):
    hard: int
    medium: int
    easy: int

class TopicDistributionItem(BaseModel):
    topic: str
    percentage: int
    questionsCount: int
    isMajor: bool

class QuestionDetails(BaseModel):
    number: int
    topic: str
    difficulty: str  # Easy, Medium, Hard
    taxonomy: str    # Remember, Understand, Apply, Analyze, Evaluate, Create
    text: str
    aiInsights: str
    warning: Optional[str] = None

class PaperAnalysisResult(BaseModel):
    title: str
    faculty: str
    semester: str
    aiSummary: str
    questionCount: int
    avgDifficulty: str  # Easy, Medium, Hard
    difficultyProfile: DifficultyProfile
    bloomsDistribution: BloomTaxonomyDistribution
    topicDistribution: List[TopicDistributionItem]
    questions: List[QuestionDetails]

# ----------------- PDF TEXT EXTRACTION -----------------

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF file using pdfplumber with a fallback to pypdf.
    """
    text = ""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
        
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber extraction failed: {e}. Falling back to pypdf.")
        try:
            from pypdf import PdfReader
            reader = PdfReader(pdf_path)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e_inner:
            print(f"Fallback pypdf extraction also failed: {e_inner}")
            
    return text.strip()

# ----------------- GEMINI ANALYSIS PIPELINE -----------------

def analyze_question_paper(pdf_text: str, subject_taxonomy: str, bloom_analysis_enabled: bool) -> PaperAnalysisResult:
    """
    Sends the extracted question paper text to the Gemini API and parses the response
    into a structured PaperAnalysisResult object.
    """
    # 1. Initialize the GenAI Client
    # It automatically retrieves the GEMINI_API_KEY from environment variables
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please configure it in your secrets/environment.")
        
    client = genai.Client(api_key=api_key)
    
    # 2. Build the detailed instruction prompt
    prompt = f"""
    You are an expert academic evaluator, university dean, and pedagogy specialist.
    Analyze the following extracted text of an academic question paper and evaluate it thoroughly under the "{subject_taxonomy}" subject guidelines.
    
    Instructions:
    1. Parse and extract every single question from the paper. List them sequentially.
    2. Determine the core topic of each question.
    3. Classify the difficulty level of each question: "Easy", "Medium", or "Hard".
    4. Categorize the cognitive skill level of each question in Bloom's Taxonomy:
       "Remember", "Understand", "Apply", "Analyze", "Evaluate", or "Create".
    5. Write high-quality, professional educational "aiInsights" for each question.
       - Comment on what cognitive skill it tests, core standard alignments, or potential student misconceptions.
    6. Identify any potential ambiguity warnings (e.g. confusing wording, logical flaws, missing parameters) and put it in "warning" (set to null if perfectly clear).
    7. Generate aggregate evaluation metrics:
       - title: Infer the exam title (e.g. "Laws of Thermodynamics Final Examination" or "General Chemistry Midterm").
       - faculty: Infer or set an appropriate faculty (e.g. "Faculty of Science" or "Faculty of Engineering").
       - semester: Infer or set the semester/year (e.g. "Semester 2, 2024").
       - aiSummary: A concise, executive-level summary of the entire exam paper's quality, cognitive balance, and recommendations.
       - questionCount: Total number of questions parsed.
       - avgDifficulty: The overall average difficulty level (Easy, Medium, Hard).
       - difficultyProfile: The percentage of questions that are hard, medium, and easy (sum of hard+medium+easy must equal 100).
       - bloomsDistribution:
         - apply: The percentage of questions mapping to the 'Apply' taxonomy level.
         - evaluate: The percentage of questions mapping to the 'Evaluate' taxonomy level.
         - analyze: The percentage of questions mapping to the 'Analyze' taxonomy level.
         - score: Overall cognitive alignment score (0-100%). If bloom_analysis_enabled is false, you can set this to 0.
       - topicDistribution: List major and minor topics. Calculate their percentages and question counts. Identify major topics (usually topic percentage >= 25%).
    
    Bloom's Analysis Enabled setting: {bloom_analysis_enabled}
    
    Extracted Exam Paper Text:
    ---
    {pdf_text}
    ---
    """
    
    # 3. Call the Gemini API with Structured Output Configuration
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PaperAnalysisResult,
            temperature=0.1
        )
    )
    
    # 4. Parse the result from JSON
    try:
        data = json.loads(response.text)
        # Parse it into the Pydantic model to validate structure
        validated_result = PaperAnalysisResult.model_validate(data)
        return validated_result
    except Exception as e:
        print(f"Error validating structured output: {e}. Raw response: {response.text}")
        raise ValueError(f"AI returned invalid structured data: {e}")

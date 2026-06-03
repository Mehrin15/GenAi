from fpdf import FPDF
import io
import datetime

class QGeniePDF(FPDF):
    def __init__(self, title_text, faculty, semester, report_id):
        super().__init__()
        self.title_text = title_text
        self.faculty = faculty
        self.semester = semester
        self.report_id = report_id

    def header(self):
        # Header banner
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(20, 33, 117) # #142175
        self.cell(0, 8, "QGENIE AI - ACADEMIC QUESTION PAPER QUALITY AUDIT REPORT", ln=True, align="L")
        self.set_font("Helvetica", "", 7)
        self.set_text_color(100, 116, 139) # slate gray
        self.cell(0, 4, f"Report ID: {self.report_id} | Generated on: {datetime.date.today().strftime('%Y-%m-%d')}", ln=True, align="L")
        self.ln(2)
        # Accent rule line
        self.set_draw_color(20, 33, 117)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 7)
        self.set_text_color(148, 163, 184)
        self.set_draw_color(226, 232, 240)
        self.line(10, self.get_y() - 2, 200, self.get_y() - 2)
        # Page numbering
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}} | Confidential Academic Quality Assessment", align="C")

def generate_pdf_report(report_data: dict) -> bytes:
    """
    Generates a PDF bytes object representing the visual quality report.
    """
    title = report_data.get("title", "Exam Assessment Quality Audit")
    faculty = report_data.get("faculty", "N/A")
    semester = report_data.get("semester", "N/A")
    report_no = report_data.get("reportId", "#00000")
    
    pdf = QGeniePDF(title, faculty, semester, report_no)
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # 1. Main Cover Info Block
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59) # Slate 800
    pdf.multi_cell(0, 8, title)
    
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(20, 33, 117) # Deep Blue
    pdf.cell(0, 6, f"{faculty}  |  {semester}", ln=True)
    pdf.ln(4)
    
    # 2. Executive AI Summary Box (Shaded background)
    pdf.set_fill_color(247, 250, 252) # light gray/blue
    pdf.set_draw_color(20, 33, 117)
    pdf.set_line_width(0.5)
    
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(20, 33, 117)
    pdf.cell(0, 6, "EXECUTIVE AI SUMMARY", ln=True, fill=True)
    
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(51, 65, 85) # Slate 700
    summary_text = report_data.get("aiSummary", "No summary generated.")
    # Calculate box height based on length
    pdf.multi_cell(0, 5, summary_text, fill=True, border="L")
    pdf.ln(6)
    
    # 3. High-level Statistics Tables
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 6, "METRIC ANALYSIS OVERVIEW", ln=True)
    pdf.ln(2)
    
    # Simple table headers
    pdf.set_fill_color(241, 245, 249)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(60, 6, "Evaluation Criteria", border=1, fill=True)
    pdf.cell(130, 6, "Audit Status / Score Mapping", border=1, fill=True, ln=True)
    
    # Table rows
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(60, 6, "Total Questions Mapped", border=1)
    pdf.cell(130, 6, f"  {report_data.get('questionCount', 0)} questions extracted", border=1, ln=True)
    
    pdf.cell(60, 6, "Average Paper Difficulty", border=1)
    pdf.cell(130, 6, f"  {report_data.get('avgDifficulty', 'Medium')}", border=1, ln=True)
    
    blooms = report_data.get("bloomsDistribution", {})
    pdf.cell(60, 6, "Bloom's Taxonomy Score", border=1)
    pdf.cell(130, 6, f"  {blooms.get('score', 0)}% Benchmark Alignment Score", border=1, ln=True)
    
    pdf.ln(6)
    
    # 4. Difficulty Profile & Bloom's Distribution
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "COMPLEXITY PROFILE & BLOOM'S TAXONOMY BREAKDOWN", ln=True)
    pdf.ln(2)
    
    diff = report_data.get("difficultyProfile", {})
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(95, 6, f"Difficulty:  Easy: {diff.get('easy', 0)}%   |   Medium: {diff.get('medium', 0)}%   |   Hard: {diff.get('hard', 0)}%", border=1)
    pdf.cell(5) # spacer
    pdf.cell(90, 6, f"Bloom's:  Apply: {blooms.get('apply', 0)}%   |   Analyze: {blooms.get('analyze', 0)}%   |   Evaluate: {blooms.get('evaluate', 0)}%", border=1, ln=True)
    
    pdf.ln(6)
    
    # 5. Topic Distribution
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "TOPIC COVERAGE DISTRIBUTION", ln=True)
    pdf.ln(2)
    
    pdf.set_fill_color(241, 245, 249)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(100, 6, "Topic Area", border=1, fill=True)
    pdf.cell(30, 6, "Percentage", border=1, fill=True, align="C")
    pdf.cell(30, 6, "Question Count", border=1, fill=True, align="C")
    pdf.cell(30, 6, "Taxonomy Weight", border=1, fill=True, align="C", ln=True)
    
    pdf.set_font("Helvetica", "", 9)
    for topic in report_data.get("topicDistribution", []):
        weight = "Major Topic" if topic.get("isMajor", False) else "Minor Topic"
        pdf.cell(100, 6, f" {topic.get('topic', 'General')}", border=1)
        pdf.cell(30, 6, f"{topic.get('percentage', 0)}%", border=1, align="C")
        pdf.cell(30, 6, f"{topic.get('questionsCount', 0)} Qs", border=1, align="C")
        pdf.cell(30, 6, weight, border=1, align="C", ln=True)
        
    pdf.ln(8)
    
    # 6. Detailed Question Analysis
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(20, 33, 117)
    pdf.cell(0, 6, "DETAILED QUESTION QUALITY AUDIT", ln=True)
    pdf.set_text_color(30, 41, 59)
    pdf.ln(2)
    
    pdf.set_font("Helvetica", "", 9)
    for idx, q in enumerate(report_data.get("questions", [])):
        # Check space before adding new question to prevent orphan headers
        if pdf.get_y() > 240:
            pdf.add_page()
            
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(20, 33, 117)
        pdf.cell(10, 6, f"Q{q.get('number', idx + 1)}")
        
        # Tags line
        pdf.set_font("Helvetica", "B", 8)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(180, 6, f"Topic: {q.get('topic')}   |   Difficulty: {q.get('difficulty')}   |   Taxonomy: {q.get('taxonomy')}", ln=True)
        
        # Question Text
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(30, 41, 59)
        pdf.multi_cell(0, 5, q.get("text", ""))
        
        # AI Insights block
        pdf.set_fill_color(248, 250, 252)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(71, 85, 105)
        insights = f"AI Insight: {q.get('aiInsights', '')}"
        if q.get("warning"):
            insights += f"\nWarning: {q.get('warning')}"
        pdf.multi_cell(0, 4.5, insights, fill=True, border="L")
        
        pdf.ln(4)
        
    # Output PDF as a byte string
    pdf_bytes = pdf.output()
    return pdf_bytes


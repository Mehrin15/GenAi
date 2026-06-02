import google.generativeai as genai
from pdf_extractor import extract_text
import os
API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

# Extract text from PDF
question_text = extract_text("sample_question_paper.pdf")

prompt = f"""
Analyze the question paper.

Return ONLY valid JSON.

Format:

{{
  "difficulty": "",
  "blooms_taxonomy": {{
    "Remember": 0,
    "Understand": 0,
    "Apply": 0,
    "Analyze": 0,
    "Evaluate": 0,
    "Create": 0
  }},
  "topics": [],
  "suggestions": []
}}

Question Paper:

{question_text}
"""

response = model.generate_content(prompt)

print(response.text)
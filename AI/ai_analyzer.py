import google.generativeai as genai
from pdf_extractor import extract_text
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_question_paper(pdf_path):

    question_text = extract_text(pdf_path)

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

    return response.text


if __name__ == "__main__":
    result = analyze_question_paper("sample_question_paper.pdf")
    print(result)
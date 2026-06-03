import sqlite3
import json
import os

DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "qgenie.db")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Create Papers table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS papers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        size TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER NOT NULL,
        subject TEXT NOT NULL,
        bloomAnalysis INTEGER NOT NULL,
        uploadedAt TEXT NOT NULL
    )
    """)
    
    # 2. Create Reports table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        paperId TEXT NOT NULL,
        reportId TEXT NOT NULL,
        title TEXT NOT NULL,
        faculty TEXT NOT NULL,
        semester TEXT NOT NULL,
        aiSummary TEXT NOT NULL,
        questionCount INTEGER NOT NULL,
        avgDifficulty TEXT NOT NULL,
        difficultyProfile TEXT NOT NULL, -- JSON string
        bloomsDistribution TEXT NOT NULL, -- JSON string
        topicDistribution TEXT NOT NULL -- JSON string
    )
    """)
    
    # 3. Create Questions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        reportId TEXT NOT NULL,
        number INTEGER,
        code TEXT,
        topic TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        taxonomy TEXT NOT NULL,
        text TEXT NOT NULL,
        aiInsights TEXT NOT NULL,
        warning TEXT,
        isStarred INTEGER DEFAULT 0,
        date TEXT,
        lecturer TEXT
    )
    """)
    
    # 4. Create Settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)
    
    # 5. Create Support table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS support_inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        createdAt TEXT NOT NULL
    )
    """)
    
    # Insert default settings if not exists
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("ocrQuality", "High Precision DeepOCR"))
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("autoMapBlooms", "1"))
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("confidenceThreshold", "85"))
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("defaultFaculty", "Faculty of Engineering"))
    
    conn.commit()
    conn.close()

# --- CRUD for Papers ---

def add_paper(paper_id, name, size, status, progress, subject, bloom_analysis, uploaded_at):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO papers (id, name, size, status, progress, subject, bloomAnalysis, uploadedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (paper_id, name, size, status, progress, subject, 1 if bloom_analysis else 0, uploaded_at)
    )
    conn.commit()
    conn.close()

def update_paper_status(paper_id, status, progress):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE papers SET status = ?, progress = ? WHERE id = ?",
        (status, progress, paper_id)
    )
    conn.commit()
    conn.close()

def get_all_papers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM papers ORDER BY uploadedAt DESC")
    rows = cursor.fetchall()
    conn.close()
    
    papers = []
    for r in rows:
        papers.append({
            "id": r["id"],
            "name": r["name"],
            "size": r["size"],
            "status": r["status"],
            "progress": r["progress"],
            "subject": r["subject"],
            "bloomAnalysis": bool(r["bloomAnalysis"]),
            "uploadedAt": r["uploadedAt"]
        })
    return papers

def delete_paper(paper_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM papers WHERE id = ?", (paper_id,))
    # also delete linked report and questions
    cursor.execute("SELECT id FROM reports WHERE paperId = ?", (paper_id,))
    report_row = cursor.fetchone()
    if report_row:
        report_id = report_row["id"]
        cursor.execute("DELETE FROM reports WHERE id = ?", (report_id,))
        cursor.execute("DELETE FROM questions WHERE reportId = ?", (report_id,))
    conn.commit()
    conn.close()

def clear_all_papers_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM papers")
    cursor.execute("DELETE FROM reports")
    cursor.execute("DELETE FROM questions")
    conn.commit()
    conn.close()

# --- CRUD for Reports ---

def add_report(report_id, paper_id, report_no, title, faculty, semester, ai_summary, question_count, avg_difficulty, difficulty_profile, blooms_distribution, topic_distribution):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO reports (id, paperId, reportId, title, faculty, semester, aiSummary, questionCount, avgDifficulty, difficultyProfile, bloomsDistribution, topicDistribution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            report_id, 
            paper_id, 
            report_no, 
            title, 
            faculty, 
            semester, 
            ai_summary, 
            question_count, 
            avg_difficulty, 
            json.dumps(difficulty_profile), 
            json.dumps(blooms_distribution), 
            json.dumps(topic_distribution)
        )
    )
    conn.commit()
    conn.close()

def get_all_reports():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reports ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    reports = []
    for r in rows:
        reports.append({
            "id": r["id"],
            "paperId": r["paperId"],
            "reportId": r["reportId"],
            "title": r["title"],
            "faculty": r["faculty"],
            "semester": r["semester"],
            "aiSummary": r["aiSummary"],
            "questionCount": r["questionCount"],
            "avgDifficulty": r["avgDifficulty"],
            "difficultyProfile": json.loads(r["difficultyProfile"]),
            "bloomsDistribution": json.loads(r["bloomsDistribution"]),
            "topicDistribution": json.loads(r["topicDistribution"]),
            "questions": get_questions_by_report(r["id"])
        })
    return reports

def get_report_by_id(report_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reports WHERE id = ?", (report_id,))
    r = cursor.fetchone()
    conn.close()
    
    if not r:
        return None
        
    return {
        "id": r["id"],
        "paperId": r["paperId"],
        "reportId": r["reportId"],
        "title": r["title"],
        "faculty": r["faculty"],
        "semester": r["semester"],
        "aiSummary": r["aiSummary"],
        "questionCount": r["questionCount"],
        "avgDifficulty": r["avgDifficulty"],
        "difficultyProfile": json.loads(r["difficultyProfile"]),
        "bloomsDistribution": json.loads(r["bloomsDistribution"]),
        "topicDistribution": json.loads(r["topicDistribution"]),
        "questions": get_questions_by_report(r["id"])
    }

# --- CRUD for Questions ---

def add_question(q_id, report_id, number, code, topic, difficulty, taxonomy, text, ai_insights, warning, is_starred, date, lecturer):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO questions (id, reportId, number, code, topic, difficulty, taxonomy, text, aiInsights, warning, isStarred, date, lecturer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (q_id, report_id, number, code, topic, difficulty, taxonomy, text, ai_insights, warning, 1 if is_starred else 0, date, lecturer)
    )
    conn.commit()
    conn.close()

def get_questions_by_report(report_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM questions WHERE reportId = ? ORDER BY number ASC", (report_id,))
    rows = cursor.fetchall()
    conn.close()
    
    questions = []
    for r in rows:
        questions.append({
            "id": r["id"],
            "number": r["number"],
            "code": r["code"],
            "topic": r["topic"],
            "difficulty": r["difficulty"],
            "taxonomy": r["taxonomy"],
            "text": r["text"],
            "aiInsights": r["aiInsights"],
            "warning": r["warning"],
            "isStarred": bool(r["isStarred"]),
            "date": r["date"],
            "lecturer": r["lecturer"]
        })
    return questions

def get_all_questions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT q.*, r.title as paperName FROM questions q JOIN reports r ON q.reportId = r.id ORDER BY q.id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    questions = []
    for r in rows:
        questions.append({
            "id": r["id"],
            "number": r["number"],
            "code": r["code"],
            "topic": r["topic"],
            "difficulty": r["difficulty"],
            "taxonomy": r["taxonomy"],
            "text": r["text"],
            "aiInsights": r["aiInsights"],
            "warning": r["warning"],
            "isStarred": bool(r["isStarred"]),
            "date": r["date"],
            "lecturer": r["lecturer"],
            "paperName": r["paperName"]
        })
    return questions

def toggle_star_question(q_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE questions SET isStarred = 1 - isStarred WHERE id = ?", (q_id,))
    cursor.execute("SELECT isStarred FROM questions WHERE id = ?", (q_id,))
    row = cursor.fetchone()
    new_state = bool(row["isStarred"]) if row else False
    conn.commit()
    conn.close()
    return new_state

# --- CRUD for Settings ---

def save_setting(key, value):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, str(value)))
    conn.commit()
    conn.close()

def get_all_settings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM settings")
    rows = cursor.fetchall()
    conn.close()
    
    settings = {}
    for r in rows:
        val = r["value"]
        # Convert types where appropriate
        if val == "1" or val == "0" or val.lower() == "true" or val.lower() == "false":
            settings[r["key"]] = val == "1" or val.lower() == "true"
        elif val.isdigit():
            settings[r["key"]] = int(val)
        else:
            settings[r["key"]] = val
    return settings

# --- CRUD for Support ---

def add_support_inquiry(category, message, created_at):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO support_inquiries (category, message, createdAt) VALUES (?, ?, ?)",
        (category, message, created_at)
    )
    conn.commit()
    conn.close()

# Initialize DB on import
init_db()

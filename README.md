# GURUPath AI — Adaptive Learning Prototype
**Code Kernel '26 | Team Tenet**

A demo-ready prototype for Class 8 Mathematics: Linear Equations. It includes a student Learn–Solve–Test flow, transparent rules-based adaptation, and a teacher dashboard. Demo student profiles are simulated.

## Features
- Student diagnostic quiz with prerequisite-aware recommendations.
- Rules-based mastery policy:
  - below 50%: prerequisite refresher
  - 50–79%: targeted guided practice
  - 80%+: confirmation assessment / challenge path
- Learn, Solve, Test experience with hints and feedback.
- Teacher dashboard with simulated learner profiles, concept-level progress, common error patterns, and suggested interventions.
- Responsive interface; no API key required.
- FastAPI backend exposes diagnostic/adaptation endpoints. Frontend has a local fallback so it can be demoed without starting the API.

## Run locally

### 1. Start the backend (Python 3.10+)
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API docs: http://127.0.0.1:8000/docs

### 2. Start the frontend (Node.js 18+)
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173).

If the backend is not running, the frontend still works using the same transparent client-side demo rules.

## Deploy (optional)
- Frontend: import the `frontend` folder into Vercel or Netlify. Build command: `npm run build`; output directory: `dist`.
- Backend: deploy the `backend` folder to a Python host that supports FastAPI. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- Set `VITE_API_URL` in the frontend host to the deployed backend base URL (for example, `https://your-api.example.com`). Do not include a trailing slash.
- The current prototype uses simulated/demo data and an in-memory API; it is not a production student records system.

## GitHub submission
Create a new public repository, then from this project folder:
```bash
git init
git add .
git commit -m "Build GURUPath AI adaptive learning prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/gurupath-ai.git
git push -u origin main
```
Replace the remote URL with your own repository URL.

## 3-minute demo plan
1. (0:00–0:20) Introduce GURUPath AI and the problem: students learn at different speeds.
2. (0:20–1:20) Student view: take the diagnostic, see a recommendation, open the lesson, solve a problem, and test understanding.
3. (1:20–2:20) Teacher view: compare the three simulated learners, review misconception patterns, and inspect suggested interventions.
4. (2:20–2:45) Explain transparent thresholds and teacher-in-the-loop decisions.
5. (2:45–3:00) State limitations honestly: simulated data, one topic, prototype rules not yet validated with students.

## Important demo honesty note
All teacher-dashboard sample learners and progress values are simulated. Do not present them as results from real students or claim measured learning gains.

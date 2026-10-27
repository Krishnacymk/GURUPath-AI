
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(title="GURUPath AI API", version="1.0.0",
              description="Demo API for transparent adaptive learning in Class 8 linear equations.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure explicit frontend origins before production use.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Answer(BaseModel):
    question_id: str
    correct: bool
    concept: str
    hints_used: int = 0

class DiagnosticRequest(BaseModel):
    learner_name: str = "Demo learner"
    answers: List[Answer] = Field(default_factory=list)

class AdaptationResponse(BaseModel):
    score: int
    mastery_band: str
    recommendation_title: str
    recommendation: str
    next_step: str
    concept_scores: dict

QUESTIONS = [
    {"id": "q1", "concept": "integers", "prompt": "Evaluate: −3 + 8", "answer": "5"},
    {"id": "q2", "concept": "fractions", "prompt": "Simplify: 1/2 + 1/4", "answer": "3/4"},
    {"id": "q3", "concept": "expressions", "prompt": "If x = 3, find 2x + 1", "answer": "7"},
    {"id": "q4", "concept": "equations", "prompt": "Solve: x + 5 = 12", "answer": "7"},
    {"id": "q5", "concept": "equations", "prompt": "Solve: 3x = 21", "answer": "7"},
]

@app.get("/")
def root():
    return {"name": "GURUPath AI API", "status": "ok", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "healthy", "prototype": True}

@app.get("/api/questions")
def questions():
    return QUESTIONS

@app.post("/api/adapt", response_model=AdaptationResponse)
def adapt(payload: DiagnosticRequest):
    total = len(payload.answers)
    score = round(100 * sum(1 for a in payload.answers if a.correct) / total) if total else 0
    concepts = {}
    for a in payload.answers:
        concepts.setdefault(a.concept, []).append(1 if a.correct else 0)
    concept_scores = {k: round(100 * sum(v) / len(v)) for k, v in concepts.items()}

    weak = [k for k, v in concept_scores.items() if v < 50]
    if total == 0:
        band, title, rec, step = (
            "Not assessed", "Start with a short diagnostic",
            "Answer a few questions so GURUPath can recommend a next step based on evidence.",
            "diagnostic"
        )
    elif score < 50 or weak:
        band, title, rec, step = (
            "Foundation support", "Revisit a prerequisite",
            "Your answers suggest that a short refresher may help before continuing. Try the worked example, then retry a similar question.",
            "learn"
        )
    elif score < 80:
        band, title, rec, step = (
            "Guided practice", "Practise with worked examples",
            "You have some of the idea. Use a guided example and a few targeted questions to strengthen your understanding.",
            "solve"
        )
    else:
        band, title, rec, step = (
            "Ready to confirm", "Try a mastery check",
            "Your current answers look strong. Complete a short confirmation test; if performance stays high, move to challenge problems.",
            "test"
        )
    return AdaptationResponse(score=score, mastery_band=band, recommendation_title=title,
                              recommendation=rec, next_step=step, concept_scores=concept_scores)

@app.get("/api/demo/class")
def demo_class():
    # Clearly simulated profiles for hackathon demonstration only.
    return {
        "data_label": "SIMULATED DEMO DATA",
        "learners": [
            {"name": "Aarav", "score": 92, "band": "Extension", "focus": "Multi-step equations", "action": "Offer challenge problems"},
            {"name": "Meera", "score": 68, "band": "Guided practice", "focus": "Inverse operations", "action": "Use a worked example"},
            {"name": "Kabir", "score": 36, "band": "Foundation support", "focus": "Integer operations", "action": "Review integer prerequisites"},
        ],
        "concepts": [
            {"name": "Integers", "mastery": 58},
            {"name": "Fractions", "mastery": 64},
            {"name": "Expressions", "mastery": 73},
            {"name": "Linear equations", "mastery": 61},
        ],
        "common_errors": ["Sign changes when moving terms", "Dividing only one side of an equation", "Integer addition with unlike signs"]
    }

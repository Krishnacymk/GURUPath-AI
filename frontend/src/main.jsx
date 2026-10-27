
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, BrainCircuit, CheckCircle2, ChevronRight, GraduationCap, Lightbulb, ListChecks, Menu, RotateCcw, Sparkles, Target, Users, X, ArrowRight, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "";
const questions = [
  {id:"q1", concept:"Integers", prompt:"Evaluate: −3 + 8", options:["−11","−5","5","11"], answer:"5", explain:"Start at −3 and move 8 steps to the right on the number line. You land on 5.", hint:"Imagine moving 8 places right from −3."},
  {id:"q2", concept:"Fractions", prompt:"Simplify: 1/2 + 1/4", options:["2/6","3/4","1/4","1"], answer:"3/4", explain:"Rewrite 1/2 as 2/4. Then 2/4 + 1/4 = 3/4.", hint:"Give both fractions a common denominator of 4."},
  {id:"q3", concept:"Expressions", prompt:"If x = 3, find 2x + 1", options:["5","6","7","9"], answer:"7", explain:"Substitute x = 3: 2 × 3 + 1 = 6 + 1 = 7.", hint:"Replace x with 3 before calculating."},
  {id:"q4", concept:"Linear equations", prompt:"Solve: x + 5 = 12", options:["5","7","12","17"], answer:"7", explain:"Subtract 5 from both sides: x = 12 − 5 = 7.", hint:"Undo the +5 by subtracting 5 from both sides."},
  {id:"q5", concept:"Linear equations", prompt:"Solve: 3x = 21", options:["6","7","18","24"], answer:"7", explain:"Divide both sides by 3: x = 21 ÷ 3 = 7.", hint:"Undo multiplication by 3 using division."},
];
const demoLearners = [
  {name:"Aarav", initials:"A", score:92, band:"Extension", focus:"Multi-step equations", action:"Offer challenge problems", color:"mint"},
  {name:"Meera", initials:"M", score:68, band:"Guided practice", focus:"Inverse operations", action:"Use a worked example", color:"blue"},
  {name:"Kabir", initials:"K", score:36, band:"Foundation support", focus:"Integer operations", action:"Review integer prerequisites", color:"amber"},
];
const conceptData = [{name:"Integers",value:58},{name:"Fractions",value:64},{name:"Expressions",value:73},{name:"Linear equations",value:61}];

function adapt(score, answers) {
  const weak = answers.some(a => !a.correct && ["Integers","Fractions","Expressions"].includes(a.concept));
  if (!answers.length) return {band:"Not assessed",title:"Start with a short diagnostic",desc:"Answer a few questions so your next step is based on evidence.",kind:"start"};
  if (score < 50 || weak) return {band:"Foundation support",title:"Strengthen a prerequisite",desc:"A short refresher on a foundational concept may make equations easier. Review the example, then retry.",kind:"learn"};
  if (score < 80) return {band:"Guided practice",title:"Practise with a worked example",desc:"You have part of the idea. Work through a guided example and try a few targeted questions.",kind:"solve"};
  return {band:"Ready to confirm",title:"Try a mastery check",desc:"Your answers look strong. Confirm your understanding, then move on to challenge problems if it stays consistent.",kind:"test"};
}

function App(){
  const [view,setView] = useState("student");
  const [step,setStep] = useState("home");
  const [qIndex,setQIndex] = useState(0);
  const [selected,setSelected] = useState("");
  const [answers,setAnswers] = useState([]);
  const [feedback,setFeedback] = useState(null);
  const [hint,setHint] = useState(false);
  const [toast,setToast] = useState("");
  const [mobileMenu,setMobileMenu] = useState(false);
  const [activeLearner,setActiveLearner] = useState(1);
  const score = answers.length ? Math.round(answers.filter(a=>a.correct).length/answers.length*100) : 0;
  const recommendation = useMemo(()=>adapt(score,answers),[score,answers]);
  const current = questions[qIndex % questions.length];

  async function sendDiagnostic(finalAnswers) {
    if (!API) return;
    try {
      await fetch(`${API}/api/adapt`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({learner_name:"Demo learner",answers:finalAnswers.map((a,i)=>({question_id:a.id,correct:a.correct,concept:a.concept.toLowerCase(),hints_used:a.hintsUsed||0}))})});
    } catch { /* client-side demo fallback intentionally remains usable */ }
  }
  function startQuiz(){setAnswers([]);setQIndex(0);setSelected("");setFeedback(null);setHint(false);setStep("quiz");}
  function submitAnswer(){
    if(!selected) return;
    const result={id:current.id,concept:current.concept,correct:selected===current.answer,selected,answer:current.answer,hintsUsed:hint?1:0};
    const next=[...answers,result];setAnswers(next);setFeedback(result);sendDiagnostic(next);
  }
  function nextQuestion(){
    if(qIndex+1>=questions.length){setStep("results");setFeedback(null);return;}
    setQIndex(qIndex+1);setSelected("");setFeedback(null);setHint(false);
  }
  function reset(){setStep("home");setAnswers([]);setQIndex(0);setSelected("");setFeedback(null);setHint(false);}
  const nav = <><button className={view==="student"?"nav-item active":"nav-item"} onClick={()=>{setView("student");setStep("home");setMobileMenu(false)}}><BookOpen size={17}/> Student learning</button><button className={view==="teacher"?"nav-item active":"nav-item"} onClick={()=>{setView("teacher");setStep("home");setMobileMenu(false)}}><Users size={17}/> Teacher dashboard</button></>;
  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu?"open":""}`}>
      <div className="brand"><div className="brand-mark"><BrainCircuit size={23}/></div><div><strong>GURUPath<span> AI</span></strong><small>LEARN YOUR WAY</small></div><button className="close-menu" onClick={()=>setMobileMenu(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>{nav}
      <div className="side-bottom"><div className="teacher-note"><div className="note-icon"><ShieldCheck size={18}/></div><strong>Teacher-guided by design</strong><p>Recommendations support teachers — they never replace their judgement.</p></div><div className="profile"><div className="avatar">K</div><div><strong>Demo learner</strong><small>Class 8 · Mathematics</small></div><span className="online-dot"/></div></div>
    </aside>
    {mobileMenu&&<div className="scrim" onClick={()=>setMobileMenu(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="menu-toggle" onClick={()=>setMobileMenu(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> {view==="student"?"Student learning":"Teacher dashboard"}</div><div className="top-right"><span className="status-pill"><span/> Prototype mode</span><div className="avatar small">K</div></div></header>
      {view==="teacher" ? <TeacherDashboard onStudent={()=>{setView("student");setStep("home")}}/> : <div className="page-content">
        {step==="home"&&<StudentHome onStart={startQuiz} score={score} answers={answers} recommendation={recommendation}/>}
        {step==="quiz"&&<section className="quiz-layout"><div className="section-eyebrow"><Target size={15}/> QUICK DIAGNOSTIC</div><div className="quiz-head"><div><h1>Let’s find your learning path.</h1><p>Choose the answer you think is right. Mistakes help us figure out what to practise.</p></div><div className="progress-count">{qIndex+1}<span> / {questions.length}</span></div></div><div className="progress-track"><div style={{width:`${(qIndex+(feedback?1:0))/questions.length*100}%`}}/></div><div className="quiz-card"><div className="question-meta"><span>QUESTION {qIndex+1}</span><span className="concept-tag">{current.concept}</span></div><h2>{current.prompt}</h2><div className="option-list">{current.options.map((option,i)=><button key={option} disabled={!!feedback} className={`option ${selected===option?"selected":""} ${feedback&&option===current.answer?"correct":""} ${feedback&&selected===option&&selected!==current.answer?"incorrect":""}`} onClick={()=>setSelected(option)}><span className="option-letter">{String.fromCharCode(65+i)}</span>{option}{feedback&&option===current.answer&&<CheckCircle2 className="option-check" size={19}/>}</button>)}</div>{hint&&!feedback&&<div className="hint-box"><Lightbulb size={18}/><span><strong>Hint:</strong> {current.hint}</span></div>}{feedback&&<div className={`feedback-box ${feedback.correct?"good":"try-again"}`}><div className="feedback-title">{feedback.correct?"That’s right!":"Good try — let’s learn from it."}</div><p>{current.explain}</p></div>}<div className="quiz-actions">{!feedback?<><button className="text-button" onClick={()=>setHint(!hint)}><Lightbulb size={16}/>{hint?"Hide hint":"Need a hint?"}</button><button className="primary-button" disabled={!selected} onClick={submitAnswer}>Check answer <ArrowRight size={17}/></button></>:<button className="primary-button" onClick={nextQuestion}>{qIndex+1===questions.length?"See my learning path":"Next question"} <ArrowRight size={17}/></button>}</div></div><p className="privacy-note"><ShieldCheck size={14}/> This is a practice activity. Your score is guidance, not a label.</p></section>}
        {step==="results"&&<Results answers={answers} score={score} recommendation={recommendation} onHome={()=>setStep("home")} onRestart={startQuiz}/>}
      </div>}
      <footer className="footer"><span>GURUPath AI · Team Tenet</span><span>Built for every learner, guided by every teacher.</span></footer>
    </main>
  </div>
}

function StudentHome({onStart,score,answers,recommendation}){
  return <div className="page-content-inner"><div className="welcome-row"><div><div className="section-eyebrow"><Sparkles size={15}/> YOUR LEARNING SPACE</div><h1>A little progress, <span>every day.</span></h1><p className="welcome-sub">Hi there! Let’s build your confidence with linear equations.</p></div><div className="welcome-art"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="art-card"><GraduationCap size={34}/><span>Keep going!</span><small>One step at a time</small></div></div></div>
    <div className="stat-grid"><div className="stat-card"><div className="stat-icon lavender"><Target size={19}/></div><div><small>Current topic</small><strong>Linear equations</strong><span>Class 8 · Mathematics</span></div></div><div className="stat-card"><div className="stat-icon green"><TrendingUp size={19}/></div><div><small>Diagnostic score</small><strong>{answers.length?`${score}%`:"Not started"}</strong><span>{answers.length?`${answers.length} questions answered`:"Ready when you are"}</span></div></div><div className="stat-card"><div className="stat-icon peach"><BookOpen size={19}/></div><div><small>Learning approach</small><strong>Learn · Solve · Test</strong><span>At your own pace</span></div></div></div>
    <div className="home-grid"><div className="learning-card"><div className="card-topline"><div><span className="card-kicker">YOUR NEXT CHAPTER</span><h2>Linear equations, made simpler.</h2></div><div className="chapter-icon"><ListChecks size={24}/></div></div><p>Learn how to find an unknown value, practise one step at a time, and check what you understand.</p><div className="lesson-steps"><div className="lesson-step"><span className="step-number">1</span><div><strong>Learn</strong><small>Understand with a worked example</small></div><span className="step-time">3 min</span></div><div className="lesson-step"><span className="step-number">2</span><div><strong>Solve</strong><small>Practise with helpful hints</small></div><span className="step-time">5 min</span></div><div className="lesson-step"><span className="step-number">3</span><div><strong>Test</strong><small>Check your understanding</small></div><span className="step-time">2 min</span></div></div><button className="primary-button wide" onClick={onStart}>Start my learning path <ChevronRight size={18}/></button></div>
      <div className="recommendation-card"><div className="recommend-top"><div className="recommend-icon"><Lightbulb size={20}/></div><span>PERSONALISED GUIDANCE</span></div><h3>{answers.length?recommendation.title:"Your next step starts here"}</h3><p>{answers.length?recommendation.desc:"Take a short diagnostic so we can suggest a helpful next step based on your answers."}</p><div className="evidence-note"><ShieldCheck size={16}/><span>Recommendations are based on quiz evidence and can be reviewed by your teacher.</span></div><button className="outline-button" onClick={onStart}>{answers.length?"Retake diagnostic":"Find my starting point"} <ArrowRight size={16}/></button></div></div>
    <div className="bottom-banner"><div className="banner-icon"><BrainCircuit size={21}/></div><div><strong>Different learners. Different paths.</strong><p>If a concept feels tricky, that’s useful information — not failure.</p></div><span className="banner-spark">✳</span></div>
    <p className="simulated-note"><AlertCircle size={14}/> Prototype note: sample teacher-dashboard data is simulated for demonstration.</p>
  </div>
}

function Results({answers,score,recommendation,onHome,onRestart}){
  return <div className="results-wrap"><div className="section-eyebrow"><Sparkles size={15}/> YOUR CHECK-IN</div><h1>Look how far you’ve come.</h1><p className="welcome-sub">Here’s what your answers suggest. You can always practise and try again.</p><div className="results-card"><div className="score-ring" style={{"--score":score*3.6+"deg"}}><div><strong>{score}%</strong><span>score</span></div></div><div className="results-summary"><span className="card-kicker">YOUR RECOMMENDED NEXT STEP</span><h2>{recommendation.title}</h2><p>{recommendation.desc}</p><span className="band-pill">{recommendation.band}</span></div></div><div className="answer-review"><h3>Question review</h3>{answers.map((a,i)=><div className="review-row" key={a.id}><span className={a.correct?"review-check":"review-x"}>{a.correct?"✓":"↻"}</span><div><strong>{questions.find(q=>q.id===a.id)?.prompt}</strong><small>{a.correct?"Correct answer":"Correct answer: "+a.answer}</small></div><span className={a.correct?"review-result":"review-result wrong"}>{a.correct?"Correct":"Review"}</span></div>)}</div><div className="results-actions"><button className="outline-button" onClick={onHome}>Back to learning space</button><button className="primary-button" onClick={onRestart}><RotateCcw size={16}/> Try again</button></div><p className="privacy-note"><ShieldCheck size={14}/> This prototype uses a transparent sample policy, not a validated educational assessment.</p></div>
}

function TeacherDashboard({onStudent}){
  const [selected,setSelected]=useState(1);
  const learner=demoLearners[selected];
  return <div className="teacher-page"><div className="teacher-heading"><div><div className="section-eyebrow"><Users size={15}/> TEACHER WORKSPACE</div><h1>See the class. Support each learner.</h1><p className="welcome-sub">A quick view of where learners may need support or extension.</p></div><span className="simulated-badge"><span/> SIMULATED DATA</span></div>
    <div className="teacher-kpis"><div className="teacher-kpi"><span className="kpi-icon"><Users size={18}/></span><div><small>Demo learners</small><strong>03</strong><em>Sample profiles</em></div></div><div className="teacher-kpi"><span className="kpi-icon"><Target size={18}/></span><div><small>Class topic</small><strong>Linear equations</strong><em>Class 8 Mathematics</em></div></div><div className="teacher-kpi"><span className="kpi-icon"><TrendingUp size={18}/></span><div><small>Average sample score</small><strong>65%</strong><em>Illustrative only</em></div></div></div>
    <div className="teacher-grid"><section className="panel learner-panel"><div className="panel-heading"><div><h2>Learner overview</h2><p>Choose a profile to review the suggested next step.</p></div><span className="panel-tag">3 profiles</span></div><div className="learner-list">{demoLearners.map((l,i)=><button key={l.name} className={`learner-row ${selected===i?"selected":""}`} onClick={()=>setSelected(i)}><div className={`learner-avatar ${l.color}`}>{l.initials}</div><div className="learner-info"><strong>{l.name}</strong><small>{l.band}</small><div className="mini-progress"><span style={{width:`${l.score}%`}}/></div></div><strong className="learner-score">{l.score}%</strong><ChevronRight size={17}/></button>)}</div><div className="panel-footnote"><ShieldCheck size={15}/> Temporary support groups — learners can move as their understanding changes.</div></section>
      <section className="panel concept-panel"><div className="panel-heading"><div><h2>Concept snapshot</h2><p>Illustrative mastery by concept</p></div><span className="panel-tag">Sample</span></div><div className="concept-bars">{conceptData.map(c=><div className="concept-bar" key={c.name}><div><span>{c.name}</span><strong>{c.value}%</strong></div><div className="bar-track"><span style={{width:`${c.value}%`}}/></div></div>)}</div><div className="insight-box"><Lightbulb size={17}/><p><strong>Teaching insight</strong><br/>Integer operations show the lowest sample mastery. Consider a 5-minute warm-up before the next equation activity.</p></div></section></div>
    <div className="teacher-grid lower-grid"><section className="panel"><div className="panel-heading"><div><h2>Selected learner</h2><p>Review before taking action</p></div></div><div className="selected-learner"><div className={`learner-avatar large ${learner.color}`}>{learner.initials}</div><div><h3>{learner.name}</h3><span className="band-pill">{learner.band}</span></div></div><div className="detail-line"><span>Focus concept</span><strong>{learner.focus}</strong></div><div className="detail-line"><span>Suggested next action</span><strong>{learner.action}</strong></div><div className="teacher-action-note"><ShieldCheck size={16}/><span>This is a suggestion only. The teacher decides whether it fits the learner.</span></div><button className="outline-button wide" onClick={onStudent}>Open student learning view <ArrowRight size={16}/></button></section>
      <section className="panel errors-panel"><div className="panel-heading"><div><h2>Common error patterns</h2><p>Examples to look for during review</p></div><span className="error-count">03</span></div><div className="error-item"><span>01</span><p>Sign changes when moving terms across the equals sign</p></div><div className="error-item"><span>02</span><p>Dividing only one side of an equation</p></div><div className="error-item"><span>03</span><p>Adding integers with unlike signs</p></div><div className="teacher-action-note"><AlertCircle size={16}/><span>These are sample patterns, not observations from real students.</span></div></section></div>
    <div className="teacher-footer-note"><ShieldCheck size={17}/><div><strong>Teacher empowerment, not replacement.</strong><p>Use evidence, classroom context, and your professional judgement. No automated recommendation should determine a student's ability or future pathway.</p></div></div>
  </div>
}

createRoot(document.getElementById("root")).render(<App/>);

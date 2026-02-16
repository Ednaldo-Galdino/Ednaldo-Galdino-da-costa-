
import React, { useState, useEffect, useCallback } from 'react';
import { Subject, SUBJECTS, Question, StudyStats, Difficulty, Goal } from './types';
import * as gemini from './services/geminiService';
import { GoalCard } from './components/GoalCard';
import { GoalForm } from './components/GoalForm';
import { Dashboard } from './components/Dashboard';

const RobotIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] sm:w-[50px] sm:h-[50px]">
    <rect x="25" y="40" width="50" height="40" rx="10" fill="#003dcc" />
    <rect x="30" y="45" width="40" height="30" rx="5" fill="#00d1ff" />
    <rect x="35" y="15" width="30" height="22" rx="8" fill="#003dcc" />
    <circle cx="42" cy="26" r="3" fill="#ffffff" className="animate-pulse" />
    <circle cx="58" cy="26" r="3" fill="#ffffff" className="animate-pulse" />
    <path d="M45 32H55" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <rect x="60" y="55" width="25" height="18" rx="3" fill="#000814" stroke="#00d1ff" strokeWidth="1" />
    <rect x="63" y="58" width="19" height="12" rx="1" fill="#00d1ff" fillOpacity="0.4" />
    <path d="M50 15V8" stroke="#00d1ff" strokeWidth="2" />
    <circle cx="50" cy="6" r="2" fill="#ffffff" />
  </svg>
);

const getSubjectStyles = (subject: Subject) => {
  switch (subject) {
    case 'Português':
      return { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-400/30', btn: 'bg-cyan-600/80 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' };
    case 'Direito Constitucional':
      return { bg: 'bg-blue-600/20', text: 'text-blue-300', border: 'border-blue-400/30', btn: 'bg-blue-700/80 hover:bg-blue-600 shadow-blue-600/20' };
    case 'Direito Administrativo':
      return { bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-400/30', btn: 'bg-sky-600/80 hover:bg-sky-500 shadow-sky-600/20' };
    case 'Direito Penal':
      return { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-400/30', btn: 'bg-indigo-600/80 hover:bg-indigo-500 shadow-indigo-600/20' };
    case 'Direito Processual Penal':
      return { bg: 'bg-blue-800/20', text: 'text-blue-200', border: 'border-blue-600/30', btn: 'bg-blue-800/80 hover:bg-blue-700 shadow-blue-800/20' };
    case 'Arquivologia':
      return { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-400/30', btn: 'bg-teal-600/80 hover:bg-teal-500 shadow-teal-600/20' };
    case 'Matemática':
      return { bg: 'bg-cyan-400/20', text: 'text-cyan-200', border: 'border-cyan-300/30', btn: 'bg-cyan-500/80 hover:bg-cyan-400 shadow-cyan-400/20' };
    case 'RLM':
      return { bg: 'bg-blue-400/20', text: 'text-blue-100', border: 'border-blue-300/30', btn: 'bg-blue-500/80 hover:bg-blue-400 shadow-blue-400/20' };
    case 'Informática':
      return { bg: 'bg-cyan-600/20', text: 'text-cyan-100', border: 'border-cyan-400/30', btn: 'bg-cyan-700/80 hover:bg-cyan-600 shadow-cyan-700/20' };
    default:
      return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/30', btn: 'bg-cyan-600/80 hover:bg-cyan-500' };
  }
};

const getDifficultyStyles = (diff: Difficulty) => {
  switch (diff) {
    case 'Fácil': return { border: 'border-emerald-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    case 'Médio': return { border: 'border-orange-500', bg: 'bg-orange-500/20', text: 'text-orange-400' };
    case 'Difícil': return { border: 'border-rose-500', bg: 'bg-rose-500/20', text: 'text-rose-400' };
    default: return { border: 'border-white/10', bg: 'bg-white/5', text: 'text-white' };
  }
};

const SubjectIcon = ({ subject }: { subject: Subject }) => {
  const styles = getSubjectStyles(subject);
  switch (subject) {
    case 'Português':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
    case 'Direito Constitucional':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
    case 'Direito Administrativo':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    case 'Direito Penal':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    case 'Direito Processual Penal':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V3m0 8l8 4m-8-4l-8 4m8 10V11m0 10l8-4m-8 4l-8-4" /></svg>;
    case 'Arquivologia':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" /></svg>;
    case 'Matemática':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4M16 16l-8-8m8 0l-8 8" /></svg>;
    case 'RLM':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
    case 'Informática':
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    default:
      return <svg className={`w-8 h-8 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'study' | 'performance' | 'goals'>('study');
  const [view, setView] = useState<'home' | 'quiz' | 'result'>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showQuizConfig, setShowQuizConfig] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Médio');
  const [selectedAmount, setSelectedAmount] = useState<number>(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [stats, setStats] = useState<Record<string, StudyStats>>({});

  useEffect(() => {
    const savedStats = localStorage.getItem('concurso-stats');
    if (savedStats) setStats(JSON.parse(savedStats));
    const savedGoals = localStorage.getItem('user-goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  const saveStats = (subject: Subject, correct: number, total: number) => {
    const newStats = { ...stats };
    const current = newStats[subject] || { subject, totalAnswered: 0, correctAnswers: 0, lastScore: 0 };
    current.totalAnswered += total;
    current.correctAnswers += correct;
    current.lastScore = (correct / total) * 100;
    newStats[subject] = current;
    setStats(newStats);
    localStorage.setItem('concurso-stats', JSON.stringify(newStats));
  };

  const resetStats = (subject: Subject) => {
    if (window.confirm(`Tem certeza que deseja resetar todos os dados de ${subject}? Esta ação não pode ser desfeita.`)) {
      const newStats = { ...stats };
      delete newStats[subject];
      setStats(newStats);
      localStorage.setItem('concurso-stats', JSON.stringify(newStats));
    }
  };

  const startQuiz = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setShowQuizConfig(false);
    setLoadingMsg(`Sincronizando com a IA para gerar ${selectedAmount} questões...`);
    
    try {
      const qs = await gemini.generateQuestions(selectedSubject, selectedAmount, selectedDifficulty);
      setQuestions(qs);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setView('quiz');
      setLoading(false);
    } catch (e: any) {
      console.error("Erro na geração:", e);
      setLoading(false);
      const isQuotaError = e.message?.includes('429') || e.message?.includes('quota');
      alert(isQuotaError 
        ? "Limite de requisições atingido. Aguarde 60 segundos e tente novamente." 
        : "Erro ao conectar com a IA. Verifique sua conexão ou tente novamente em instantes.");
    }
  };

  const handleSaveGoal = useCallback((newGoalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoalData.title || '',
      description: newGoalData.description || '',
      deadline: newGoalData.deadline || '',
      category: newGoalData.category || 'Pessoal',
      steps: newGoalData.steps || [],
      aiInsight: newGoalData.aiInsight
    };
    
    setGoals(prev => {
      const updated = [...prev, newGoal];
      localStorage.setItem('user-goals', JSON.stringify(updated));
      return updated;
    });
    setShowGoalForm(false);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#000814]/90 backdrop-blur-3xl flex flex-col items-center justify-center text-white p-6 text-center">
      <div className="w-20 h-20 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
      <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 text-cyan-400 italic tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Processamento Neural</h2>
      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">{loadingMsg}</p>
    </div>
  );

  const correctCount = userAnswers.filter((a, i) => a === questions[i].correctIndex).length;
  const scorePercent = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  const isApproved = scorePercent >= 70;

  return (
    <div className="min-h-screen text-gray-100 font-sans h-screen flex flex-col overflow-hidden">
      <nav className="bg-[#000814]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3 flex flex-col sm:flex-row justify-between items-center z-[100] flex-shrink-0 gap-4 sm:gap-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <RobotIcon />
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-black tracking-tighter uppercase leading-none">MEU <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">OBJETIVO</span></h1>
            <p className="hidden sm:block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sincronização Ativa</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-md w-full sm:w-auto">
          <button onClick={() => { setActiveTab('study'); setView('home'); }} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${activeTab === 'study' ? 'bg-cyan-600/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-white'}`}>Simulados</button>
          <button onClick={() => setActiveTab('performance')} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${activeTab === 'performance' ? 'bg-cyan-600/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-white'}`}>Performance</button>
          <button onClick={() => setActiveTab('goals')} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${activeTab === 'goals' ? 'bg-cyan-600/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-white'}`}>Metas</button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 relative z-10 scrollbar-hide">
        {activeTab === 'study' && (
          <>
            {view === 'home' && (
              <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-10 mt-2 sm:mt-4 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-4xl font-black text-white italic uppercase tracking-tighter">Módulos de <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Treino</span></h2>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1 sm:mt-2 tracking-wide opacity-80">Selecione uma matéria para iniciar seu simulado.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-20">
                  {SUBJECTS.map(s => {
                    const sStat = stats[s];
                    const score = sStat ? (sStat.correctAnswers / sStat.totalAnswered) * 100 : 0;
                    const styles = getSubjectStyles(s);
                    return (
                      <div key={s} className="group bg-blue-900/10 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl sm:rounded-[40px] hover:border-cyan-400/50 transition-all flex flex-col h-full relative overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 ${styles.bg} border ${styles.border} rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-xl`}>
                            <SubjectIcon subject={s} />
                          </div>
                          {sStat && (
                            <div className="text-right flex flex-col items-end">
                              <button 
                                onClick={(e) => { e.stopPropagation(); resetStats(s); }}
                                className="text-[8px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-tighter mb-2 transition-colors border border-rose-500/20 rounded px-1.5 py-0.5"
                                title="Resetar dados desta matéria"
                              >
                                Limpar Dados
                              </button>
                              <p className="text-[9px] sm:text-[10px] font-black text-cyan-400 uppercase tracking-widest">{Math.round(score)}% Precisão</p>
                              <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase mt-1">{sStat.totalAnswered} Questões</p>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white uppercase mb-6 sm:mb-8 flex-grow relative z-10">{s}</h3>
                        <button 
                          onClick={() => { setSelectedSubject(s); setShowQuizConfig(true); }} 
                          className={`w-full py-4 sm:py-5 ${styles.btn} text-white text-[10px] sm:text-[11px] font-black uppercase rounded-xl sm:rounded-2xl transition-all border border-white/10 shadow-lg active:scale-95`}
                        >
                          Configurar Teste
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {view === 'quiz' && (
              <div className="max-w-4xl mx-auto py-2 sm:py-4 animate-in fade-in duration-500">
                <div className="mb-4 sm:mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black uppercase italic text-white tracking-tighter">Questão {currentQuestionIndex + 1} <span className="text-cyan-400">/ {questions.length}</span></h2>
                  <p className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] ${getDifficultyStyles(selectedDifficulty).text} hidden sm:block`}>{selectedSubject} • {selectedDifficulty}</p>
                </div>
                <div className="bg-[#000814]/80 backdrop-blur-3xl rounded-3xl sm:rounded-[40px] p-6 sm:p-10 border border-white/10 shadow-2xl">
                  <p className="text-lg sm:text-xl font-bold text-white mb-8 sm:mb-10 leading-relaxed tracking-tight drop-shadow-sm">{questions[currentQuestionIndex].text}</p>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {questions[currentQuestionIndex].options.map((opt, i) => (
                      <button key={i} onClick={() => {
                        const nextAnswers = [...userAnswers, i];
                        setUserAnswers(nextAnswers);
                        if (currentQuestionIndex < questions.length - 1) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                          const correct = questions.reduce((acc, q, idx) => acc + (nextAnswers[idx] === q.correctIndex ? 1 : 0), 0);
                          saveStats(selectedSubject!, correct, questions.length);
                          setView('result');
                        }
                      }} className="w-full text-left p-4 sm:p-6 rounded-2xl sm:rounded-[28px] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all flex items-center gap-4 sm:gap-6 group bg-white/5 backdrop-blur-sm">
                        <span className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center font-black text-xs sm:text-sm text-white group-hover:bg-cyan-400 transition-colors shadow-inner">{String.fromCharCode(65 + i)}</span>
                        <span className="text-gray-300 group-hover:text-white transition-colors font-semibold text-base sm:text-lg leading-snug">{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'result' && (
              <div className="max-w-4xl mx-auto py-4 sm:py-8 animate-in zoom-in-95 duration-500 space-y-6 sm:space-y-8 pb-32">
                <div className="bg-[#000814]/80 backdrop-blur-3xl p-8 sm:p-12 rounded-3xl sm:rounded-[60px] border border-white/10 shadow-2xl text-center">
                  <div className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-4 sm:border-8 ${isApproved ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]'} flex flex-col items-center justify-center mb-6`}>
                    <span className="text-3xl sm:text-4xl font-black text-white italic">
                      {Math.round(scorePercent)}%
                    </span>
                  </div>
                  <h2 className={`text-4xl sm:text-6xl font-black uppercase italic mb-2 tracking-tighter ${isApproved ? 'text-cyan-400' : 'text-rose-500'}`}>
                    {isApproved ? 'APROVADO' : 'REPROVADO'}
                  </h2>
                  <p className="text-gray-400 font-bold uppercase text-[10px] sm:text-xs tracking-[0.3em] mb-8">
                    {isApproved ? 'Parabéns! Você superou a meta neural de 70%.' : 'Foco! Seu desempenho ficou abaixo do protocolo de 70%.'}
                  </p>
                  <button onClick={() => setView('home')} className="max-w-xs mx-auto w-full py-5 sm:py-6 bg-cyan-600/80 rounded-2xl sm:rounded-[28px] font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] hover:bg-cyan-500 transition-all text-white shadow-xl backdrop-blur-xl border border-white/10 mb-8">Retornar ao Hub</button>

                  <div className="text-left space-y-6 mt-12 border-t border-white/10 pt-12">
                    <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-widest mb-6 border-l-4 border-cyan-500 pl-4">Análise de Performance</h3>
                    {questions.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.correctIndex;
                      return (
                        <div key={idx} className={`p-6 rounded-[28px] border ${isCorrect ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-rose-500/20 bg-rose-500/5'} backdrop-blur-md`}>
                          <div className="flex items-start gap-4 mb-4">
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${isCorrect ? 'bg-cyan-500 text-[#000814]' : 'bg-rose-500 text-white'}`}>
                              {idx + 1}
                            </span>
                            <p className="text-sm sm:text-base font-bold text-gray-200 leading-relaxed">{q.text}</p>
                          </div>
                          <div className="ml-12 space-y-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                              Sua resposta: <span className={isCorrect ? 'text-cyan-400' : 'text-rose-400'}>{String.fromCharCode(65 + userAnswers[idx])}) {q.options[userAnswers[idx]]}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Gabarito: <span className="text-emerald-400">{String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}</span>
                              </p>
                            )}
                            <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[11px] sm:text-xs text-gray-400 italic font-medium leading-relaxed">
                                <span className="text-cyan-400 font-black not-italic uppercase mr-2 text-[10px]">IA Explica:</span> {q.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'performance' && <Dashboard stats={stats} />}

        {activeTab === 'goals' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 mt-2 sm:mt-4 gap-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter text-center sm:text-left">Matriz de <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Metas</span></h2>
              <button onClick={() => setShowGoalForm(true)} className="w-full sm:w-auto px-8 py-4 bg-cyan-600/80 text-white text-[10px] sm:text-[11px] font-black uppercase rounded-xl sm:rounded-2xl shadow-xl hover:bg-cyan-500 transition-all backdrop-blur-md border border-white/10">Novo Objetivo</button>
            </div>
            {goals.length === 0 ? (
              <div className="text-center py-20 sm:py-40 bg-blue-900/10 backdrop-blur-2xl rounded-3xl sm:rounded-[60px] border border-white/10 shadow-2xl px-6">
                <p className="text-gray-500 font-bold uppercase text-[10px] sm:text-xs tracking-[0.4em] mb-8">Nenhum protocolo detectado.</p>
                <button onClick={() => setShowGoalForm(true)} className="text-cyan-400 font-black uppercase text-xs sm:text-sm hover:text-white transition-colors tracking-widest underline decoration-2 underline-offset-8">Iniciar primeiro upload</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-20">
                {goals.map(goal => <GoalCard key={goal.id} goal={goal} onClick={() => {}} />)}
              </div>
            )}
          </div>
        )}

        {showQuizConfig && (
          <div className="fixed inset-0 bg-[#000814]/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-500">
            <div className="bg-[#000814]/80 w-full max-w-md rounded-3xl sm:rounded-[60px] border border-white/20 p-8 sm:p-12 text-center shadow-[0_0_100px_rgba(0,0,0,0.6)] relative backdrop-blur-2xl overflow-y-auto max-h-[90vh]">
              {(() => {
                const styles = getSubjectStyles(selectedSubject!);
                return (
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${styles.bg} border ${styles.border} rounded-2xl sm:rounded-[32px] flex items-center justify-center mb-6 sm:mb-8 mx-auto shadow-2xl`}>
                    <SubjectIcon subject={selectedSubject!} />
                  </div>
                );
              })()}
              <h3 className="text-2xl sm:text-3xl font-black uppercase italic mb-6 sm:mb-8 text-white tracking-tighter">{selectedSubject}</h3>
              
              <div className="space-y-6 sm:space-y-8 text-left">
                <div>
                  <label className="text-[9px] sm:text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 block text-center">Nível de Complexidade</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {(['Fácil', 'Médio', 'Difícil'] as Difficulty[]).map(d => {
                      const dStyle = getDifficultyStyles(d);
                      const isSelected = selectedDifficulty === d;
                      return (
                        <button 
                          key={d} 
                          onClick={() => setSelectedDifficulty(d)} 
                          className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 font-black uppercase text-[8px] sm:text-[10px] tracking-widest transition-all ${isSelected ? `${dStyle.border} ${dStyle.bg} ${dStyle.text} shadow-[0_0_10px_rgba(34,211,238,0.2)]` : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/10'}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] sm:text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 block text-center">Volume de Dados</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[10, 20, 30].map(amt => (
                      <button key={amt} onClick={() => setSelectedAmount(amt)} className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 font-black uppercase text-xs tracking-widest transition-all ${selectedAmount === amt ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/10'}`}>{amt}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={startQuiz} className="w-full py-5 sm:py-6 bg-cyan-600/80 rounded-2xl sm:rounded-[32px] font-black uppercase text-[10px] sm:text-xs tracking-[0.4em] active:scale-95 transition-all text-white shadow-2xl mt-8 sm:mt-10 backdrop-blur-xl border border-white/10">
                Iniciar Teste
              </button>
              <button onClick={() => setShowQuizConfig(false)} className="mt-6 sm:mt-8 text-[10px] sm:text-[11px] font-black uppercase text-gray-500 hover:text-white transition-colors tracking-widest">Abortar</button>
            </div>
          </div>
        )}
        {showGoalForm && <GoalForm onSave={handleSaveGoal} onClose={() => setShowGoalForm(false)} />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#000814]/90 backdrop-blur-2xl border-t border-white/10 py-3 px-4 sm:px-8 text-[8px] sm:text-[10px] font-black text-gray-500 flex justify-between z-[100]">
        <div className="flex gap-4 sm:gap-8 items-center uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]"></span>
            <span className="text-cyan-400">v4.0 HD MOBILE</span>
          </div>
          <span className="hidden md:block opacity-40">● DADOS SINCRONIZADOS</span>
        </div>
        <div className="italic uppercase tracking-widest opacity-80 text-gray-400">© 2025 MEU OBJETIVO</div>
      </footer>
    </div>
  );
};

export default App;

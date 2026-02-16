
export type Subject = 
  | 'Português' 
  | 'Direito Constitucional' 
  | 'Direito Administrativo' 
  | 'Direito Penal' 
  | 'Direito Processual Penal' 
  | 'Arquivologia' 
  | 'Matemática' 
  | 'RLM' 
  | 'Informática';

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyStats {
  subject: Subject;
  totalAnswered: number;
  correctAnswers: number;
  lastScore: number;
}

export const SUBJECTS: Subject[] = [
  'Português',
  'Direito Constitucional',
  'Direito Administrativo',
  'Direito Penal',
  'Direito Processual Penal',
  'Arquivologia',
  'Matemática',
  'RLM',
  'Informática'
];

export type Category = 'Saúde' | 'Carreira' | 'Finanças' | 'Pessoal' | 'Educação';
export const CATEGORIES: Category[] = ['Saúde', 'Carreira', 'Finanças', 'Pessoal', 'Educação'];

export interface GoalStep {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: Category;
  steps: GoalStep[];
  aiInsight?: string;
}

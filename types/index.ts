/* ── Stephano Global Types ── */

export interface LeadInput {
  nombre: string;
  empresa?: string;
  email: string;
  tipo_proyecto: string;
  presupuesto_rango?: string;
  urgencia?: string;
  mensaje?: string;
}

export interface LeadRecord extends LeadInput {
  id: number;
  fecha_creacion: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  category: string;
  description: string;
  technologies: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ChatIntent =
  | 'desarrollo_web'
  | 'sistema_personalizado'
  | 'app_movil'
  | 'automatizacion'
  | 'ecommerce'
  | 'precio_directo'
  | 'optimizacion'
  | 'general';

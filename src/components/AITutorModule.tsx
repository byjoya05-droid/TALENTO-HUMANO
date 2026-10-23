import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  FileCheck, 
  Layers, 
  User, 
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export const AITutorModule: React.FC = () => {
  const { addXp, completeMission } = useGamification();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'tutor',
      text: `¡Hola, estimado aprendiz! Soy el **Mentor SENA TH**, tu asesor pedagógico inteligente especializado en el programa **Técnico en Talento Humano (Código 134207)** y el **Proyecto Formativo 3456077**.\n\nPuedo orientarte sobre:\n- La relación entre las **4 Fases del Proyecto**, las competencias y los Resultados de Aprendizaje (RAPs).\n- La diferencia e integración entre el **Saber** (conceptos), **Saber Hacer** (procedimientos técnicos) y **Ser** (valores y confidencialidad).\n- Criterios de evaluación oficiales de tus instructores.\n- Elaboración de los 10 productos de la empresa simulada (*TalentoActivo S.A.S.*), tales como el FUID, historias laborales, cronogramas y manuales.\n\n¿En qué te puedo apoyar el día de hoy?`,
      timestamp: 'Ahora',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const suggestedQuestions = [
    '¿Cómo se relaciona la Fase de Planeación con la competencia 210601031 de elaboración de documentos?',
    '¿Cuáles son los campos obligatorios del Formato Único de Inventario Documental (FUID) según el AGN?',
    '¿Qué diferencia hay entre los conocimientos del Saber y del Saber Hacer en la provisión de personal?',
    '¿Cuáles son los documentos indispensables que componen una Historia Laboral conforme a la ley colombiana?',
    '¿Qué criterios de evaluación aplica el instructor SENA para valorar el Informe de Resultados de la Fase de Evaluación?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const tutorReply = data.reply || 'He recibido tu mensaje. Recuerda seguir los procedimientos técnicos y consultar la normatividad laboral vigente.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: tutorReply,
          timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      addXp(25, 'Interacción pedagógica con Mentor IA');
      completeMission('mis-6');
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: 'Estimado aprendiz: Como Mentor SENA TH te recuerdo que cada fase del proyecto formativo se evalúa mediante evidencias concretas. En la Fase de Análisis elaboras la presentación automatizada de procesos; en Planeación, el cronograma y estructura empresarial; en Ejecución, los registros operativos; y en Evaluación, los expedientes laborales y el FUID.',
          timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'tutor',
        text: `Conversación reiniciada. Estoy listo para resolver cualquier duda sobre tu ruta formativa y la empresa simulada.`,
        timestamp: 'Ahora',
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Inteligencia Artificial Pedagógica SENA
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Mentor SENA TH · Asesor Curricular Inteligente
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Alimentado con el diseño curricular oficial 134207 y el Proyecto Formativo 3456077.
                Haz preguntas sobre cualquier fase, competencia, criterio de evaluación o producto simulado.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar Chat
          </button>
        </div>

        {/* Suggested Quick Inquiries */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-600 uppercase mb-2 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Preguntas Frecuentes para Explorar:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-left text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-300 rounded-md px-2.5 py-1 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isTutor = msg.sender === 'tutor';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isTutor ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isTutor
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {isTutor ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isTutor
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                      : 'bg-emerald-700 text-white font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 border-b border-black/5 pb-1">
                    <span className={`font-bold text-[11px] ${isTutor ? 'text-emerald-800' : 'text-emerald-100'}`}>
                      {isTutor ? 'Mentor SENA TH' : 'Tú (Aprendiz)'}
                    </span>
                    <span className={`text-[10px] font-mono ${isTutor ? 'text-slate-400' : 'text-emerald-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Mentor SENA TH está consultando el diseño curricular y redactando respuesta...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu consulta pedagógica sobre el programa, competencias o empresa simulada..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:outline-emerald-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

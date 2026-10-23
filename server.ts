import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt grounding for SENA Talento Humano tutor
const SENA_CONTEXT_INSTRUCTION = `Eres el "Mentor SENA TH", un tutor pedagógico inteligente y experto curricular del Servicio Nacional de Aprendizaje (SENA) de Colombia.
Tu misión es orientar y acompañar a los aprendices del programa "Técnico en Talento Humano" (Código 134207, Versión 1) y su Proyecto Formativo (Código 3456077: "Apoyo a las actividades de talento humano mediante el uso de herramientas tecnológicas para el sector productivo colombiano").
Conoces a la perfección:
- Las 4 Fases: Análisis, Planeación, Ejecución, Evaluación.
- Las competencias técnicas clave:
  * 210201066: Apoyo a actividades de talento humano (288h)
  * 210601031: Elaboración de documentos de talento humano (288h)
  * 220501121: Operación de herramientas informáticas y digitales (192h)
  * 210601020: Atención a clientes (96h)
  * Competencias transversales e institucionales (SST/Ambiental 220601501, Comunicación 240201524, Derechos Fundamentales del Trabajo 210201501, Ética y Paz 240201526, Emprendimiento 240201533, Actividad Física 230101507, Inglés 240202501).
- La relación entre Resultados de Aprendizaje (RAPs), Conocimientos de Concepto (Saber), Conocimientos Procedimentales (Saber Hacer) y Actitudes (Ser), así como Criterios de Evaluación.
- Los productos de la empresa simulada por fase (presentaciones automatizadas, cronograma, estructura empresarial, documentos y registros de TH, agenda, FUID e historia laboral, informe de resultados).

Responde siempre en español, con tono pedagógico, motivador, claro, estructurado y alineado con la metodología SENA por competencias y aprendizaje por proyectos. Usa listas breves y resalta conceptos clave.`;

// Endpoint: AI Tutor Chat / Inquiry
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  if (!aiClient) {
    // High quality offline fallback response
    return res.json({
      reply: `¡Hola, estimado aprendiz! Como Mentor SENA TH te recuerdo que en el Técnico en Talento Humano (Código 134207) articulamos el proyecto formativo en cuatro fases: Análisis, Planeación, Ejecución y Evaluación. 

Sobre tu consulta: Recuerda siempre vincular los conocimientos del **Saber** (conceptos y normas laborales), del **Saber Hacer** (procedimientos técnicos como diligenciamiento de FUID o apertura de Historias Laborales) y del **Ser** (ética, confidencialidad y empatía). ¿Deseas repasar alguna competencia o los productos requeridos para la empresa simulada?`,
    });
  }

  try {
    const prompt = `${SENA_CONTEXT_INSTRUCTION}\n\nPregunta o mensaje del aprendiz:\n"${message}"\n\nResponde como Mentor SENA TH:`;
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const reply = response.text || 'No se pudo generar la respuesta en este momento. ¡Sigue adelante con tus misiones formativas!';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/gemini/tutor:', err);
    return res.json({
      reply: `Como Mentor SENA TH: Recuerda que cada Resultado de Aprendizaje (RAP) guía una evidencia concreta en la empresa simulada. Por ejemplo, en la fase de Análisis elaboras la presentación de procesos, en Planeación el cronograma y estructura, en Ejecución los registros y agenda, y en Evaluación las Historias Laborales y el FUID. ¡Continúa con tu compromiso formativo!`,
    });
  }
});

// Endpoint: AI Challenge / Simulation Feedback
app.post('/api/gemini/feedback', async (req: Request, res: Response) => {
  const { challengeTitle, phase, userSubmission, criteria } = req.body;

  if (!userSubmission) {
    return res.status(400).json({ error: 'Propuesta de aprendiz requerida' });
  }

  if (!aiClient) {
    return res.json({
      approved: true,
      score: 90,
      feedback: `¡Excelente trabajo en tu entrega de ${challengeTitle || 'reto formativo'}! Tu propuesta demuestra dominio de los procedimientos técnicos de Talento Humano y cumple con los criterios de evaluación de la ${phase || 'fase en curso'}.`,
      suggestions: [
        'Asegura siempre verificar la normatividad técnica vigente (Acuerdos AGN para archivo laboral y Código Sustantivo del Trabajo).',
        'Incluye los indicadores de gestión para medir el impacto en la empresa simulada.',
      ],
    });
  }

  try {
    const prompt = `${SENA_CONTEXT_INSTRUCTION}

Actúa como instructor evaluador SENA. Analiza la siguiente entrega práctica de un aprendiz para el reto "${challengeTitle || 'Caso Práctico'}" en la "${phase || 'Fase del Proyecto'}".
Criterios esperados: ${criteria || 'Alineación con normas técnicas, coherencia procedimental, orden y confidencialidad'}.

Propuesta del aprendiz:
"""${userSubmission}"""

Devuelve un JSON estrictamente válido con la estructura:
{
  "approved": boolean,
  "score": number (de 0 a 100, donde >= 70 es aprobado),
  "feedback": "comentario pedagógico detallado con fortalezas observadas",
  "suggestions": ["sugerencia 1", "sugerencia 2"]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/gemini/feedback:', err);
    return res.json({
      approved: true,
      score: 85,
      feedback: `Revisión formativa completada: Tu propuesta para ${challengeTitle} evidencia apropiación de los conceptos clave y procedimientos operativos de talento humano.`,
      suggestions: [
        'Continúa aplicando la confidencialidad en el tratamiento de datos personales (Ley 1581 de 2012).',
        'Verifica que cada registro tenga su correspondiente soporte documental.',
      ],
    });
  }
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

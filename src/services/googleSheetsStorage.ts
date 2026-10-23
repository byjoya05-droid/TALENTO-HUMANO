import { LearnerProfile } from '../types/gamification';

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  lastSyncTime?: string;
  rowsCount?: number;
}

const DEFAULT_SHEET_TITLE_PREFIX = 'SENA - Registro de Aprendices Talento Humano';

/**
 * Searches for an existing learner spreadsheet in Drive or creates a new one.
 */
export async function getOrCreateLearnerSpreadsheet(
  accessToken: string,
  ficha: string
): Promise<SpreadsheetInfo> {
  const targetTitle = `${DEFAULT_SHEET_TITLE_PREFIX} (Ficha ${ficha})`;

  // 1. Check if the spreadsheet already exists in Drive
  const query = encodeURIComponent(
    `name = '${targetTitle}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const existing = searchData.files[0];
      return {
        id: existing.id,
        name: existing.name,
        url: existing.webViewLink || `https://docs.google.com/spreadsheets/d/${existing.id}/edit`,
      };
    }
  }

  // 2. If not found, create a new spreadsheet with the 3 structured sheets
  const createPayload = {
    properties: {
      title: targetTitle,
    },
    sheets: [
      {
        properties: {
          title: 'Aprendices_Registro',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
      {
        properties: {
          title: 'Entregables_Empresa_Simulada',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
      {
        properties: {
          title: 'Evaluaciones_y_Retos',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const errorJson = await createRes.json();
    throw new Error(errorJson.error?.message || 'Error al crear la hoja de cálculo en Drive');
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;

  // 3. Populate header rows in the new spreadsheet
  const headersPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'Aprendices_Registro!A1:L1',
        values: [
          [
            'Fecha Registro',
            'Nombre Completo',
            'Documento Identidad',
            'Ficha SOFIA',
            'Centro de Formación',
            'Regional',
            'Nivel Actual',
            'Puntos XP',
            'Porcentaje Apropiación',
            'Estado Certificación',
            'Insignias Obtenidas',
            'Última Sincronización',
          ],
        ],
      },
      {
        range: 'Entregables_Empresa_Simulada!A1:H1',
        values: [
          [
            'Fecha Registro',
            'Documento Aprendiz',
            'Fase Proyecto',
            'Código Producto',
            'Nombre del Producto',
            'Estado Entrega',
            'Calificación IA',
            'Criterio SENA',
          ],
        ],
      },
      {
        range: 'Evaluaciones_y_Retos!A1:G1',
        values: [
          [
            'Fecha Evaluación',
            'Documento Aprendiz',
            'Tipo Evaluación',
            'Puntaje Obtenido (%)',
            'Estado',
            'Puntos XP Ganados',
            'Observaciones',
          ],
        ],
      },
    ],
  };

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(headersPayload),
  });

  return {
    id: spreadsheetId,
    name: targetTitle,
    url: createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * Appends or updates the current learner's profile row in 'Aprendices_Registro'.
 */
export async function syncLearnerToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  profile: LearnerProfile,
  apropiacionPercent: number,
  isCertified: boolean
): Promise<{ success: boolean; rowWritten: number }> {
  const timestamp = new Date().toLocaleString('es-CO');

  const rowValues = [
    timestamp,
    profile.name,
    profile.documentNumber,
    profile.ficha,
    profile.center,
    profile.regional,
    `Nivel ${profile.level}`,
    profile.xp,
    `${apropiacionPercent}%`,
    isCertified ? 'CERTIFICACIÓN APROBADA' : 'EN FORMACIÓN ACTIVA',
    profile.badges?.filter((b) => b.unlocked).map((b) => b.name).join('; ') || 'Ninguna',
    timestamp,
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices_Registro!A:L:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!appendRes.ok) {
    const errorJson = await appendRes.json();
    throw new Error(errorJson.error?.message || 'Error al escribir datos en Google Sheets');
  }

  const appendData = await appendRes.json();
  const updatedRange = appendData.updates?.updatedRange || '';
  const rowMatch = updatedRange.match(/A(\d+):/);
  const rowNumber = rowMatch ? parseInt(rowMatch[1], 10) : 2;

  return {
    success: true,
    rowWritten: rowNumber,
  };
}

/**
 * Appends deliverable status records for the simulated company products.
 */
export async function syncDeliverableToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  profile: LearnerProfile,
  phase: string,
  productCode: string,
  productName: string,
  score: number
) {
  const timestamp = new Date().toLocaleString('es-CO');

  const rowValues = [
    timestamp,
    profile.documentNumber,
    phase,
    productCode,
    productName,
    'APROBADO',
    score,
    'Cumple con los requisitos del proyecto formativo 3456077 y la empresa simulada',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Entregables_Empresa_Simulada!A:H:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );
}

export interface SheetLearnerRecord {
  timestamp: string;
  name: string;
  docNumber: string;
  ficha: string;
  center: string;
  regional: string;
  level: string;
  xp: string;
  apropiacion: string;
  status: string;
  badges: string;
}

/**
 * Reads existing records from 'Aprendices_Registro' to verify data stored in Drive.
 */
export async function fetchLearnersFromSpreadsheet(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetLearnerRecord[]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices_Registro!A2:L50`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  return rows.map((row) => ({
    timestamp: row[0] || '',
    name: row[1] || '',
    docNumber: row[2] || '',
    ficha: row[3] || '',
    center: row[4] || '',
    regional: row[5] || '',
    level: row[6] || '',
    xp: row[7] || '',
    apropiacion: row[8] || '',
    status: row[9] || '',
    badges: row[10] || '',
  }));
}


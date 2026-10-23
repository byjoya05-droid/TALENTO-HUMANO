# Sincronización Automática y Desatendida con Google Drive & Google Sheets

Plan de arquitectura y flujo para que la plataforma registre y sincronice automáticamente los datos del aprendiz en la hoja de cálculo de Google Drive sin requerir configuraciones repetitivas ni sincronizaciones manuales.

---

## Decisiones Críticas y Resumen Ejecutivo

> [!IMPORTANT]
> **Enfoque de Automatización Continua (Zero-Friction Auto-Sync):**
> 1. **Detección y Vinculación Silenciosa al Iniciar Sesión:** Al conectarse con Google una sola vez, el sistema guarda en el navegador el identificador de la hoja vinculada (`spreadsheetId` y `spreadsheetUrl`) para no tener que buscarla ni volver a configurarla.
> 2. **Sincronización por Eventos y Debounce Automático:** Cada vez que el aprendiz modifique sus datos en la herramienta de edición, apruebe un entregable en la empresa simulada, gane experiencia (XP) o complete una evaluación diagnóstica, el sistema dispara automáticamente una sincronización en segundo plano (con un retardo de 2 segundos para evitar saturación de la API de Google).
> 3. **Indicador Visual de Estado Automático:** Se sustituye la necesidad de botones de guardado manual por un indicador discreto de sincronización en tiempo real: *"Sincronizado en Google Drive"*, *"Guardando cambios..."* o *"Reintentando en segundo plano"*.
> 4. **Respeto a las Directrices de Seguridad de Google Workspace:** El consentimiento de permisos de Google se solicita una única vez en el inicio de sesión OAuth. La autorización de escritura se mantiene activa durante la sesión del usuario para permitir el guardado desatendido.

---

## 1. Visión General del Flujo Automatizado

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROTOTIPO EDUCATIVO SENA                        │
│                                                                        │
│  [Herramienta Edición]   [Evaluaciones / Retos]   [Empresa Simulada]   │
│           │                         │                      │           │
│           ▼                         ▼                      ▼           │
│   Cambio de Perfil           Progreso / XP           Entregable Aprob. │
└───────────────────────────┬────────────────────────────────────────────┘
                            │
                            ▼ (Disparo Automático de Evento)
┌────────────────────────────────────────────────────────────────────────┐
│                    MOTOR DE AUTO-SYNC (Background)                     │
│                                                                        │
│  • Debounce Timer (2000 ms para agrupar cambios consecutivos)         │
│  • Verificación de Token OAuth en memoria                              │
│  • Resolución automática del SpreadsheetId (Cache local)              │
│  • Estado visual: [ 🟢 Sincronizado en Google Drive ]                  │
└───────────────────────────┬────────────────────────────────────────────┘
                            │
                            ▼ (Google Sheets API v4 Batch Update)
┌────────────────────────────────────────────────────────────────────────┐
│                      GOOGLE DRIVE DEL APRENDIZ                         │
│                                                                        │
│  Hoja: "SENA - Registro de Aprendices Talento Humano (Ficha 2894501)"  │
│  ├─ Aprendices_Registro         (Actualización automática de fila)     │
│  ├─ Entregables_Empresa_Simulada (Registro de entregas validadas)      │
│  └─ Evaluaciones_y_Retos        (Registro de puntajes y retos)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes del Plan de Implementación

### Fase A: Persistencia y Vinculación Desatendida
- **Persistencia de Referencia:** Almacenar de forma segura el identificador de la hoja vinculada (`sena_active_spreadsheet_id` y `sena_active_spreadsheet_url`) en el almacenamiento local del navegador para que el prototipo recuerde siempre la hoja de cálculo exacta sin tener que reconfigurarla entre recargas.
- **Auto-Aprovisionamiento:** Si el usuario tiene sesión activa pero aún no posee la hoja en su Drive, el prototipo la crea automáticamente con sus 3 pestañas estructuradas en el primer segundo de arranque sin requerir que el usuario presione ningún botón.

### Fase B: Hook de Sincronización Automática (`useAutoDriveSync`)
- Creación de un hook centralizado que escucha las mutaciones del estado global (`profile`, `xp`, `level`, `overallApropiacionPercent`, `deliverables`).
- Implementación de un mecanismo de **Debounce** (2 segundos): cuando el usuario escribe en los campos de edición (nombre, cédula, ficha), el sistema espera 2 segundos tras la última tecla pulsada para guardar automáticamente la fila en Google Sheets.
- Soporte para cola de reintentos silenciosa si la red experimenta fluctuaciones.

### Fase C: Integración con Eventos del Prototipo
- **Al editar el aprendiz:** Auto-sync inmediato tras guardar/editar.
- **Al culminar una evaluación o test diagnóstico:** Auto-sync automático con el puntaje obtenido y puntos XP.
- **Al validar un entregable de la empresa simulada:** Registro desatendido en la pestaña `Entregables_Empresa_Simulada`.
- **Al desbloquear una insignia o nivel:** Actualización automática en la columna de insignias de la hoja de cálculo.

### Fase D: Experiencia de Usuario e Indicador No Intrusivo
- Reemplazo de los diálogos modales repetitivos por un badge de estado sutil en la cabecera institucional y en la tarjeta de edición:
  - 🟢 **Sincronizado en Drive** (Último guardado: hace un momento).
  - 🟡 **Guardando cambios en Google Drive...** (Animación de carga discreta).
  - ⚪ **Sesión de Drive inactiva** (Solo visible si no se ha iniciado sesión, con un único botón de acceso).
- Se mantendrá el botón de inspección y enlace directo para que el usuario siempre pueda abrir y consultar su hoja en Google Drive con un clic.

---

## 3. Verificación y Criterios de Aceptación
1. **Cero Clics de Configuración:** Tras iniciar sesión con Google una sola vez, nunca más se solicitará configurar, crear o vincular manualmente la hoja.
2. **Cero Clics de Guardado:** Cualquier cambio en el nombre, documento, avance curricular o actividades formativas se refleja automáticamente en la hoja de Google Drive.
3. **Persistencia Multi-Pestaña:** La hoja de cálculo se actualiza tanto en `Aprendices_Registro` como en `Entregables` y `Evaluaciones`.
4. **Respeto a las Políticas de Privacidad:** El token de acceso se mantiene en memoria sin exponerse, garantizando la seguridad de la cuenta de Google del usuario.

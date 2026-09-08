# Músculos IA

Aplicación para estudiar los músculos del PDF **Músculos Completos.pdf**: un músculo por vez, cinco campos de texto reales y corrección con IA.

## Cómo usar

1. Escoge **PC / Móvil** o **iPad**.
2. Escribe origen, inserción, inervación, irrigación y función.
3. Pulsa **Revisar con IA**.
4. Si lo necesitas, **Ver respuesta** (ocultas por defecto).
5. Pasa al siguiente músculo. El progreso se guarda solo.

## Datos

Los 61 músculos están en `src/data/muscles.ts`, extraídos del PDF en el mismo orden del documento. No hay músculos ni campos inventados.

## IA

La corrección llama a Grok desde el servidor (`src/services/ai.ts`) con `XAI_API_KEY`. No hay claves en el frontend.

- Modelo por defecto: `grok-4.5` (cámbiarlo en `src/services/ai.ts`).
- Si no hay red o la API no responde, puedes seguir escribiendo y navegando. Aparece el aviso de modo sin conexión y, si revisas, una evaluación local de respaldo.

## Progreso

Se guarda en `localStorage` (`musculos-ia-progress-v1`): respuestas, resultados, músculos marcados y el último músculo visitado.

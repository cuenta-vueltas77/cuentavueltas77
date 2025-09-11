# CV77 Starter v3 — Secciones Pro
Incluye nuevas secciones listas:
- **Reglas & banderas** (explicaciones + link a trivia)
- **Sección técnica** (fichas, specs, callouts)
- **Piloto de la fecha** (candidatos + votación con Google Forms y resultados embebibles)
- **Trivias & juegos** (quiz de banderas en JS, sin backend)

Navegación:
- Nuevo menú **Más** con estas secciones.
- CTA de **La Banda del Sur** se mantiene.

Cómo publicar “Piloto de la fecha”:
1. Creá un Google Form con pregunta de opción múltiple (los candidatos).
2. Poné el link del Form en los botones “Votar”.
3. Vinculá el Form a una Sheet → insertá un gráfico de resultados → **Archivo → Publicar en la web → Incrustar**.
4. Pegá el `<iframe>` en `piloto-de-la-fecha/index.html` en el bloque "Resultados".

Cómo editar la trivia:
- Archivo: `assets/js/trivia.js`. Modificá el array `QUESTIONS` o creá otro juego similar.

Listo para GitHub Pages (100% estático).

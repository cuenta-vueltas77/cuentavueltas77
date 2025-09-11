// polls-mini.js — Mini encuestas por categoría con opción "Otros"
(function () {
  const KEY = (id) => 'cv77:poll:' + id + ':v1';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    document.querySelectorAll('.cv77-pmini').forEach(initPoll);
  }

  function initPoll($poll, index) {
    const POLL_ID = $poll.dataset.pollId || ('poll-' + (index + 1));
    const SHUFFLE = parseBool($poll.dataset.shuffle);

    const $form    = $poll.querySelector('.pmini-form');
    const $results = $poll.querySelector('.pmini-results');
    const $msg     = $poll.querySelector('.pmini-msg');
    const $list    = $poll.querySelector('.pmini-list');

    if (!$form || !$results || !$list) return;

    const radios = [...$form.querySelectorAll('input[type="radio"]')];
    if (radios.length === 0) return;

    // Name común para el grupo
    const commonName = radios[0].name || POLL_ID;
    radios.forEach(r => r.name = commonName);

    // Referencias a "Otros"
    const $otherRadio = $form.querySelector('input[type="radio"][data-other]');
    const $otherInput = $form.querySelector('.pmini-other');

    // Barajar opciones si se pidió (NO mezcla el input de otros, sólo el label completo)
    if (SHUFFLE) shuffleOptions($form);

    // Seeds: 1 por opción visible (incluye el "Otros" agregando 0 por defecto)
    const seeds = getSeeds($poll, radios.length);

    function optionNames() {
      // Nombres de radios (incluye "__OTROS__" si existe)
      return [...$form.querySelectorAll('input[type="radio"]')].map(r => r.value);
    }

    function baseTotals() {
      // Inicia con seeds; para "__OTROS__" la semilla NO se usa si luego aparece un nombre real
      const names = optionNames();
      const totals = {};
      names.forEach((n, i) => totals[n] = seeds[i] || 0);
      return totals;
    }

    function getTotals() {
      const totals = baseTotals();

      // Sumar el voto guardado (puede ser un nombre que NO exista en options)
      const saved = localStorage.getItem(KEY(POLL_ID));
      if (saved) {
        if (totals[saved] == null) totals[saved] = 0; // si es un "otro" nuevo, iniciarlo
        totals[saved] += 1;
      }

      // Si existe "__OTROS__", no mostrarlo como categoría por separado si hay un "otro" con nombre.
      // Mantener "__OTROS__" solo si nadie escribió nada y querés mostrar su semilla (no recomendado).
      if ('__OTROS__' in totals) {
        // Si hay alguna clave distinta a las opciones predefinidas y no es "__OTROS__", mantenemos esas.
        // Podés forzar a cero la barra "__OTROS__" para evitar confusiones:
        totals['__OTROS__'] = 0;
      }

      return totals;
    }

    function renderResults(highlight) {
      const totals = getTotals();
      const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

      // Mostrar todas las claves presentes (incluye los "otros" ya escritos)
      const names = Object.keys(totals);

      $list.innerHTML = '';
      names.forEach(name => {
        // No listar la clave técnica "__OTROS__"
        if (name === '__OTROS__') return;
        const val = totals[name] ?? 0;
        const pct = Math.round((val / sum) * 1000) / 10; // 1 decimal
        const li = document.createElement('li');
        li.className = 'pmini-row';
        li.style.setProperty('--pct', pct + '%');
        li.innerHTML = `
          <span class="pmini-badge">${pct.toFixed(1)}%</span>
          <span class="pmini-label">${escapeHTML(name)}</span>
        `;
        if (highlight === name) li.style.outline = '2px solid #fff';
        $list.appendChild(li);
      });
    }

    function showResults(highlight) {
      renderResults(highlight);
      $form.hidden = true;
      $results.hidden = false;
    }
    function showForm() {
      $results.hidden = true;
      $form.hidden = false;
    }

    // Habilitar/deshabilitar input de "Otros" según selección
    $form.addEventListener('change', () => {
      if (!$otherRadio || !$otherInput) return;
      const isOther = $otherRadio.checked;
      $otherInput.disabled = !isOther;
      if (isOther) $otherInput.focus();
    });

    $form.addEventListener('click', (e) => {
      const act = e.target.closest('[data-action]')?.dataset.action;
      if (!act) return;

      if (act === 'vote') {
        const checked = $form.querySelector('input[type="radio"]:checked');
        if (!checked) { if ($msg) $msg.textContent = 'Elegí una opción para votar 😉'; return; }

        let choice = checked.value;

        // Si eligió "Otros", usar el texto escrito
        if ($otherRadio && checked === $otherRadio) {
          const name = ($otherInput?.value || '').trim();
          if (!name) { if ($msg) $msg.textContent = 'Escribí el nombre en “Otros” 🙂'; return; }
          // Validaciones simples
          if (name.length > 48) { if ($msg) $msg.textContent = 'Nombre muy largo (máx. 48)'; return; }
          choice = name;
        }

        const k = KEY(POLL_ID);
        if (!localStorage.getItem(k)) localStorage.setItem(k, choice);

        if ($msg) $msg.textContent = '¡Gracias por votar!';
        showResults(choice);
      }

      if (act === 'see') {
        if ($msg) $msg.textContent = '';
        showResults();
      }
    });

    $results.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="back"]')) showForm();
    });

    // Si ya votó esa categoría, mostrar resultados directo
    if (localStorage.getItem(KEY(POLL_ID))) {
      showResults();
      if ($msg) $msg.textContent = 'Ya votaste en esta categoría ✅';
    }
  }

  function getSeeds($poll, n) {
    const raw = ($poll.dataset.seed || '').trim();
    if (!raw) return Array.from({ length: n }, (_, i) => 1); // default 1-1-1…
    const nums = raw.split(',').map(s => parseInt(s.trim(), 10));
    if (nums.length !== n || nums.some(isNaN)) return Array.from({ length: n }, () => 1);
    return nums;
  }

  function parseBool(v) {
    return (v + '').toLowerCase() === 'true' || v === '1';
  }

  function shuffleOptions($form) {
    const labels = [...$form.querySelectorAll('.pmini-opt')];
    for (let i = labels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      $form.insertBefore(labels[j], labels[i]);
      [labels[i], labels[j]] = [labels[j], labels[i]];
    }
  }

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, c => (
      { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[c]
    ));
  }
})();

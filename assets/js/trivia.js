
(function(){
  const QUESTIONS = [
    { q: "¿Qué indica la bandera AMARILLA en pista?",
      answers: ["Pista libre", "Peligro: reducir velocidad, no adelantar", "Fin de carrera", "Auto lento adelante"],
      correct: 1, explain: "Bandera amarilla = peligro en el sector. Levantá, no adelantás hasta pasar la zona." },
    { q: "La bandera a CUADROS significa…",
      answers: ["Auto de seguridad", "Reinicio", "Fin de sesión/carrera", "Boxes cerrados"],
      correct: 2, explain: "Bandera a cuadros: se terminó la tanda o la carrera." },
    { q: "Con bandera AZUL, el piloto debe…",
      answers: ["Dejar pasar a un auto más rápido que viene a superarlo", "Detenerse en boxes", "Salir a pista", "Reducir a 60 km/h"],
      correct: 0, explain: "Bandera azul = hay un auto más veloz que te está por alcanzar. Facilitá el sobrepaso." }
  ];
  function $(sel, ctx=document){ return ctx.querySelector(sel); }
  function renderQuiz(mountId){
    const mount = document.getElementById(mountId);
    if(!mount) return;
    let idx = 0, score = 0;
    mount.innerHTML = `
      <div class="quiz">
        <h3>Trivia de banderas</h3>
        <div class="q"></div>
        <div class="answers"></div>
        <div class="progress"></div>
        <div class="result"></div>
        <div style="margin-top:12px"><button class="btn" id="nextBtn" disabled>Siguiente</button></div>
      </div>`;
    const qEl = $(".q", mount), ansEl = $(".answers", mount), progEl = $(".progress", mount),
          resEl = $(".result", mount), nextBtn = $("#nextBtn", mount);
    function showQuestion(i){
      const item = QUESTIONS[i];
      qEl.textContent = item.q;
      ansEl.innerHTML = ""; resEl.textContent = ""; nextBtn.disabled = true;
      item.answers.forEach((text, ai)=>{
        const btn = document.createElement("button");
        btn.className = "answer-btn"; btn.textContent = text;
        btn.addEventListener("click", ()=>{
          Array.from(ansEl.children).forEach(b=>b.disabled=true);
          const correct = (ai === item.correct);
          btn.style.borderColor = correct ? "#1aae49" : "#d11a2a";
          if(correct) score++;
          resEl.innerHTML = (correct ? "¡Correcto! " : "Ups, no.") + " " + (item.explain || "");
          nextBtn.disabled = false;
        });
        ansEl.appendChild(btn);
      });
      progEl.textContent = `Pregunta ${i+1} de ${QUESTIONS.length}`;
    }
    nextBtn.addEventListener("click", ()=>{
      idx++;
      if(idx < QUESTIONS.length) showQuestion(idx);
      else {
        const pct = Math.round((score/QUESTIONS.length)*100);
        mount.querySelector(".quiz").innerHTML = `
          <h3>Resultado</h3>
          <p>Tu puntaje: <b>${score}/${QUESTIONS.length}</b> (${pct}%).</p>
          <p class="lead">¿Hacemos otra? Mandanos preguntas para la próxima fecha 😉</p>
          <div style="margin-top:12px"><button class="btn" id="retryBtn">Reintentar</button></div>`;
        const b = $("#retryBtn", mount); if(b) b.addEventListener("click", ()=> renderQuiz(mountId));
        try{ localStorage.setItem("cv77_trivia_best", Math.max(pct, +(localStorage.getItem("cv77_trivia_best")||0))); }catch{}
      }
    });
    showQuestion(idx);
  }
  window.CV77Trivia = { renderQuiz };
})();

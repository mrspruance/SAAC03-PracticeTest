/* Lógica del simulador SAA-C03 (modo práctica y modo examen cronometrado) */
(function () {
  "use strict";

  // Estado
  let quiz = [];          // preguntas de la sesión actual
  let index = 0;          // índice de la pregunta actual
  let answers = [];       // respuestas del usuario: array de arrays de índices seleccionados
  let confirmed = [];     // booleanos: si la pregunta fue confirmada (modo práctica)
  let correctCount = 0;   // aciertos (modo práctica, acumulado en vivo)
  let mode = "practice";  // "practice" | "exam"
  let timerId = null;     // intervalo del temporizador
  let remaining = 0;      // segundos restantes (modo examen)

  const el = (id) => document.getElementById(id);
  const startScreen = el("startScreen");
  const quizScreen = el("quizScreen");
  const resultScreen = el("resultScreen");
  const headerStats = el("headerStats");

  const timerStat = el("timerStat");
  const timerText = el("timerText");
  const scoreStat = el("scoreStat");
  const progressText = el("progressText");
  const scoreText = el("scoreText");
  const progressFill = el("progressFill");
  const domainTag = el("domainTag");
  const questionText = el("questionText");
  const multiHint = el("multiHint");
  const answersForm = el("answersForm");
  const confirmBtn = el("confirmBtn");
  const nextBtn = el("nextBtn");
  const prevBtn = el("prevBtn");
  const finishBtn = el("finishBtn");
  const explanation = el("explanation");
  const resultBanner = el("resultBanner");
  const explanationList = el("explanationList");
  const docLink = el("docLink");

  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getMode() {
    const checked = document.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : "practice";
  }

  // Mostrar/ocultar el selector de duración según el modo elegido
  document.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.addEventListener("change", () => {
      el("durationField").hidden = getMode() !== "exam";
    });
  });

  function startQuiz() {
    const count = parseInt(el("questionCount").value, 10);
    const doShuffle = el("shuffleQuestions").checked;
    const newOnly = el("newQuestionsOnly").checked;
    mode = getMode();

    let pool = QUESTIONS.slice();
    if (newOnly) pool = pool.filter((q) => q.new === true);
    if (doShuffle) pool = shuffle(pool);
    if (count > 0) pool = pool.slice(0, count);

    quiz = pool.map((q) => {
      const opts = doShuffle ? shuffle(q.options) : q.options.slice();
      return { ...q, options: opts };
    });

    index = 0;
    correctCount = 0;
    answers = quiz.map(() => []);
    confirmed = quiz.map(() => false);

    startScreen.hidden = true;
    resultScreen.hidden = true;
    quizScreen.hidden = false;
    headerStats.hidden = false;

    // Configurar UI según modo
    if (mode === "exam") {
      scoreStat.hidden = true;        // ocultar puntaje en vivo
      timerStat.hidden = false;
      startTimer();
    } else {
      scoreStat.hidden = false;
      timerStat.hidden = true;
    }

    renderQuestion();
    updateStats();
  }

  /* ---------- Temporizador (modo examen) ---------- */
  function startTimer() {
    let secs = parseInt(el("examDuration").value, 10);
    if (!secs || secs <= 0) secs = quiz.length * 120; // ~2 min por pregunta
    remaining = secs;
    updateTimerDisplay();
    timerStat.classList.remove("warning", "danger");
    timerId = setInterval(() => {
      remaining--;
      updateTimerDisplay();
      if (remaining <= 60) timerStat.classList.add("danger");
      else if (remaining <= 300) timerStat.classList.add("warning");
      if (remaining <= 0) {
        stopTimer();
        showResults(); // tiempo agotado -> finaliza automáticamente
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimerDisplay() {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timerText.textContent =
      String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /* ---------- Render de pregunta ---------- */
  function renderQuestion() {
    const q = quiz[index];
    explanation.hidden = true;

    domainTag.textContent = q.domain;
    if (q.new) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = "NEW";
      domainTag.appendChild(badge);
    }
    questionText.textContent = `${index + 1}. ${q.text}`;
    multiHint.hidden = !q.multiple;
    progressFill.style.width = `${((index) / quiz.length) * 100}%`;

    const inputType = q.multiple ? "checkbox" : "radio";
    const alreadyConfirmed = confirmed[index]; // solo aplica en práctica
    const saved = answers[index] || [];

    answersForm.innerHTML = "";
    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      label.className = "answer";
      label.dataset.i = i;

      const input = document.createElement("input");
      input.type = inputType;
      input.name = "answer";
      input.value = i;
      if (saved.includes(i)) {
        input.checked = true;
        label.classList.add("selected");
      }

      const letter = document.createElement("span");
      letter.className = "letter";
      letter.textContent = `${LETTERS[i]}.`;

      const text = document.createElement("span");
      text.textContent = opt.text;

      label.appendChild(input);
      label.appendChild(letter);
      label.appendChild(text);
      answersForm.appendChild(label);

      input.addEventListener("change", onSelectionChange);
    });

    // Botonera según modo
    if (mode === "exam") {
      confirmBtn.hidden = true;                 // sin confirmar/feedback en examen
      prevBtn.hidden = false;
      prevBtn.disabled = index === 0;
      const last = index === quiz.length - 1;
      nextBtn.hidden = last;
      finishBtn.hidden = !last;
    } else {
      // Modo práctica
      prevBtn.hidden = true;
      if (alreadyConfirmed) {
        // Reconstruir el estado de feedback ya confirmado
        showFeedback(true);
      } else {
        confirmBtn.hidden = false;
        confirmBtn.disabled = saved.length === 0;
        nextBtn.hidden = true;
        finishBtn.hidden = true;
      }
    }
  }

  function onSelectionChange() {
    const inputs = answersForm.querySelectorAll("input");
    inputs.forEach((inp) => {
      inp.closest(".answer").classList.toggle("selected", inp.checked);
    });
    // Guardar selección actual (permite persistir al navegar en modo examen)
    answers[index] = getSelectedIndices();

    if (mode === "practice" && !confirmed[index]) {
      confirmBtn.disabled = answers[index].length === 0;
    }
  }

  function getSelectedIndices() {
    return Array.from(answersForm.querySelectorAll("input:checked")).map((i) =>
      parseInt(i.value, 10)
    );
  }

  function arraysEqualAsSets(a, b) {
    if (a.length !== b.length) return false;
    const sa = new Set(a);
    return b.every((x) => sa.has(x));
  }

  function correctIndicesOf(q) {
    return q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
  }

  /* ---------- Modo práctica: confirmar y mostrar feedback ---------- */
  function confirmAnswer() {
    const wasConfirmed = confirmed[index];
    answers[index] = getSelectedIndices();
    if (!wasConfirmed) {
      confirmed[index] = true;
      const isCorrect = arraysEqualAsSets(answers[index], correctIndicesOf(quiz[index]));
      if (isCorrect) correctCount++;
    }
    showFeedback(false);
    updateStats();
  }

  // Pinta el feedback de la pregunta actual (modo práctica)
  function showFeedback() {
    const q = quiz[index];
    const selected = answers[index] || [];
    const correctIdx = correctIndicesOf(q);
    const isCorrect = arraysEqualAsSets(selected, correctIdx);

    const labels = answersForm.querySelectorAll(".answer");
    labels.forEach((label) => {
      const i = parseInt(label.dataset.i, 10);
      const input = label.querySelector("input");
      input.disabled = true;
      label.classList.add("disabled");
      label.classList.remove("selected");
      if (q.options[i].correct) label.classList.add("correct");
      else if (selected.includes(i)) label.classList.add("incorrect");
    });

    resultBanner.className = "result-banner " + (isCorrect ? "ok" : "bad");
    resultBanner.textContent = isCorrect
      ? "✓ ¡Respuesta correcta!"
      : "✗ Respuesta incorrecta. Revisa la explicación de cada alternativa.";

    explanationList.innerHTML = "";
    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.className = opt.correct ? "good" : "bad";
      const tag = document.createElement("span");
      tag.className = "tag " + (opt.correct ? "good" : "bad");
      tag.textContent = `${LETTERS[i]}. ${opt.correct ? "Correcta" : "Incorrecta"}:`;
      li.appendChild(tag);
      li.appendChild(document.createTextNode(" " + opt.explanation));
      explanationList.appendChild(li);
    });

    if (q.doc) { docLink.href = q.doc; docLink.hidden = false; }
    else docLink.hidden = true;

    explanation.hidden = false;
    confirmBtn.hidden = true;
    prevBtn.hidden = true;
    const last = index === quiz.length - 1;
    nextBtn.hidden = last;
    finishBtn.hidden = !last;
    if (last) finishBtn.textContent = "Ver resultados";
    else nextBtn.textContent = "Siguiente";

    progressFill.style.width = `${((index + 1) / quiz.length) * 100}%`;
  }

  /* ---------- Navegación ---------- */
  function nextQuestion() {
    if (index < quiz.length - 1) {
      index++;
      renderQuestion();
      updateStats();
    }
  }

  function prevQuestion() {
    if (index > 0) {
      index--;
      renderQuestion();
      updateStats();
    }
  }

  function updateStats() {
    progressText.textContent = `${index + 1} / ${quiz.length}`;
    if (mode === "practice") {
      const answered = confirmed.filter(Boolean).length;
      const pct = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;
      scoreText.textContent = `${pct}%`;
    }
  }

  /* ---------- Resultados ---------- */
  function computeCorrect() {
    let n = 0;
    quiz.forEach((q, qi) => {
      if (arraysEqualAsSets(answers[qi] || [], correctIndicesOf(q))) n++;
    });
    return n;
  }

  function showResults() {
    stopTimer();
    quizScreen.hidden = true;
    resultScreen.hidden = false;
    headerStats.hidden = true;

    const total = quiz.length;
    // En examen el conteo se calcula al final; en práctica usamos el acumulado.
    const correct = mode === "exam" ? computeCorrect() : correctCount;
    const pct = Math.round((correct / total) * 100);
    el("finalScore").textContent = `${pct}%`;

    const deg = (pct / 100) * 360;
    const color = pct >= 72 ? "#16a34a" : pct >= 50 ? "#ff9900" : "#dc2626";
    el("scoreCircle").style.background =
      `conic-gradient(${color} ${deg}deg, #eef2f7 ${deg}deg)`;

    const passMsg =
      pct >= 72
        ? "¡Buen trabajo! Estás en el rango aprobatorio de referencia (~72%)."
        : "Sigue practicando. El puntaje aprobatorio de referencia del examen es ~72%.";
    const modeMsg = mode === "exam" ? " (modo examen cronometrado)" : "";
    el("resultSummary").textContent =
      `Respondiste correctamente ${correct} de ${total} preguntas${modeMsg}. ${passMsg}`;

    buildReview();
    el("reviewContainer").hidden = true;
    el("reviewBtn").textContent =
      mode === "exam" ? "Ver respuestas y explicaciones" : "Revisar respuestas";
  }

  function buildReview() {
    const container = el("reviewContainer");
    container.innerHTML = "";
    quiz.forEach((q, qi) => {
      const correctIdx = correctIndicesOf(q);
      const chosenList = answers[qi] || [];
      const isCorrect = arraysEqualAsSets(chosenList, correctIdx);
      const answeredNothing = chosenList.length === 0;

      const item = document.createElement("div");
      item.className = "review-item";

      const title = document.createElement("h4");
      const status = document.createElement("span");
      status.className = "review-status " + (isCorrect ? "ok" : "bad");
      status.textContent = isCorrect
        ? "Correcta"
        : answeredNothing
        ? "Sin responder"
        : "Incorrecta";
      title.textContent = `${qi + 1}. ${q.text} `;
      title.appendChild(status);
      item.appendChild(title);

      const ul = document.createElement("ul");
      ul.className = "explanation-list";
      q.options.forEach((opt, i) => {
        const li = document.createElement("li");
        li.className = opt.correct ? "good" : "bad";
        const chosen = chosenList.includes(i);
        const tag = document.createElement("span");
        tag.className = "tag " + (opt.correct ? "good" : "bad");
        tag.textContent = `${LETTERS[i]}.${chosen ? " (tu elección)" : ""} ${opt.correct ? "Correcta" : "Incorrecta"}:`;
        li.appendChild(tag);
        li.appendChild(document.createTextNode(" " + opt.explanation));
        ul.appendChild(li);
      });
      item.appendChild(ul);

      if (q.doc) {
        const a = document.createElement("a");
        a.className = "doc-link";
        a.href = q.doc;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "📖 Documentación de AWS relacionada";
        item.appendChild(a);
      }
      container.appendChild(item);
    });
  }

  function toggleReview() {
    const container = el("reviewContainer");
    container.hidden = !container.hidden;
    const label = mode === "exam" ? "respuestas y explicaciones" : "revisión";
    el("reviewBtn").textContent = container.hidden
      ? (mode === "exam" ? "Ver respuestas y explicaciones" : "Revisar respuestas")
      : "Ocultar " + label;
  }

  function restart() {
    stopTimer();
    resultScreen.hidden = true;
    headerStats.hidden = true;
    startScreen.hidden = false;
  }

  // Eventos
  el("startBtn").addEventListener("click", startQuiz);
  confirmBtn.addEventListener("click", confirmAnswer);
  nextBtn.addEventListener("click", nextQuestion);
  prevBtn.addEventListener("click", prevQuestion);
  finishBtn.addEventListener("click", showResults);
  el("reviewBtn").addEventListener("click", toggleReview);
  el("restartBtn").addEventListener("click", restart);
})();

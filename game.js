// Все доступные эмодзи (8 штук = 8 пар)
const EMOJIS = ["🍎", "🍌", "🍇", "🍓", "🍑", "🍍", "🥝", "🍒"];

// Элементы
const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restartBtn");
const winOverlay = document.getElementById("winOverlay");
const winMovesEl = document.getElementById("winMoves");
const winTimeEl = document.getElementById("winTime");
const playAgainBtn = document.getElementById("playAgainBtn");

// Состояние игры
let cards = []; // значения карточек
let firstCard = null; // первая выбранная карточка
let secondCard = null; // вторая выбранная
let lockBoard = false; // блокируем клики, пока сравниваем
let moves = 0;
let matches = 0;
let seconds = 0;
let timer = null;
let gameStarted = false;

// Перемешать массив
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Форматирование времени
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Запуск таймера
function startTimer() {
  if (gameStarted) return;
  gameStarted = true;
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

// Остановка таймера
function stopTimer() {
  clearInterval(timer);
  timer = null;
  gameStarted = false;
}

// Создание карточки
function createCard(value) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.value = value;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">?</div>
      <div class="card-back">${value}</div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card));
  return card;
}

// Переворот карточки
function flipCard(card) {
  if (lockBoard) return; // идёт сравнение
  if (card.classList.contains("flipped")) return; // уже открыта
  if (card.classList.contains("matched")) return; // уже найдена

  startTimer();
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

// Проверка совпадения
function checkMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    resetSelection();

    // проверка победы
    if (matches === EMOJIS.length) {
      setTimeout(showWin, 600);
    }
  } else {
    // не совпало — переворачиваем обратно через полсекунды
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetSelection();
      lockBoard = false;
    }, 800);
  }
}

// Сбросить выбранные карточки
function resetSelection() {
  firstCard = null;
  secondCard = null;
}

// Показ экрана победы
function showWin() {
  stopTimer();
  winMovesEl.textContent = moves;
  winTimeEl.textContent = formatTime(seconds);
  winOverlay.classList.add("show");
}

// Новая игра
function startGame() {
  // сброс состояния
  stopTimer();
  seconds = 0;
  moves = 0;
  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  movesEl.textContent = "0";
  timeEl.textContent = "0:00";
  winOverlay.classList.remove("show");

  // создаём перемешанный массив
  cards = shuffle([...EMOJIS, ...EMOJIS]);

  // очищаем и заполняем поле
  boardEl.innerHTML = "";
  cards.forEach((value) => {
    boardEl.appendChild(createCard(value));
  });
}

// Кнопки
restartBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

// Старт
startGame();

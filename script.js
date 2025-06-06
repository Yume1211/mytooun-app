// 背景音楽
const bgm = new Audio("background.mp3");
bgm.loop = true;
bgm.volume = 0.3;
bgm.play();

function startBGM() {
  bgm.play().then(() => {
    console.log("BGM再生スタート！");
  }).catch(error => {
    console.log("BGM再生失敗:", error);
  });
}

// トゥン体調自動表示
function updateToonMood() {
  const today = new Date();
  const mood = getToonMood(today);
  document.getElementById("talkText").innerText = `トゥン「${mood}トゥン〜！」`;

  const toonImage = document.getElementById("toonImage");
  if (mood === "お腹痛い") {
    toonImage.src = "toon_jitabata.png";
  } else if (mood === "イライラ") {
    toonImage.src = "toon_nakimushi.png";
  } else if (mood === "眠い") {
    toonImage.src = "toon_yodare.png";
  } else {
    toonImage.src = "toontun.png";
  }
}
updateToonMood();

function getToonMood(today) {
  const startDateStr = localStorage.getItem('startDate');
  const cycleLength = parseInt(localStorage.getItem('cycleLength')) || 28;
  const periodLength = 5;
  const pmsDays = 5;

  if (!startDateStr) {
    return "元気";
  }

  const startDate = new Date(startDateStr);
  let periodStart = new Date(startDate);

  while (periodStart <= today) {
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + periodLength - 1);

    if (today >= periodStart && today <= periodEnd) {
      return "お腹痛い";
    }

    const pmsStart = new Date(periodStart);
    pmsStart.setDate(periodStart.getDate() - pmsDays);
    const pmsEnd = new Date(periodStart);
    pmsEnd.setDate(periodStart.getDate() - 1);
    if (today >= pmsStart && today <= pmsEnd) {
      return "イライラ";
    }

    const ovulationDate = new Date(periodStart);
    ovulationDate.setDate(periodStart.getDate() + 14);
    if (today.getTime() === ovulationDate.getTime()) {
      return "眠い";
    }

    periodStart.setDate(periodStart.getDate() + cycleLength);
  }

  return "元気";
}

// おやつ
function feedToon() {
  playSound("button.mp3");

  // メッセージ表示
  const messages = [
    "ケーキを食べたトゥン〜！甘くて幸せトゥン♪",
    "にんじん食べたトゥン〜！元気モリモリトゥン♪",
    "りんご食べたトゥン〜！健康トゥン♪"
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = "おいしいトゥン〜！\n" + messages[randomIndex];

  document.getElementById("talkText").innerText = message;
  document.getElementById("toonImage").src = "toon_tabemakuri.png";
  playSound("eating.mp3");

  setTimeout(() => {
    updateToonMood();
  }, 3000);

  closeFoodMenu();
}

function playSound(soundFile) {
  const sound = new Audio(soundFile);
  sound.play();
}

// 画面切り替え
function showScreen(screenId) {
  document.getElementById('calendar-screen').classList.add('hidden');
  document.getElementById('fortune-screen').classList.add('hidden');
  document.getElementById('settings-screen').classList.add('hidden');
  document.getElementById('foodMenu').classList.add('hidden');

  if (screenId === 'top') {
    document.getElementById('toonImage').style.display = 'block';
    document.getElementById('toontalk').style.display = 'flex';
    updateToonMood();
  } else {
    document.getElementById('toonImage').style.display = 'none';
    document.getElementById('toontalk').style.display = 'none';
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
  }

  if (screenId === 'calendar') {
    renderCalendar();
  }
}

// 食べ物
function openFoodMenu() {
  document.getElementById('foodMenu').classList.remove('hidden');
}
function closeFoodMenu() {
  document.getElementById('foodM

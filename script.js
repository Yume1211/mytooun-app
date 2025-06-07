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

  if (!startDateStr) return "元気";

  const startDate = new Date(startDateStr);
  let periodStart = new Date(startDate);

  while (periodStart <= today) {
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + periodLength - 1);

    if (today >= periodStart && today <= periodEnd) return "お腹痛い";

    const pmsStart = new Date(periodStart);
    pmsStart.setDate(periodStart.getDate() - pmsDays);
    const pmsEnd = new Date(periodStart);
    pmsEnd.setDate(periodStart.getDate() - 1);
    if (today >= pmsStart && today <= pmsEnd) return "イライラ";

    const ovulationDate = new Date(periodStart);
    ovulationDate.setDate(periodStart.getDate() + 14);
    if (today.getTime() === ovulationDate.getTime()) return "眠い";

    periodStart.setDate(periodStart.getDate() + cycleLength);
  }

  return "元気";
}

// おやつ
function feedToon() {
  playSound("button.mp3");
  const messages = [
    "ケーキを食べたトゥン〜！甘くて幸せトゥン♪",
    "にんじん食べたトゥン〜！元気モリモリトゥン♪",
    "りんご食べたトゥン〜！健康トゥン♪"
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  document.getElementById("talkText").innerText = "おいしいトゥン〜！\n" + messages[randomIndex];
  document.getElementById("toonImage").src = "toon_tabemakuri.png";
  playSound("eating.mp3");
  setTimeout(() => updateToonMood(), 3000);
  closeFoodMenu();
}

function playSound(soundFile) {
  const sound = new Audio(soundFile);
  sound.play();
}

// 画面切替
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

  if (screenId === 'calendar') renderCalendar();
}

// 生理日記録・編集ボタン
let isPeriodEditMode = false;
function togglePeriodEditMode() {
  isPeriodEditMode = !isPeriodEditMode;
  const button = document.getElementById("editPeriodButton");
  button.innerText = isPeriodEditMode ? "編集モード終了" : "生理日を記録・編集";
  renderCalendar();
}

// カレンダー
function renderCalendar() {
  const storedPeriodDates = JSON.parse(localStorage.getItem('periodDates')) || [];
  const startDateStr = localStorage.getItem('startDate');
  const cycleLength = parseInt(localStorage.getItem('cycleLength')) || 28;
  const periodLength = 5;
  const events = [];

  storedPeriodDates.forEach(dateStr => {
    events.push({ title: '🍓 生理日', start: dateStr, color: '#ff99bb' });
  });

  if (startDateStr) {
    let periodDate = new Date(startDateStr);
    for (let i = 0; i < 12; i++) {
      const ovulation = new Date(periodDate);
      ovulation.setDate(periodDate.getDate() + 14);
      events.push({ title: '🥚 排卵日', start: ovulation.toISOString().split('T')[0], color: '#ffd966' });
      periodDate.setDate(periodDate.getDate() + cycleLength);
    }
  }

  const calendarEl = document.getElementById('calendar');
  calendarEl.innerHTML = "";
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ja',
    dateClick: function(info) {
      if (isPeriodEditMode) togglePeriodDate(info.dateStr);
    },
    events: events
  });
  calendar.render();
}

function togglePeriodDate(dateStr) {
  let periodDates = JSON.parse(localStorage.getItem('periodDates')) || [];
  if (periodDates.includes(dateStr)) {
    periodDates = periodDates.filter(date => date !== dateStr);
    alert(dateStr + " の生理日を削除したトゥン！");
  } else {
    periodDates.push(dateStr);
    alert(dateStr + " を生理日に登録したトゥン！");
  }
  localStorage.setItem('periodDates', JSON.stringify(periodDates));
  renderCalendar();
}


// 占い
function showZodiac() {
  const month = parseInt(document.getElementById("birthMonth").value);
  const day = parseInt(document.getElementById("birthDay").value);
  if (isNaN(month) || isNaN(day)) {
    alert("月と日を入力してトゥン〜！");
    return;
  }

  const zodiac = getZodiac(month, day);
  const fortunes = ["大吉トゥン〜！", "中吉トゥン〜！", "小吉トゥン〜！", "今日はゆっくり休むトゥン〜！"];
  const result = fortunes[Math.floor(Math.random() * fortunes.length)];
  document.getElementById("fortune-result").innerText = `あなたは ${zodiac} トゥン！今日の運勢は ${result}`;
}

function getZodiac(month, day) {
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "おひつじ座";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "おうし座";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return "ふたご座";
  if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return "かに座";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "しし座";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "おとめ座";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return "てんびん座";
  if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return "さそり座";
  if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return "いて座";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "やぎ座";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "みずがめ座";
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "うお座";
  return "不明トゥン〜！";
}

// 設定保存
function saveSettings() {
  localStorage.setItem('startDate', document.getElementById('startDate').value);
  localStorage.setItem('cycleLength', document.getElementById('cycleLength').value);
  alert('設定を保存したトゥン！');
}

// おやつ
function openFoodMenu() {
  document.getElementById('foodMenu').classList.remove('hidden');
}
function closeFoodMenu() {
  document.getElementById('foodMenu').classList.add('hidden');
}

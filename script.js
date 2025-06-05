// 画面表示切り替え
function showScreen(screenId) {
  document.getElementById('calendar-screen').classList.add('hidden');
  document.getElementById('fortune-screen').classList.add('hidden');
  document.getElementById('settings-screen').classList.add('hidden');
  document.getElementById('foodMenu').classList.add('hidden');

  if (screenId === 'top') {
    document.getElementById('toonImage').style.display = 'block';
    document.getElementById('toontalk').style.display = 'block';
  } else {
    document.getElementById('toonImage').style.display = 'none';
    document.getElementById('toontalk').style.display = 'none';
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
  }

  if (screenId === 'calendar') {
    renderCalendar();
  }
}

// 占い
function showZodiac() {
  const month = parseInt(document.getElementById("birthMonth").value);
  const day = parseInt(document.getElementById("birthDay").value);
  if (isNaN(month) || isNaN(day)) {
    alert("月と日を入力してトゥン〜！");
    return;
  }

  let zodiac = "";
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) zodiac = "おひつじ座";
  else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) zodiac = "おうし座";
  else if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) zodiac = "ふたご座";
  else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) zodiac = "かに座";
  else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) zodiac = "しし座";
  else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) zodiac = "おとめ座";
  else if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) zodiac = "てんびん座";
  else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) zodiac = "さそり座";
  else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) zodiac = "いて座";
  else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) zodiac = "やぎ座";
  else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) zodiac = "みずがめ座";
  else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) zodiac = "うお座";
  else zodiac = "不明トゥン〜！";

  const fortunes = ["大吉トゥン〜！", "中吉トゥン〜！", "小吉トゥン〜！", "今日はゆっくり休むトゥン〜！"];
  const result = fortunes[Math.floor(Math.random() * fortunes.length)];
  document.getElementById("fortune-result").innerText = `あなたは ${zodiac} トゥン！今日の運勢は ${result}`;
}

// 食べ物メニュー
function openFoodMenu() {
  document.getElementById('foodMenu').classList.remove('hidden');
}
function closeFoodMenu() {
  document.getElementById('foodMenu').classList.add('hidden');
}function feedToon(food) {
  let message = "";
  let imageFile = "";

  if (food === 'cake') {
    message = "ケーキを食べたトゥン〜！甘くて幸せトゥン♪";
    imageFile = "toon_tabemakuri.png";  // ← ここに自分で作った食べてるトゥンの画像名を入れる
  } else if (food === 'carrot') {
    message = "にんじん食べたトゥン〜！元気モリモリトゥン♪";
    imageFile = "toon_tabemakuri.png";
  } else if (food === 'apple') {
    message = "りんご食べたトゥン〜！健康トゥン♪";
    imageFile = "toon_tabemakuri.png";
  }

  document.getElementById("talkText").innerText = message;
  document.getElementById("toonImage").src = imageFile;  // ← ここで画像を変える！

  const sound = new Audio("eating.mp3");
sound.play();


  // 3秒後に元のトゥンに戻す
  setTimeout(() => {
    document.getElementById("toonImage").src = "toontun.png";
    document.getElementById("talkText").innerText = 'トゥン「元気トゥン〜！」';
  }, 3000);

  closeFoodMenu();
}


// 体調
function changeMood() {
  const mood = document.getElementById("mood").value;
  const toonImage = document.getElementById("toonImage");
  const talkText = document.getElementById("talkText");
  talkText.innerText = `トゥン「${mood}トゥン〜！」`;

  if (mood === "元気") toonImage.src = "toontun.png";
  else if (mood === "お腹痛い") toonImage.src = "toon_jitabata.png";
  else if (mood === "泣き虫") toonImage.src = "toon_nakimushi.png";
  else if (mood === "眠い") toonImage.src = "toon_yodare.png";
  else if (mood === "布団") toonImage.src = "toon_futon.png";
}

// カレンダー
function renderCalendar() {
  const startDateStr = localStorage.getItem('startDate');
  const cycleLength = parseInt(localStorage.getItem('cycleLength')) || 28;
  const periodLength = 5;

  if (!startDateStr) {
    alert('設定で生理開始日を登録してねトゥン！');
    return;
  }

  const startDate = new Date(startDateStr);
  const events = [];
  let periodDate = new Date(startDate);

  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < periodLength; j++) {
      const day = new Date(periodDate);
      day.setDate(periodDate.getDate() + j);
      events.push({
        title: '🍓 生理予定日',
        start: day.toISOString().split('T')[0],
        color: '#ff99bb'
      });
    }
    const ovulation = new Date(periodDate);
    ovulation.setDate(periodDate.getDate() + 14);
    events.push({
      title: '🥚 排卵予定日',
      start: ovulation.toISOString().split('T')[0],
      color: '#ffd966'
    });
    periodDate.setDate(periodDate.getDate() + cycleLength);
  }

  const calendarEl = document.getElementById('calendar');
  calendarEl.innerHTML = "";
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ja',
    events: events
  });
  calendar.render();
}

// 設定
function saveSettings() {
  localStorage.setItem('birthMonth', document.getElementById('setBirthMonth').value);
  localStorage.setItem('birthDay', document.getElementById('setBirthDay').value);
  localStorage.setItem('startDate', document.getElementById('startDate').value);
  localStorage.setItem('cycleLength', document.getElementById('cycleLength').value);
  alert('設定を保存したトゥン！');
}

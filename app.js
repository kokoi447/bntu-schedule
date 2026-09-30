/**
 * Telegram Mini App: Расписание группы 10603325 (БНТУ ЭФ)
 * Оптимизировано для мгновенного запуска в Telegram WebView
 */

(function () {
  'use strict';

  // 1. Инициализация Telegram WebApp сразу без задержек (полная совместимость с macOS Telegram)
  let tg = null;
  try {
    tg = window.Telegram?.WebApp;
    if (tg) {
      try { tg.ready(); } catch (e) {}
      try { tg.expand(); } catch (e) {}
      try { if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor('secondary_bg_color'); } catch (e) {}
    }
  } catch (e) {}


  function haptic(style = 'light') {
    try {
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
      }
    } catch (e) {}
  }

  // Безопасное хранилище (не падает в режиме инкогнито или заблокированных cookies)
  function safeGet(key, def) {
    try { return localStorage.getItem(key) || def; } catch (e) { return def; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  // 2. Встроенные данные расписания группы 10603325 (мгновенный рендер без ожидания fetch)
  const EMBEDDED_SCHEDULE = {
    "group": "10603325",
    "faculty": "Энергетический факультет",
    "university": "БНТУ",
    "course": 2,
    "term": "Осенний семестр 2026/2027",
    "semesterStart": "2026-09-01",
    "semesterEnd": "2026-12-28",
    "timeSlots": [
      { "lessonNumber": 1, "start": "08:00", "end": "09:35" },
      { "lessonNumber": 2, "start": "09:55", "end": "11:30" },
      { "lessonNumber": 3, "start": "11:40", "end": "13:15" },
      { "lessonNumber": 4, "start": "13:55", "end": "15:30" }
    ],
    "weeks": {
      "1": {
        "monday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Лекция", "subject": "Теоретические основы электротехники", "teacher": "ст.пр. Зеленко В.В.", "room": "ауд. 447 к. 1", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Электротехнические материалы", "teacher": "ст.пр. Конохов М.С.", "room": "ауд. 447 к. 1", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Физика", "teacher": "—", "room": "ауд. 415 к. 11", "subgroup": "вся группа" }
        ],
        "tuesday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Практика", "subject": "Английский язык", "teacher": "пр. Романова П.В.", "room": "ауд. 406а к. 18", "subgroup": "вся группа" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Метрология, стандартизация и оценка соответствия", "teacher": "доц. Савкова Е.Н.", "room": "ауд. 339 к. 1", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Электротехнические материалы", "teacher": "пр. Титович А.М.", "room": "ауд. 1 к. 2", "subgroup": "1 подгруппа" }
        ],
        "wednesday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Физкультура", "subject": "Физическая культура", "teacher": "ст.пр. Шкробов Д.В., ст.пр. Седнева А.В., ст.пр. Пильневич А.А.", "room": "спорткомплекс", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Физика", "teacher": "ст.пр. Степанов М.А.", "room": "ауд. 306 к. 11", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лекция", "subject": "Математика", "teacher": "пр. Бричикова А.П.", "room": "ауд. 306 к. 11", "subgroup": "общий поток" }
        ],
        "thursday": [
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Практика", "subject": "Математика", "teacher": "пр. Бричикова А.П.", "room": "ауд. 436 к. 1", "subgroup": "вся группа" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Метрология", "teacher": "пр. Бруй А.И.", "room": "ауд. 406 к. 21", "subgroup": "1 подгруппа" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Конструкционные материалы", "teacher": "пр. Мамонов А.М.", "room": "ауд. 11 к. 7", "subgroup": "2 подгруппа" },
          { "lessonNumber": 4, "time": "13:55 – 15:30", "type": "Лекция", "subject": "Прикладная механика", "teacher": "пр. Долгий С.А.", "room": "ауд. 467 к. 1", "subgroup": "общий поток" }
        ],
        "friday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Практика", "subject": "Математика", "teacher": "пр. Бричикова А.П.", "room": "ауд. 338 к. 1", "subgroup": "вся группа" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Практика", "subject": "Прикладная механика", "teacher": "пр. Долгий С.А.", "room": "ауд. 457 к. 1", "subgroup": "вся группа" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Теоретические основы электротехники", "teacher": "ст.пр. Зеленко В.В., ст.пр. Ринговский И.А.", "room": "ауд. 208 к. 2", "subgroup": "вся группа" }
        ],
        "saturday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Физкультура", "subject": "Физическая культура", "teacher": "ст.пр. Шкробов Д.В., ст.пр. Седнева А.В., ст.пр. Пильневич А.А.", "room": "спорткомплекс", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Конструкционные материалы", "teacher": "пр. Мамонов А.М.", "room": "ауд. 208 к. 6", "subgroup": "общий поток" }
        ]
      },
      "2": {
        "monday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Лекция", "subject": "Теоретические основы электротехники", "teacher": "ст.пр. Зеленко В.В.", "room": "ауд. 447 к. 1", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Электротехнические материалы", "teacher": "ст.пр. Конохов М.С.", "room": "ауд. 447 к. 1", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Физика", "teacher": "—", "room": "ауд. 415 к. 11", "subgroup": "вся группа" }
        ],
        "tuesday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Практика", "subject": "Английский язык", "teacher": "пр. Романова П.В.", "room": "ауд. 406а к. 18", "subgroup": "вся группа" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Метрология, стандартизация и оценка соответствия", "teacher": "доц. Савкова Е.Н.", "room": "ауд. 339 к. 1", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Электротехнические материалы", "teacher": "пр. Титович А.М.", "room": "ауд. 1 к. 2", "subgroup": "1 подгруппа" }
        ],
        "wednesday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Физкультура", "subject": "Физическая культура", "teacher": "ст.пр. Шкробов Д.В., ст.пр. Седнева А.В., ст.пр. Пильневич А.А.", "room": "спорткомплекс", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Физика", "teacher": "ст.пр. Степанов М.А.", "room": "ауд. 306 к. 11", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лекция", "subject": "Математика", "teacher": "пр. Бричикова А.П.", "room": "ауд. 306 к. 11", "subgroup": "общий поток" }
        ],
        "thursday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "КР", "subject": "Информатика", "teacher": "пр. Богданова-Лазовская Н.А.", "room": "ауд. 606 к. 21", "subgroup": "вся группа" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Практика", "subject": "Математика", "teacher": "пр. Бричикова А.П.", "room": "ауд. 436 к. 1", "subgroup": "вся группа" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Метрология", "teacher": "пр. Бруй А.И.", "room": "ауд. 406 к. 21", "subgroup": "1 подгруппа" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Лабораторная", "subject": "Конструкционные материалы", "teacher": "пр. Мамонов А.М.", "room": "ауд. 11 к. 7", "subgroup": "2 подгруппа" },
          { "lessonNumber": 4, "time": "13:55 – 15:30", "type": "Лекция", "subject": "Прикладная механика", "teacher": "пр. Долгий С.А.", "room": "ауд. 467 к. 1", "subgroup": "общий поток" }
        ],
        "friday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Лекция", "subject": "Математика", "teacher": "пр. Бричикова А.П.", "room": "ауд. 208 к. 6", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Практика", "subject": "Теоретические основы электротехники", "teacher": "ст.пр. Зеленко В.В.", "room": "ауд. 304 к. 21", "subgroup": "вся группа" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Практика", "subject": "Физика", "teacher": "ст.пр. Степанов М.А.", "room": "ауд. 338 к. 1", "subgroup": "вся группа" }
        ],
        "saturday": [
          { "lessonNumber": 1, "time": "08:00 – 09:35", "type": "Физкультура", "subject": "Физическая культура", "teacher": "ст.пр. Шкробов Д.В., ст.пр. Седнева А.В., ст.пр. Пильневич А.А.", "room": "спорткомплекс", "subgroup": "общий поток" },
          { "lessonNumber": 2, "time": "09:55 – 11:30", "type": "Лекция", "subject": "Конструкционные материалы", "teacher": "пр. Мамонов А.М.", "room": "ауд. 208 к. 6", "subgroup": "общий поток" },
          { "lessonNumber": 3, "time": "11:40 – 13:15", "type": "Кураторский час", "subject": "Кураторский / информационный час", "teacher": "ст.пр. Болтуть А.Ю.", "room": "ауд. 607 к. 21", "subgroup": "вся группа" }
        ]
      }
    }
  };

  const state = {
    scheduleData: EMBEDDED_SCHEDULE,
    currentAcademicWeek: '1',
    academicWeekNumber: 1,
    selectedWeek: '1',
    selectedSubgroup: safeGet('tma_subgroup', 'all'),
    searchQuery: '',
    currentDayKey: null,
    now: new Date()
  };

  const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const DAY_NAMES_RU = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье'
  };

  const DOM = {
    clockDisplay: document.getElementById('clockDisplay'),
    academicWeekText: document.getElementById('academicWeekText'),
    currentLessonStatus: document.getElementById('currentLessonStatus'),
    btnWeek1: document.getElementById('btnWeek1'),
    btnWeek2: document.getElementById('btnWeek2'),
    btnCurrentWeekShortcut: document.getElementById('btnCurrentWeekShortcut'),
    btnSubAll: document.getElementById('btnSubAll'),
    btnSub1: document.getElementById('btnSub1'),
    btnSub2: document.getElementById('btnSub2'),
    tmaSearchInput: document.getElementById('tmaSearchInput'),
    tmaClearSearch: document.getElementById('tmaClearSearch'),
    daysNavPills: document.getElementById('daysNavPills'),
    daysContainer: document.getElementById('daysContainer'),
    stateLoader: document.getElementById('stateLoader'),
    emptyResults: document.getElementById('emptyResults'),
    emptyResultsText: document.getElementById('emptyResultsText'),
    btnResetFilters: document.getElementById('btnResetFilters'),
    fabToday: document.getElementById('fabToday')
  };

  function calculateAcademicWeek(date = new Date()) {
    const startMonday = new Date(2026, 7, 31, 0, 0, 0, 0); // 31.08.2026
    const current = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const day = current.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diffToMonday);

    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const diffWeeks = Math.floor((current.getTime() - startMonday.getTime()) / msInWeek);
    const academicWeekNumber = diffWeeks >= 0 ? diffWeeks + 1 : 1;
    const parity = (academicWeekNumber % 2 === 1) ? '1' : '2';

    return { academicWeekNumber, parity };
  }

  function parseTimeRangeToMinutes(timeStr) {
    if (!timeStr) return { startMin: 0, endMin: 0 };
    const parts = timeStr.split(/[–-]/).map(p => p.trim());
    if (parts.length < 2) return { startMin: 0, endMin: 0 };
    const [h1, m1] = parts[0].split(':').map(Number);
    const [h2, m2] = parts[1].split(':').map(Number);
    return { startMin: (h1 || 0) * 60 + (m1 || 0), endMin: (h2 || 0) * 60 + (m2 || 0) };
  }

  function getTypeBadge(type) {
    const lower = (type || '').toLowerCase();
    if (lower.includes('лекция')) return { className: 'type-lecture', label: 'Лекция' };
    if (lower.includes('лабораторная')) return { className: 'type-lab', label: 'Лабораторная' };
    if (lower.includes('практика')) return { className: 'type-practice', label: 'Практика' };
    if (lower.includes('кр') || lower.includes('контрольная')) return { className: 'type-kr', label: 'Контрольная' };
    if (lower.includes('физкультура')) return { className: 'type-pe', label: 'Физкультура' };
    if (lower.includes('кураторский')) return { className: 'type-curator', label: 'Кураторский час' };
    return { className: 'type-lecture', label: type };
  }

  function matchSubgroup(subgroup, filter) {
    if (filter === 'all') return true;
    const sub = (subgroup || '').toLowerCase();
    if (sub.includes('общий поток') || sub.includes('вся группа')) return true;
    if (filter === '1' && sub.includes('1')) return true;
    if (filter === '2' && sub.includes('2')) return true;
    return false;
  }

  function matchSearch(lesson, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (lesson.subject && lesson.subject.toLowerCase().includes(q)) ||
      (lesson.teacher && lesson.teacher.toLowerCase().includes(q)) ||
      (lesson.room && lesson.room.toLowerCase().includes(q)) ||
      (lesson.type && lesson.type.toLowerCase().includes(q))
    );
  }

  function updateClock() {
    state.now = new Date();
    const hours = String(state.now.getHours()).padStart(2, '0');
    const minutes = String(state.now.getMinutes()).padStart(2, '0');
    if (DOM.clockDisplay) DOM.clockDisplay.textContent = `${hours}:${minutes}`;

    const weekInfo = calculateAcademicWeek(state.now);
    state.academicWeekNumber = weekInfo.academicWeekNumber;
    state.currentAcademicWeek = weekInfo.parity;
    state.currentDayKey = DAY_KEYS[state.now.getDay()];

    if (DOM.academicWeekText) {
      DOM.academicWeekText.innerHTML = `Учебная неделя <strong>${state.academicWeekNumber}</strong> (${state.currentAcademicWeek}-я неделя)`;
    }

    if (DOM.currentLessonStatus && state.scheduleData?.weeks) {
      const todayLessons = (state.scheduleData.weeks[state.currentAcademicWeek] || {})[state.currentDayKey] || [];
      const currentMinutes = state.now.getHours() * 60 + state.now.getMinutes();

      if (state.now.getDay() === 0) {
        DOM.currentLessonStatus.textContent = '🏖 Воскресенье • Выходной';
      } else if (!todayLessons.length) {
        DOM.currentLessonStatus.textContent = '🎉 Занятий нет';
      } else {
        let active = null;
        let next = null;
        for (const item of todayLessons) {
          const { startMin, endMin } = parseTimeRangeToMinutes(item.time);
          if (currentMinutes >= startMin && currentMinutes <= endMin) {
            active = item;
            break;
          }
          if (startMin > currentMinutes && !next) {
            next = item;
          }
        }
        if (active) {
          DOM.currentLessonStatus.innerHTML = `🔴 Идёт: <strong>${active.subject}</strong>`;
        } else if (next) {
          DOM.currentLessonStatus.innerHTML = `🟡 Следующая: <strong>${next.subject}</strong> (${next.time.split(/[–-]/)[0].trim()})`;
        } else {
          DOM.currentLessonStatus.textContent = '✓ Пары завершены';
        }
      }
    }
  }

  function renderSchedule() {
    if (!state.scheduleData?.weeks || !DOM.daysContainer) return;
    const weekData = state.scheduleData.weeks[state.selectedWeek] || {};
    const weekOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const isCurrentWeek = state.selectedWeek === state.currentAcademicWeek;
    const currentMinutes = state.now.getHours() * 60 + state.now.getMinutes();

    let totalLessons = 0;
    DOM.daysContainer.innerHTML = '';

    weekOrder.forEach(dayKey => {
      const lessons = weekData[dayKey] || [];
      const isToday = isCurrentWeek && dayKey === state.currentDayKey;

      const filtered = lessons.filter(l => matchSubgroup(l.subgroup, state.selectedSubgroup) && matchSearch(l, state.searchQuery));

      if (state.searchQuery && filtered.length === 0) return;
      totalLessons += filtered.length;

      const card = document.createElement('article');
      card.className = `day-card ${isToday ? 'is-today' : ''}`;
      card.id = `day-${dayKey}`;

      const header = document.createElement('div');
      header.className = 'day-card-header';
      header.innerHTML = `
        <span class="day-title">${DAY_NAMES_RU[dayKey]} (${filtered.length})</span>
        ${isToday ? '<span class="badge-today">Сегодня</span>' : ''}
      `;
      card.appendChild(header);

      const list = document.createElement('div');
      list.className = 'lesson-list';

      if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:1rem; color:var(--tg-hint); font-size:0.8rem;">Занятий нет</div>`;
      } else {
        let activeFound = false;
        let nextFound = false;

        filtered.forEach(lesson => {
          const typeInfo = getTypeBadge(lesson.type);
          const { startMin, endMin } = parseTimeRangeToMinutes(lesson.time);

          let isLive = false;
          let isNext = false;
          if (isToday) {
            if (!activeFound && currentMinutes >= startMin && currentMinutes <= endMin) {
              isLive = true;
              activeFound = true;
            } else if (!activeFound && !nextFound && startMin > currentMinutes) {
              isNext = true;
              nextFound = true;
            }
          }

          const itemEl = document.createElement('div');
          itemEl.className = `lesson-card ${isLive ? 'is-active-now' : ''} ${isNext ? 'is-next-lesson' : ''}`;

          itemEl.innerHTML = `
            <div class="lesson-top">
              <span class="lesson-time">${lesson.lessonNumber}. ${lesson.time}</span>
              <div class="lesson-badges-wrap">
                ${isLive ? '<span class="badge-live">Идёт сейчас</span>' : ''}
                ${isNext ? '<span class="badge-next">Следующая</span>' : ''}
                <span class="type-tag ${typeInfo.className}">${typeInfo.label}</span>
              </div>
            </div>
            <div class="lesson-name">${lesson.subject}</div>
            <div class="lesson-info-row">
              <span>👤 ${lesson.teacher || '—'}</span>
              <span class="lesson-room">${lesson.room}</span>
            </div>
            ${lesson.subgroup ? `<div class="lesson-subgroup-pill">👥 ${lesson.subgroup}</div>` : ''}
          `;
          list.appendChild(itemEl);
        });
      }

      card.appendChild(list);
      DOM.daysContainer.appendChild(card);
    });

    if (DOM.stateLoader) DOM.stateLoader.hidden = true;

    if (totalLessons === 0 && (state.searchQuery || state.selectedSubgroup !== 'all')) {
      DOM.daysContainer.hidden = true;
      if (DOM.emptyResults) DOM.emptyResults.hidden = false;
    } else {
      DOM.daysContainer.hidden = false;
      if (DOM.emptyResults) DOM.emptyResults.hidden = true;
    }

    // Update nav pills
    if (DOM.daysNavPills) {
      const pills = DOM.daysNavPills.querySelectorAll('.nav-pill');
      pills.forEach(p => {
        const d = p.getAttribute('data-day');
        p.classList.toggle('active-pill', isCurrentWeek && d === state.currentDayKey);
      });
    }

    if (DOM.fabToday) {
      DOM.fabToday.hidden = !(isCurrentWeek && state.currentDayKey !== 'sunday');
    }
  }

  function syncControls() {
    if (DOM.btnWeek1) DOM.btnWeek1.classList.toggle('active', state.selectedWeek === '1');
    if (DOM.btnWeek2) DOM.btnWeek2.classList.toggle('active', state.selectedWeek === '2');

    if (DOM.btnSubAll) DOM.btnSubAll.classList.toggle('active', state.selectedSubgroup === 'all');
    if (DOM.btnSub1) DOM.btnSub1.classList.toggle('active', state.selectedSubgroup === '1');
    if (DOM.btnSub2) DOM.btnSub2.classList.toggle('active', state.selectedSubgroup === '2');
  }

  function scrollToDay(dayKey) {
    const el = document.getElementById(`day-${dayKey}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setupEvents() {
    if (DOM.btnWeek1) {
      DOM.btnWeek1.addEventListener('click', () => {
        haptic('light');
        state.selectedWeek = '1';
        syncControls();
        renderSchedule();
      });
    }

    if (DOM.btnWeek2) {
      DOM.btnWeek2.addEventListener('click', () => {
        haptic('light');
        state.selectedWeek = '2';
        syncControls();
        renderSchedule();
      });
    }

    if (DOM.btnCurrentWeekShortcut) {
      DOM.btnCurrentWeekShortcut.addEventListener('click', () => {
        haptic('medium');
        state.selectedWeek = state.currentAcademicWeek;
        syncControls();
        renderSchedule();
        if (state.currentDayKey && state.currentDayKey !== 'sunday') {
          setTimeout(() => scrollToDay(state.currentDayKey), 80);
        }
      });
    }

    const setSubgroup = (val) => {
      haptic('light');
      state.selectedSubgroup = val;
      safeSet('tma_subgroup', val);
      syncControls();
      renderSchedule();
    };

    if (DOM.btnSubAll) DOM.btnSubAll.addEventListener('click', () => setSubgroup('all'));
    if (DOM.btnSub1) DOM.btnSub1.addEventListener('click', () => setSubgroup('1'));
    if (DOM.btnSub2) DOM.btnSub2.addEventListener('click', () => setSubgroup('2'));

    if (DOM.tmaSearchInput) {
      DOM.tmaSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        if (DOM.tmaClearSearch) DOM.tmaClearSearch.hidden = !state.searchQuery;
        renderSchedule();
      });
    }

    if (DOM.tmaClearSearch) {
      DOM.tmaClearSearch.addEventListener('click', () => {
        haptic('light');
        if (DOM.tmaSearchInput) DOM.tmaSearchInput.value = '';
        state.searchQuery = '';
        DOM.tmaClearSearch.hidden = true;
        renderSchedule();
      });
    }

    if (DOM.btnResetFilters) {
      DOM.btnResetFilters.addEventListener('click', () => {
        haptic('light');
        state.searchQuery = '';
        state.selectedSubgroup = 'all';
        if (DOM.tmaSearchInput) DOM.tmaSearchInput.value = '';
        if (DOM.tmaClearSearch) DOM.tmaClearSearch.hidden = true;
        safeSet('tma_subgroup', 'all');
        syncControls();
        renderSchedule();
      });
    }

    if (DOM.daysNavPills) {
      DOM.daysNavPills.addEventListener('click', (e) => {
        const pill = e.target.closest('.nav-pill');
        if (pill) {
          haptic('selection');
          const day = pill.getAttribute('data-day');
          scrollToDay(day);
        }
      });
    }

    if (DOM.fabToday) {
      DOM.fabToday.addEventListener('click', () => {
        haptic('medium');
        if (state.selectedWeek !== state.currentAcademicWeek) {
          state.selectedWeek = state.currentAcademicWeek;
          syncControls();
          renderSchedule();
        }
        if (state.currentDayKey && state.currentDayKey !== 'sunday') {
          scrollToDay(state.currentDayKey);
        }
      });
    }
  }

  // Опциональное обновление расписания из сети (в фоне, не блокируя UI)
  async function backgroundUpdateData() {
    try {
      const scheduleUrl = new URL('data/schedule.json', window.location.href).href;
      const res = await fetch(scheduleUrl);
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && fresh.weeks) {
          state.scheduleData = fresh;
          renderSchedule();
        }
      }
    } catch (e) {
      // Игнорируем сетевые ошибки, так как встроенные данные уже работают
    }
  }

  function init() {
    try {
      if (tg?.colorScheme) {
        document.documentElement.setAttribute('data-theme', tg.colorScheme);
      }
    } catch (e) {}

    const weekInfo = calculateAcademicWeek();
    state.academicWeekNumber = weekInfo.academicWeekNumber;
    state.currentAcademicWeek = weekInfo.parity;
    state.selectedWeek = weekInfo.parity;

    setupEvents();
    syncControls();
    updateClock();
    
    // Мгновенный первый рендер из памяти (0 мс)
    renderSchedule();

    // Автопрокрутка к сегодняшнему дню
    if (state.currentDayKey && state.currentDayKey !== 'sunday') {
      setTimeout(() => scrollToDay(state.currentDayKey), 100);
    }

    // Фоновая проверка актуальности данных и тиканье часов
    backgroundUpdateData();
    setInterval(updateClock, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

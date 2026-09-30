/**
 * Telegram Mini App: Расписание группы 10603325 (БНТУ ЭФ)
 */

(function () {
  'use strict';

  // Telegram WebApp SDK Hook
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    if (tg.setHeaderColor) {
      tg.setHeaderColor('secondary_bg_color');
    }
  }

  function haptic(style = 'light') {
    try {
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
      }
    } catch (e) {}
  }

  const state = {
    scheduleData: null,
    currentAcademicWeek: '1',
    academicWeekNumber: 1,
    selectedWeek: '1',
    selectedSubgroup: localStorage.getItem('tma_subgroup') || 'all',
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
    DOM.clockDisplay.textContent = `${hours}:${minutes}`;

    const weekInfo = calculateAcademicWeek(state.now);
    state.academicWeekNumber = weekInfo.academicWeekNumber;
    state.currentAcademicWeek = weekInfo.parity;
    state.currentDayKey = DAY_KEYS[state.now.getDay()];

    DOM.academicWeekText.innerHTML = `Учебная неделя <strong>${state.academicWeekNumber}</strong> (${state.currentAcademicWeek}-я неделя)`;

    if (state.scheduleData?.weeks) {
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
    if (!state.scheduleData?.weeks) return;
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

    if (totalLessons === 0 && (state.searchQuery || state.selectedSubgroup !== 'all')) {
      DOM.daysContainer.hidden = true;
      DOM.emptyResults.hidden = false;
    } else {
      DOM.daysContainer.hidden = false;
      DOM.emptyResults.hidden = true;
    }

    // Update nav pills
    const pills = DOM.daysNavPills.querySelectorAll('.nav-pill');
    pills.forEach(p => {
      const d = p.getAttribute('data-day');
      p.classList.toggle('active-pill', isCurrentWeek && d === state.currentDayKey);
    });

    DOM.fabToday.hidden = !(isCurrentWeek && state.currentDayKey !== 'sunday');
  }

  function syncControls() {
    DOM.btnWeek1.classList.toggle('active', state.selectedWeek === '1');
    DOM.btnWeek2.classList.toggle('active', state.selectedWeek === '2');

    DOM.btnSubAll.classList.toggle('active', state.selectedSubgroup === 'all');
    DOM.btnSub1.classList.toggle('active', state.selectedSubgroup === '1');
    DOM.btnSub2.classList.toggle('active', state.selectedSubgroup === '2');
  }

  function scrollToDay(dayKey) {
    const el = document.getElementById(`day-${dayKey}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setupEvents() {
    DOM.btnWeek1.addEventListener('click', () => {
      haptic('light');
      state.selectedWeek = '1';
      syncControls();
      renderSchedule();
    });

    DOM.btnWeek2.addEventListener('click', () => {
      haptic('light');
      state.selectedWeek = '2';
      syncControls();
      renderSchedule();
    });

    DOM.btnCurrentWeekShortcut.addEventListener('click', () => {
      haptic('medium');
      state.selectedWeek = state.currentAcademicWeek;
      syncControls();
      renderSchedule();
      if (state.currentDayKey && state.currentDayKey !== 'sunday') {
        setTimeout(() => scrollToDay(state.currentDayKey), 80);
      }
    });

    const setSubgroup = (val) => {
      haptic('light');
      state.selectedSubgroup = val;
      localStorage.setItem('tma_subgroup', val);
      syncControls();
      renderSchedule();
    };

    DOM.btnSubAll.addEventListener('click', () => setSubgroup('all'));
    DOM.btnSub1.addEventListener('click', () => setSubgroup('1'));
    DOM.btnSub2.addEventListener('click', () => setSubgroup('2'));

    DOM.tmaSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      DOM.tmaClearSearch.hidden = !state.searchQuery;
      renderSchedule();
    });

    DOM.tmaClearSearch.addEventListener('click', () => {
      haptic('light');
      DOM.tmaSearchInput.value = '';
      state.searchQuery = '';
      DOM.tmaClearSearch.hidden = true;
      renderSchedule();
    });

    DOM.btnResetFilters.addEventListener('click', () => {
      haptic('light');
      state.searchQuery = '';
      state.selectedSubgroup = 'all';
      DOM.tmaSearchInput.value = '';
      DOM.tmaClearSearch.hidden = true;
      localStorage.setItem('tma_subgroup', 'all');
      syncControls();
      renderSchedule();
    });

    DOM.daysNavPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.nav-pill');
      if (pill) {
        haptic('selection');
        const day = pill.getAttribute('data-day');
        scrollToDay(day);
      }
    });

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

  async function loadData() {
    try {
      const res = await fetch('data/schedule.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.scheduleData = await res.json();
      DOM.stateLoader.hidden = true;

      updateClock();
      syncControls();
      renderSchedule();

      if (state.currentDayKey && state.currentDayKey !== 'sunday') {
        setTimeout(() => scrollToDay(state.currentDayKey), 120);
      }
    } catch (e) {
      DOM.stateLoader.innerHTML = `<p style="color:#ef4444;">Ошибка загрузки расписания: ${e.message}</p>`;
    }
  }

  function init() {
    if (tg?.colorScheme) {
      document.documentElement.setAttribute('data-theme', tg.colorScheme);
    }
    const weekInfo = calculateAcademicWeek();
    state.academicWeekNumber = weekInfo.academicWeekNumber;
    state.currentAcademicWeek = weekInfo.parity;
    state.selectedWeek = weekInfo.parity;

    setupEvents();
    loadData();
    setInterval(updateClock, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

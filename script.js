const attendanceData = [
  {
    id: 19499,
    classDate: '2026-03-07',
    displayDate: 'March 7, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'registered',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'absent' },
      { id: 3, name: 'Sara Khan', attendance: 'present' },
      { id: 4, name: 'Daniel Reed', attendance: 'present' }
    ]
  },
  {
    id: 19500,
    classDate: '2026-03-14',
    displayDate: 'March 14, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'registered',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'present' },
      { id: 4, name: 'Daniel Reed', attendance: 'absent' }
    ]
  },
  {
    id: 19501,
    classDate: '2026-03-21',
    displayDate: 'March 21, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'registered',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'absent' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'present' },
      { id: 4, name: 'Daniel Reed', attendance: 'present' }
    ]
  },
  {
    id: 19502,
    classDate: '2026-03-28',
    displayDate: 'March 28, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'registered',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'present' },
      { id: 4, name: 'Daniel Reed', attendance: 'present' }
    ]
  },
  {
    id: 19503,
    classDate: '2026-04-11',
    displayDate: 'April 11, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'pending',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'absent' },
      { id: 3, name: 'Sara Khan', attendance: 'absent' },
      { id: 4, name: 'Daniel Reed', attendance: 'present' }
    ]
  },
  {
    id: 19504,
    classDate: '2026-04-18',
    displayDate: 'April 18, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'pending',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'absent' },
      { id: 4, name: 'Daniel Reed', attendance: 'present' }
    ]
  },
  {
    id: 19505,
    classDate: '2026-04-25',
    displayDate: 'April 25, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'pending',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'absent' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'present' },
      { id: 4, name: 'Daniel Reed', attendance: 'absent' }
    ]
  },
  {
    id: 19506,
    classDate: '2026-05-02',
    displayDate: 'May 2, 2026',
    start: '9:00 AM',
    end: '1:00 PM',
    status: 'pending',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'absent' },
      { id: 4, name: 'Daniel Reed', attendance: 'present' }
    ]
  }
];

const state = {
  selectedClassId: null,
  activeView: 'attendance'
};

const attendanceRows = document.getElementById('attendanceRows');
const detailsPlaceholder = document.querySelector('.details-placeholder');
const detailsContent = document.getElementById('detailsContent');
const selectedClassTitle = document.getElementById('selectedClassTitle');
const selectedClassTime = document.getElementById('selectedClassTime');
const studentList = document.getElementById('studentList');
const monthPicker = document.getElementById('monthPicker');
const calendarGrid = document.getElementById('calendarGrid');
const tabs = document.querySelectorAll('[data-tab]');
const navLinks = document.querySelectorAll('[data-nav-target]');

function renderAttendanceRows() {
  attendanceRows.innerHTML = '';

  attendanceData.forEach((row) => {
    const tr = document.createElement('tr');
    const statusLabel = row.status === 'registered' ? 'Registered' : 'Pending';

    tr.dataset.classId = String(row.id);
    tr.innerHTML = `
      <td><input type="checkbox" aria-label="Select class ${row.id}" /></td>
      <td>${row.id}</td>
      <td>${row.displayDate}</td>
      <td>${row.start}</td>
      <td>${row.end}</td>
      <td><span class="badge badge--${row.status}">${statusLabel}</span></td>
    `;

    tr.addEventListener('click', (event) => {
      if (event.target.tagName.toLowerCase() === 'input') {
        return;
      }

      state.selectedClassId = row.id;
      renderAttendanceRows();
      renderClassDetails();
    });

    if (state.selectedClassId === row.id) {
      tr.classList.add('row--active');
    }

    attendanceRows.appendChild(tr);
  });
}

function renderClassDetails() {
  if (!state.selectedClassId) {
    detailsPlaceholder.classList.remove('hidden');
    detailsContent.classList.add('hidden');
    return;
  }

  const classInfo = attendanceData.find((item) => item.id === state.selectedClassId);
  if (!classInfo) {
    return;
  }

  detailsPlaceholder.classList.add('hidden');
  detailsContent.classList.remove('hidden');
  selectedClassTitle.textContent = `Class #${classInfo.id} • ${classInfo.displayDate}`;
  selectedClassTime.textContent = `${classInfo.start} to ${classInfo.end}`;

  studentList.innerHTML = '';
  classInfo.students.forEach((student) => {
    const item = document.createElement('li');
    item.className = 'student-item';

    const name = document.createElement('span');
    name.textContent = student.name;

    const controls = document.createElement('div');
    controls.className = 'student-status';

    const presentBtn = document.createElement('button');
    presentBtn.type = 'button';
    presentBtn.textContent = 'Present';

    const absentBtn = document.createElement('button');
    absentBtn.type = 'button';
    absentBtn.textContent = 'Absent';

    const setStudentStatus = (status) => {
      student.attendance = status;
      presentBtn.classList.toggle('active-present', status === 'present');
      absentBtn.classList.toggle('active-absent', status === 'absent');
    };

    presentBtn.addEventListener('click', () => setStudentStatus('present'));
    absentBtn.addEventListener('click', () => setStudentStatus('absent'));

    setStudentStatus(student.attendance);

    controls.append(presentBtn, absentBtn);
    item.append(name, controls);
    studentList.appendChild(item);
  });
}

function renderCalendar(targetDate) {
  const current = targetDate || new Date();
  const year = current.getFullYear();
  const month = current.getMonth();

  calendarGrid.innerHTML = '';

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach((day) => {
    const label = document.createElement('div');
    label.className = 'calendar-cell calendar-cell--muted';
    label.innerHTML = `<strong>${day}</strong>`;
    calendarGrid.appendChild(label);
  });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i += 1) {
    const empty = document.createElement('div');
    empty.className = 'calendar-cell calendar-cell--muted';
    calendarGrid.appendChild(empty);
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const matchingClass = attendanceData.find((item) => item.classDate === dateIso);

    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.innerHTML = `<strong>${date}</strong>`;

    if (matchingClass) {
      cell.classList.add('calendar-cell--class');
      const tag = document.createElement('span');
      tag.className = 'class-dot';
      tag.textContent = `Class ${matchingClass.id}`;
      cell.appendChild(tag);

      cell.addEventListener('click', () => {
        state.selectedClassId = matchingClass.id;
        switchView('attendance');
        renderAttendanceRows();
        renderClassDetails();
      });
    }

    calendarGrid.appendChild(cell);
  }

  monthPicker.value = `${year}-${String(month + 1).padStart(2, '0')}`;
}

function switchView(view) {
  state.activeView = view;

  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('panel--active', panel.id === `${view}Section`);
  });

  tabs.forEach((tab) => {
    const active = tab.dataset.tab === view;
    tab.classList.toggle('tab--active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  navLinks.forEach((link) => {
    const active = link.dataset.navTarget === view;
    link.classList.toggle('nav-link--active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

monthPicker.addEventListener('change', (event) => {
  const [year, month] = event.target.value.split('-').map(Number);
  if (!year || !month) {
    return;
  }

  renderCalendar(new Date(year, month - 1, 1));
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selectedView = tab.dataset.tab;
    if (selectedView === 'evaluations') {
      return;
    }

    switchView(selectedView);
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    switchView(link.dataset.navTarget);
  });
});

renderAttendanceRows();
renderClassDetails();
renderCalendar(new Date(2026, 2, 1));
switchView('attendance');

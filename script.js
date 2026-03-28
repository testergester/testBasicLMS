const STORAGE_KEY = 'basicLmsClassesV1';

const defaultClassData = [
  {
    id: 19499,
    classDate: '2026-03-07',
    start: '09:00',
    end: '13:00',
    teacher: 'Mouad Amrani',
    status: 'pending',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'absent' },
      { id: 3, name: 'Sara Khan', attendance: 'present' }
    ]
  },
  {
    id: 19500,
    classDate: '2026-03-14',
    start: '09:00',
    end: '13:00',
    teacher: 'Mouad Amrani',
    status: 'pending',
    students: [
      { id: 1, name: 'Ana Martínez', attendance: 'present' },
      { id: 2, name: 'Luis García', attendance: 'present' },
      { id: 3, name: 'Sara Khan', attendance: 'absent' }
    ]
  }
];

const state = {
  selectedClassId: null,
  activeView: 'attendance',
  classes: loadClasses()
};

const attendanceRows = document.getElementById('attendanceRows');
const detailsPlaceholder = document.querySelector('.details-placeholder');
const detailsContent = document.getElementById('detailsContent');
const selectedClassTitle = document.getElementById('selectedClassTitle');
const selectedClassTime = document.getElementById('selectedClassTime');
const studentList = document.getElementById('studentList');
const submitAttendanceBtn = document.getElementById('submitAttendanceBtn');
const monthPicker = document.getElementById('monthPicker');
const calendarGrid = document.getElementById('calendarGrid');
const tabs = document.querySelectorAll('[data-tab]');
const navLinks = document.querySelectorAll('[data-nav-target]');
const classForm = document.getElementById('classForm');
const paginationText = document.getElementById('paginationText');

function loadClasses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return structuredClone(defaultClassData);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return structuredClone(defaultClassData);
    }

    return parsed;
  } catch {
    return structuredClone(defaultClassData);
  }
}

function saveClasses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.classes));
}

function formatDateDisplay(dateIso) {
  const date = new Date(`${dateIso}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTimeDisplay(time24) {
  const [hours, minutes] = time24.split(':').map(Number);
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const normalizedHour = hours % 12 || 12;
  return `${normalizedHour}:${String(minutes).padStart(2, '0')} ${meridiem}`;
}

function getClassById(classId) {
  return state.classes.find((item) => item.id === classId);
}

function renderAttendanceRows() {
  attendanceRows.innerHTML = '';

  state.classes
    .sort((a, b) => (a.classDate > b.classDate ? 1 : -1))
    .forEach((row) => {
      const tr = document.createElement('tr');
      const statusLabel = row.status === 'registered' ? 'Registered' : 'Pending';

      tr.dataset.classId = String(row.id);
      tr.innerHTML = `
        <td><input type="checkbox" aria-label="Select class ${row.id}" /></td>
        <td>${row.id}</td>
        <td>${formatDateDisplay(row.classDate)}</td>
        <td>${row.teacher}</td>
        <td>${formatTimeDisplay(row.start)}</td>
        <td>${formatTimeDisplay(row.end)}</td>
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

  paginationText.textContent = `1-${state.classes.length} of ${state.classes.length}`;
}

function setStudentStatus(classId, studentId, status) {
  const classInfo = getClassById(classId);
  if (!classInfo) {
    return;
  }

  const student = classInfo.students.find((item) => item.id === studentId);
  if (!student) {
    return;
  }

  student.attendance = status;
  classInfo.status = 'pending';
  saveClasses();
}

function renderClassDetails() {
  if (!state.selectedClassId) {
    detailsPlaceholder.classList.remove('hidden');
    detailsContent.classList.add('hidden');
    return;
  }

  const classInfo = getClassById(state.selectedClassId);
  if (!classInfo) {
    return;
  }

  detailsPlaceholder.classList.add('hidden');
  detailsContent.classList.remove('hidden');
  selectedClassTitle.textContent = `Class #${classInfo.id} • ${formatDateDisplay(classInfo.classDate)}`;
  selectedClassTime.textContent = `${formatTimeDisplay(classInfo.start)} to ${formatTimeDisplay(classInfo.end)} • ${classInfo.teacher}`;

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

    const setButtonStyles = () => {
      presentBtn.classList.toggle('active-present', student.attendance === 'present');
      absentBtn.classList.toggle('active-absent', student.attendance === 'absent');
    };

    presentBtn.addEventListener('click', () => {
      setStudentStatus(classInfo.id, student.id, 'present');
      setButtonStyles();
      renderAttendanceRows();
    });

    absentBtn.addEventListener('click', () => {
      setStudentStatus(classInfo.id, student.id, 'absent');
      setButtonStyles();
      renderAttendanceRows();
    });

    setButtonStyles();

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
    const matchingClass = state.classes.find((item) => item.classDate === dateIso);

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

function createClassFromForm(event) {
  event.preventDefault();

  const formData = new FormData(classForm);
  const classDate = formData.get('newClassDate') || document.getElementById('newClassDate').value;
  const start = formData.get('newClassStart') || document.getElementById('newClassStart').value;
  const end = formData.get('newClassEnd') || document.getElementById('newClassEnd').value;
  const teacher = (formData.get('newClassTeacher') || document.getElementById('newClassTeacher').value).toString().trim();
  const studentsRaw = (formData.get('newClassStudents') || document.getElementById('newClassStudents').value).toString();

  const students = studentsRaw
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: index + 1,
      name,
      attendance: 'absent'
    }));

  if (!classDate || !start || !end || !teacher || students.length === 0) {
    return;
  }

  const nextId = state.classes.reduce((maxId, item) => Math.max(maxId, item.id), 19000) + 1;

  state.classes.push({
    id: nextId,
    classDate,
    start,
    end,
    teacher,
    status: 'pending',
    students
  });

  saveClasses();
  classForm.reset();
  document.getElementById('newClassStart').value = '09:00';
  document.getElementById('newClassEnd').value = '13:00';

  renderAttendanceRows();
  renderCalendar(new Date(`${classDate}T00:00:00`));
  switchView('attendance');
}

submitAttendanceBtn.addEventListener('click', () => {
  if (!state.selectedClassId) {
    return;
  }

  const classInfo = getClassById(state.selectedClassId);
  if (!classInfo) {
    return;
  }

  classInfo.status = 'registered';
  saveClasses();
  renderAttendanceRows();
  renderClassDetails();
});

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

classForm.addEventListener('submit', createClassFromForm);

saveClasses();
renderAttendanceRows();
renderClassDetails();
renderCalendar(new Date(2026, 2, 1));
switchView('attendance');

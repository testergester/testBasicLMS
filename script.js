const attendanceData = [
  { id: 19499, classDate: 'March 7, 2026', start: '9:00 AM', end: '1:00 PM', status: 'registered' },
  { id: 19500, classDate: 'March 14, 2026', start: '9:00 AM', end: '1:00 PM', status: 'registered' },
  { id: 19501, classDate: 'March 21, 2026', start: '9:00 AM', end: '1:00 PM', status: 'registered' },
  { id: 19502, classDate: 'March 28, 2026', start: '9:00 AM', end: '1:00 PM', status: 'registered' },
  { id: 19503, classDate: 'April 11, 2026', start: '9:00 AM', end: '1:00 PM', status: 'pending' },
  { id: 19504, classDate: 'April 18, 2026', start: '9:00 AM', end: '1:00 PM', status: 'pending' },
  { id: 19505, classDate: 'April 25, 2026', start: '9:00 AM', end: '1:00 PM', status: 'pending' },
  { id: 19506, classDate: 'May 2, 2026', start: '9:00 AM', end: '1:00 PM', status: 'pending' }
];

const tbody = document.getElementById('attendanceRows');

attendanceData.forEach((row) => {
  const tr = document.createElement('tr');
  const statusLabel = row.status === 'registered' ? 'Registered' : 'Pending';

  tr.innerHTML = `
    <td><input type="checkbox" aria-label="Select class ${row.id}" /></td>
    <td>${row.id}</td>
    <td>${row.classDate}</td>
    <td>${row.start}</td>
    <td>${row.end}</td>
    <td><span class="badge badge--${row.status}">${statusLabel}</span></td>
  `;

  tbody.appendChild(tr);
});

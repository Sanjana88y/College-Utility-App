const API = "http://localhost:5000/api";

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch (err) { console.error(err); return null; }
}

function requireAuth(allowedRoles = []) {
  const user = getCurrentUser();
  if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}
// Register
async function register() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const role = document.getElementById("role")?.value;

  if (!name || !email || !password || !role) return alert("Fill all fields");

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (res.ok) {
      const approved = data.user?.approved;
      if (!approved) {
        alert(`${data.msg} (Approval pending)`);
        return; // stay on register until approved by admin
      }

      alert(`${data.msg} - You can now log in`);
      window.location.href = "login.html";
    } else {
      alert(data.msg || "Register failed");
    }
  } catch (err) {
    console.error("Register error:", err);
    alert("Network error. Please check if the server is running.");
  }
}
 // Login
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) return alert("Fill all fields");

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "student") window.location.href = "Student.html";
      else if (data.user.role === "teacher") window.location.href = "Teacher.html";
      else if (data.user.role === "admin") window.location.href = "Admin.html";
      else window.location.href = "dashboard.html";
    } else {
      alert(data.msg || "Invalid login");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Network error. Please check if the server is running.");
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function openSection(id) {
  document.querySelectorAll(".section").forEach((sec) => (sec.style.display = "none"));
  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  switch (id) {
    case "notes":
      getNotes();
      break;
    case "assignment":
      getAssignments();
      break;
    case "timetable":
      getTimetable();
      break;
    case "result":
      getResults();
      break;
    case "events":
      getEvents();
      break;
    case "fees":
      getFees();
      break;
    case "notice":
      getNotices();
      break;
    case "attendance":
      getAttendance();
      break;
    case "users":
      getUsers();
      break;
    case "pending":
      getPendingUsers();
      break;
    default:
      break;
  }
}

async function apiGet(endpoint) {
  const res = await fetch(`${API}${endpoint}`);
  return res.json();
}

async function apiPost(endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

// Notes
async function addNote() {
  const noteInput = document.getElementById("noteInput") || document.getElementById("content");
  const titleInput = document.getElementById("noteTitle") || document.getElementById("title");
  if (!noteInput || !titleInput) return alert("Title and note input not found");

  const resp = await apiPost("/school/notes", {
    title: titleInput.value,
    content: noteInput.value,
    postedBy: getCurrentUser()?.email || "teacher"
  });
  alert(resp.msg || "Failed");
  if (resp.msg === "Note published") noteInput.value = "";
}

async function getNotes() {
  const data = await apiGet("/school/notes");
  const container = document.getElementById("notesData") || document.getElementById("data");
  if (!container) return;
  container.innerHTML = Array.isArray(data)
    ? data.map((n) => `<p><strong>${n.title}</strong>: ${n.content}</p>`).join("")
    : "No notes";
}

// Assignments
async function addAssignment() {
  const assignInput = document.getElementById("assignInput") || document.getElementById("assg");
  if (!assignInput) return alert("Assignment input not found");

  const resp = await apiPost("/school/assignments", {
    title: assignInput.value,
    description: assignInput.value,
    postedBy: getCurrentUser()?.email || "teacher"
  });
  alert(resp.msg || "Failed");
  assignInput.value = "";
}

async function getAssignments() {
  const data = await apiGet("/school/assignments");
  const container = document.getElementById("assignmentData");
  if (!container) return;
  container.innerHTML = data.map((a) => `<p>${a.title} - ${a.description} ${a.dueDate ? `(due ${a.dueDate})` : ''}</p>`).join("");
}

// Notices
async function addNotice() {
  const noticeInput = document.getElementById("noticeInput");
  if (!noticeInput) return alert("Notice input not found");

  const resp = await apiPost("/school/notices", {
    title: "Notice",
    message: noticeInput.value,
    postedBy: getCurrentUser()?.email || "teacher"
  });
  alert(resp.msg || "Failed");
  noticeInput.value = "";
}

async function getNotices() {
  const data = await apiGet("/school/notices");
  const container = document.getElementById("noticeData");
  if (!container) return;
  container.innerHTML = data.map((n) => `<p><strong>${n.title}</strong>: ${n.message}</p>`).join("");
}

// Timetable
async function addTimetable() {
  const day = document.getElementById("timetableDay")?.value;
  const subject = document.getElementById("timetableSubject")?.value;
  if (!day || !subject) return alert("Timetable fields missing");

  const resp = await apiPost("/school/timetable", { day, subject, startTime: "09:00", endTime: "10:00" });
  alert(resp.msg || "Failed");
}

async function getTimetable() {
  const data = await apiGet("/school/timetable");
  const container = document.getElementById("timetableData");
  if (!container) return;
  container.innerHTML = data.map((t) => `<p>${t.day}: ${t.subject} ${t.startTime}-${t.endTime}</p>`).join("");
}

// Results
async function addResult() {
  const studentEmail = document.getElementById("resultStudent")?.value;
  const subject = document.getElementById("resultSubject")?.value;
  const marks = document.getElementById("resultMarks")?.value;
  if (!studentEmail || !subject || !marks) return alert("Result fields missing");

  const resp = await apiPost("/school/results", { studentEmail, subject, marks: Number(marks), grade: "A" });
  alert(resp.msg || "Failed");
}

async function getResults() {
  const data = await apiGet("/school/results");
  const container = document.getElementById("resultData");
  if (!container) return;
  container.innerHTML = data.map((r) => `<p>${r.studentEmail} ${r.subject} ${r.marks} ${r.grade}</p>`).join("");
}

// Events/Notifications
async function addEvent() {
  const title = document.getElementById("eventTitle")?.value;
  const description = document.getElementById("eventDescription")?.value;
  if (!title || !description) return alert("Event fields missing");

  const resp = await apiPost("/school/events", { title, description });
  alert(resp.msg || "Failed");
}

async function getEvents() {
  const data = await apiGet("/school/events");
  const container = document.getElementById("eventData");
  if (!container) return;
  container.innerHTML = data.map((e) => `<p>${e.date} ${e.title}: ${e.description}</p>`).join("");
}

// Fees
async function payFees() {
  const user = getCurrentUser();
  if (!user) return alert("User session not available");
  const amount = 1000;
  const resp = await apiPost("/school/fees/pay", { studentEmail: user.email, amount });
  if (resp.msg.includes("paid")) {
    const feeStatusEl = document.getElementById("feeStatus");
    if (feeStatusEl) feeStatusEl.innerText = "Paid ✅";
  }
  alert(resp.msg || "Failed");
}

async function getFees() {
  const data = await apiGet("/school/fees");
  const feeRecordsEl = document.getElementById("feeRecords");
  if (feeRecordsEl) feeRecordsEl.innerText = JSON.stringify(data, null, 2);
}

// Attendance
async function markAttendance() {
  const studentEmail = document.getElementById("attStudent")?.value;
  const status = document.getElementById("attStatus")?.value;
  if (!studentEmail || !status) return alert("Attendance fields missing");

  const resp = await apiPost("/school/attendance", { studentEmail, status });
  alert(resp.msg || "Failed");
}

async function getAttendance() {
  const data = await apiGet("/school/attendance");
  const attendanceEl = document.getElementById("attendanceData");
  if (attendanceEl) attendanceEl.innerHTML = data.map((a) => `<p>${a.date} ${a.studentEmail}: ${a.status}</p>`).join("");
}

// Admin
async function getUsers() {
  const user = requireAuth(["admin"]);
  if (!user) return;
  const users = await apiGet("/auth/users");
  document.getElementById("userList").innerHTML = users.map((u) => `<li>${u.name} (${u.email}) [${u.role}] Approved: ${u.approved}</li>`).join("");
}

async function getPendingUsers() {
  const data = await apiGet("/auth/pending");
  const pendingListEl = document.getElementById("pendingList");
  if (pendingListEl) pendingListEl.innerHTML = data.map((u) => `<li>${u.email} <button onclick='approveUser("${u._id}")'>Approve</button></li>`).join("");
}

async function approveUser(userId) {
  const res = await fetch(`${API}/auth/approve/${userId}`, {
    method: "PATCH"
  });
  const data = await res.json();
  alert(data.msg || "Error");
  getPendingUsers();
}

// Auto-init for pages
window.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("register.html")) {
    window.location.href = "login.html";
    return;
  }

  if (window.location.pathname.includes("Student.html")) {
    requireAuth(["student"]);
    openSection("notes");
  }

  if (window.location.pathname.includes("Teacher.html")) {
    requireAuth(["teacher"]);
    openSection("notes");
  }

  if (window.location.pathname.includes("Admin.html")) {
    requireAuth(["admin"]);
    openSection("users");
  }
});

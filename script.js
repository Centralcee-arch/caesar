// Units data with YouTube links
const units = [
  {
    code: "MMA223",
    name: "Numerical Analysis 1",
    youtubeUrl: "https://www.youtube.com/results?search_query=numerical+analysis+tutorial",
  },
  {
    code: "MMA225",
    name: "Discrete Math 2",
    youtubeUrl: "https://www.youtube.com/results?search_query=discrete+mathematics+tutorial",
  },
  {
    code: "MMA227",
    name: "Calculus 2",
    youtubeUrl: "https://www.youtube.com/results?search_query=calculus+2+tutorial",
  },
  {
    code: "MMA229",
    name: "Vectors Analysis",
    youtubeUrl: "https://www.youtube.com/results?search_query=vector+analysis+tutorial",
  },
  {
    code: "CIR201",
    name: "Computing Projects Methodologies",
    youtubeUrl: "https://www.youtube.com/results?search_query=software+project+methodology+tutorial",
  },
  {
    code: "CIR203",
    name: "Data Structures and Algorithms",
    youtubeUrl: "https://www.youtube.com/results?search_query=data+structures+algorithms+tutorial",
  },
  {
    code: "CIR205",
    name: "Object Oriented Programming 2",
    youtubeUrl: "https://www.youtube.com/results?search_query=object+oriented+programming+tutorial",
  },
  {
    code: "CIR209",
    name: "LAN Design and Implementation",
    youtubeUrl: "https://www.youtube.com/results?search_query=lan+network+design+tutorial",
  },
  {
    code: "CCS219",
    name: "Systems and Procedural Programming (C)",
    youtubeUrl: "https://www.youtube.com/results?search_query=c+programming+tutorial",
  },
  {
    code: "CIR104",
    name: "Object Oriented Programming 1",
    youtubeUrl: "https://www.youtube.com/results?search_query=oop+basics+tutorial",
  },
]

const startDate = new Date()
startDate.setHours(0, 0, 0, 0)

// Generate 16-day schedule (4 units per day, cycling through all units)
function generateSchedule() {
  const schedule = []

  for (let day = 1; day <= 16; day++) {
    const daySchedule = []

    // Session 1: 4:00 AM - 6:00 AM
    const unit1Index = ((day - 1) * 4) % units.length
    daySchedule.push({
      type: "study",
      startTime: "04:00",
      endTime: "06:00",
      unit: units[unit1Index],
      id: `day${day}-session1`,
    })

    // Break: 6:00 AM - 6:20 AM
    daySchedule.push({
      type: "break",
      startTime: "06:00",
      endTime: "06:20",
      title: "Break",
      id: `day${day}-break1`,
    })

    // Session 2: 6:20 AM - 8:20 AM
    const unit2Index = ((day - 1) * 4 + 1) % units.length
    daySchedule.push({
      type: "study",
      startTime: "06:20",
      endTime: "08:20",
      unit: units[unit2Index],
      id: `day${day}-session2`,
    })

    // Break: 8:20 AM - 8:40 AM
    daySchedule.push({
      type: "break",
      startTime: "08:20",
      endTime: "08:40",
      title: "Break",
      id: `day${day}-break2`,
    })

    // Session 3: 8:40 AM - 10:40 AM
    const unit3Index = ((day - 1) * 4 + 2) % units.length
    daySchedule.push({
      type: "study",
      startTime: "08:40",
      endTime: "10:40",
      unit: units[unit3Index],
      id: `day${day}-session3`,
    })

    // Break: 10:40 AM - 11:00 AM
    daySchedule.push({
      type: "break",
      startTime: "10:40",
      endTime: "11:00",
      title: "Break",
      id: `day${day}-break3`,
    })

    // Lunch: 11:00 AM - 12:00 PM
    daySchedule.push({
      type: "meal",
      startTime: "11:00",
      endTime: "12:00",
      title: "Lunch Break",
      id: `day${day}-lunch`,
    })

    // Session 4: 12:00 PM - 2:00 PM
    const unit4Index = ((day - 1) * 4 + 3) % units.length
    daySchedule.push({
      type: "study",
      startTime: "12:00",
      endTime: "14:00",
      unit: units[unit4Index],
      id: `day${day}-session4`,
    })

    // Break: 2:00 PM - 2:20 PM
    daySchedule.push({
      type: "break",
      startTime: "14:00",
      endTime: "14:20",
      title: "Break",
      id: `day${day}-break4`,
    })

    // Free Time: 2:20 PM - 6:00 PM
    daySchedule.push({
      type: "break",
      startTime: "14:20",
      endTime: "18:00",
      title: "Free Time / Review",
      id: `day${day}-freetime`,
    })

    // Supper: 6:00 PM - 7:00 PM
    daySchedule.push({
      type: "meal",
      startTime: "18:00",
      endTime: "19:00",
      title: "Supper Break",
      id: `day${day}-supper`,
    })

    // Evening Free Time: 7:00 PM - 11:00 PM
    daySchedule.push({
      type: "break",
      startTime: "19:00",
      endTime: "23:00",
      title: "Evening Free Time",
      id: `day${day}-evening`,
    })

    schedule.push(daySchedule)
  }

  return schedule
}

let currentDay = 1
let alarmEnabled = true
const schedule = generateSchedule()
let currentSessionIndex = -1
let timerInterval = null
let customAlarmSound = null

function loadCompletedSessions() {
  const saved = localStorage.getItem("completedSessions")
  return saved ? JSON.parse(saved) : {}
}

function saveCompletedSessions(completed) {
  localStorage.setItem("completedSessions", JSON.stringify(completed))
}

let completedSessions = loadCompletedSessions()

// Audio context for alarm
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

function playAlarmSound() {
  if (!alarmEnabled) return

  if (customAlarmSound) {
    const audio = document.getElementById("alarmSound")
    audio.src = customAlarmSound
    audio.play().catch((e) => console.error("Error playing custom alarm:", e))
  } else {
    // Create a simple bell-like sound using Web Audio API
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 1)

    // Play three times for bell effect
    setTimeout(() => {
      const osc2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()
      osc2.connect(gain2)
      gain2.connect(audioContext.destination)
      osc2.frequency.value = 800
      osc2.type = "sine"
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
      osc2.start(audioContext.currentTime)
      osc2.stop(audioContext.currentTime + 1)
    }, 200)

    setTimeout(() => {
      const osc3 = audioContext.createOscillator()
      const gain3 = audioContext.createGain()
      osc3.connect(gain3)
      gain3.connect(audioContext.destination)
      osc3.frequency.value = 800
      osc3.type = "sine"
      gain3.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
      osc3.start(audioContext.currentTime)
      osc3.stop(audioContext.currentTime + 1)
    }, 400)
  }
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

function getCurrentSession() {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const todaySchedule = schedule[currentDay - 1]

  for (let i = 0; i < todaySchedule.length; i++) {
    const session = todaySchedule[i]
    const startMinutes = timeToMinutes(session.startTime)
    const endMinutes = timeToMinutes(session.endTime)

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return { session, index: i }
    }
  }

  return null
}

function updateCurrentSession() {
  const current = getCurrentSession()

  if (current) {
    const { session, index } = current

    // Check if session changed
    if (index !== currentSessionIndex) {
      currentSessionIndex = index
      playAlarmSound()
    }

    const sessionTitle = document.getElementById("sessionTitle")
    const sessionCode = document.getElementById("sessionCode")
    const sessionTime = document.getElementById("sessionTime")
    const watchBtn = document.getElementById("watchLectureBtn")

    if (session.type === "study") {
      sessionTitle.textContent = session.unit.name
      sessionCode.textContent = session.unit.code
      sessionTime.textContent = `${session.startTime} - ${session.endTime}`
      watchBtn.disabled = false
      watchBtn.onclick = () => window.open(session.unit.youtubeUrl, "_blank")
    } else {
      sessionTitle.textContent = session.title
      sessionCode.textContent = session.type === "meal" ? "Meal Time" : "Break Time"
      sessionTime.textContent = `${session.startTime} - ${session.endTime}`
      watchBtn.disabled = true
    }

    updateTimer(session)
    updateProgress(session)
  } else {
    document.getElementById("sessionTitle").textContent = "No active session"
    document.getElementById("sessionCode").textContent = "---"
    document.getElementById("sessionTime").textContent = "---"
    document.getElementById("watchLectureBtn").disabled = true
    document.getElementById("timer").textContent = "00:00:00"
    document.getElementById("progressBar").style.width = "0%"
  }

  renderTimetable()
}

function updateTimer(session) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  const endMinutes = timeToMinutes(session.endTime)
  const remainingMinutes = endMinutes - currentMinutes

  if (remainingMinutes > 0) {
    const hours = Math.floor(remainingMinutes / 60)
    const minutes = Math.floor(remainingMinutes % 60)
    const seconds = Math.floor((remainingMinutes % 1) * 60)

    document.getElementById("timer").textContent =
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  } else {
    document.getElementById("timer").textContent = "00:00:00"
  }
}

function updateProgress(session) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  const startMinutes = timeToMinutes(session.startTime)
  const endMinutes = timeToMinutes(session.endTime)
  const totalMinutes = endMinutes - startMinutes
  const elapsedMinutes = currentMinutes - startMinutes

  const progress = Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100))
  document.getElementById("progressBar").style.width = `${progress}%`
}

function renderDayTabs() {
  const dayTabs = document.getElementById("dayTabs")
  dayTabs.innerHTML = ""

  for (let i = 1; i <= 16; i++) {
    const tab = document.createElement("button")
    tab.className = "day-tab"
    tab.textContent = `Day ${i}`
    if (i === currentDay) {
      tab.classList.add("active")
    }
    tab.onclick = () => {
      currentDay = i
      document.getElementById("currentDay").textContent = i
      renderDayTabs()
      renderTimetable()
      updateCurrentSession()
    }
    dayTabs.appendChild(tab)
  }
}

function renderTimetable() {
  const timetable = document.getElementById("timetable")
  timetable.innerHTML = ""

  const todaySchedule = schedule[currentDay - 1]
  const current = getCurrentSession()

  todaySchedule.forEach((session, index) => {
    const item = document.createElement("div")
    item.className = "session-item"

    if (current && current.index === index) {
      item.classList.add("active")
    }

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const endMinutes = timeToMinutes(session.endTime)

    if (currentMinutes > endMinutes) {
      item.classList.add("completed")
    }

    // Check if session is marked as completed
    if (completedSessions[session.id]) {
      item.classList.add("checked")
    }

    const header = document.createElement("div")
    header.className = "session-item-header"

    const typeSpan = document.createElement("span")
    typeSpan.className = `session-type ${session.type}`
    typeSpan.textContent = session.type

    const timeSpan = document.createElement("span")
    timeSpan.className = "session-time"
    timeSpan.textContent = `${session.startTime} - ${session.endTime}`

    header.appendChild(typeSpan)
    header.appendChild(timeSpan)

    const content = document.createElement("div")
    content.className = "session-item-content"

    const title = document.createElement("h3")
    if (session.type === "study") {
      title.textContent = session.unit.name
      const code = document.createElement("p")
      code.textContent = session.unit.code
      content.appendChild(title)
      content.appendChild(code)

      // Add checkbox for study sessions
      const checkboxDiv = document.createElement("div")
      checkboxDiv.className = "session-checkbox"

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.id = session.id
      checkbox.checked = completedSessions[session.id] || false
      checkbox.onchange = (e) => {
        completedSessions[session.id] = e.target.checked
        saveCompletedSessions(completedSessions)
        renderTimetable()
        renderUnitsOverview()
      }

      const label = document.createElement("label")
      label.htmlFor = session.id
      label.textContent = "Mark as completed"

      checkboxDiv.appendChild(checkbox)
      checkboxDiv.appendChild(label)
      content.appendChild(checkboxDiv)

      item.onclick = (e) => {
        if (e.target !== checkbox && e.target !== label) {
          window.open(session.unit.youtubeUrl, "_blank")
        }
      }
      item.style.cursor = "pointer"
    } else {
      title.textContent = session.title
      content.appendChild(title)
    }

    item.appendChild(header)
    item.appendChild(content)
    timetable.appendChild(item)
  })
}

function renderUnitsOverview() {
  const unitsGrid = document.getElementById("unitsGrid")
  unitsGrid.innerHTML = ""

  units.forEach((unit) => {
    let completedCount = 0
    let totalSessions = 0

    // Count completed and total sessions for this unit
    for (let day = 1; day <= 16; day++) {
      const daySchedule = schedule[day - 1]
      daySchedule.forEach((session) => {
        if (session.type === "study" && session.unit.code === unit.code) {
          totalSessions++
          if (completedSessions[session.id]) {
            completedCount++
          }
        }
      })
    }

    const progress = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0

    const card = document.createElement("div")
    card.className = "unit-card"
    card.onclick = () => window.open(unit.youtubeUrl, "_blank")

    const title = document.createElement("h3")
    title.textContent = unit.name

    const code = document.createElement("p")
    code.textContent = unit.code

    const progressInfo = document.createElement("div")
    progressInfo.className = "unit-progress"
    progressInfo.innerHTML = `<span>${completedCount} / ${totalSessions} sessions</span><span>${Math.round(progress)}%</span>`

    const progressBar = document.createElement("div")
    progressBar.className = "unit-progress-bar"

    const progressFill = document.createElement("div")
    progressFill.className = "unit-progress-fill"
    progressFill.style.width = `${progress}%`

    progressBar.appendChild(progressFill)

    card.appendChild(title)
    card.appendChild(code)
    card.appendChild(progressInfo)
    card.appendChild(progressBar)

    unitsGrid.appendChild(card)
  })
}

document.getElementById("alarmToggle").onclick = () => {
  alarmEnabled = !alarmEnabled
  const btn = document.getElementById("alarmToggle")
  btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        Alarm: ${alarmEnabled ? "ON" : "OFF"}
    `
}

document.getElementById("prevDay").onclick = () => {
  if (currentDay > 1) {
    currentDay--
    document.getElementById("currentDay").textContent = currentDay
    renderDayTabs()
    renderTimetable()
    renderUnitsOverview()
    updateCurrentSession()
  }
}

document.getElementById("nextDay").onclick = () => {
  if (currentDay < 16) {
    currentDay++
    document.getElementById("currentDay").textContent = currentDay
    renderDayTabs()
    renderTimetable()
    renderUnitsOverview()
    updateCurrentSession()
  }
}

document.getElementById("settingsBtn").onclick = () => {
  document.getElementById("settingsModal").classList.add("active")
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("settingsModal").classList.remove("active")
}

document.getElementById("settingsModal").onclick = (e) => {
  if (e.target.id === "settingsModal") {
    document.getElementById("settingsModal").classList.remove("active")
  }
}

const themeToggle = document.getElementById("themeToggle")
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "light") {
  document.body.classList.add("light-theme")
  themeToggle.checked = true
}

themeToggle.onchange = (e) => {
  if (e.target.checked) {
    document.body.classList.add("light-theme")
    localStorage.setItem("theme", "light")
  } else {
    document.body.classList.remove("light-theme")
    localStorage.setItem("theme", "dark")
  }
}

document.getElementById("alarmUpload").onchange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      customAlarmSound = event.target.result
      localStorage.setItem("customAlarmSound", customAlarmSound)
      document.getElementById("uploadStatus").textContent = `✓ ${file.name}`
    }
    reader.readAsDataURL(file)
  }
}

// Load custom alarm sound from localStorage
const savedAlarm = localStorage.getItem("customAlarmSound")
if (savedAlarm) {
  customAlarmSound = savedAlarm
  document.getElementById("uploadStatus").textContent = "✓ Custom sound loaded"
}

document.getElementById("resetProgress").onclick = () => {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
    completedSessions = {}
    saveCompletedSessions(completedSessions)
    renderTimetable()
    renderUnitsOverview()
    alert("Progress has been reset!")
  }
}

// Initialize
renderDayTabs()
renderTimetable()
renderUnitsOverview()
updateCurrentSession()

// Update every second
timerInterval = setInterval(() => {
  updateCurrentSession()
}, 1000)

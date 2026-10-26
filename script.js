// --------- 1. Grab the elements we need from the page ---------
const messageList = document.getElementById("messages");
const form = document.getElementById("message-form");
const input = document.getElementById("message-input");
const userSelect = document.getElementById("user-select");
const clearBtn = document.getElementById("clear-btn");

// --------- 2. Storage (localStorage works like a small database) ---------
const STORAGE_KEY = "class-chat-messages";

function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return []; // if the saved data is damaged, start fresh
  }
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

let messages = loadMessages();

// --------- 3. Show messages on the screen ---------
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderMessages() {
  messageList.innerHTML = "";
  const countElement = document.getElementById("msg-count");
  if (countElement) {
    countElement.textContent = messages.length;

  }

  if (messages.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No messages yet. Type one below to start the chat.";
    messageList.appendChild(empty);
    return;
  }

  messages.forEach((msg) => {
    const item = document.createElement("li");
    const isMine = msg.sender === userSelect.value;
    item.className = isMine ? "message mine" : "message";

    const author = document.createElement("span");
    author.className = "author";
    author.textContent = msg.sender;

    const text = document.createElement("p");
    // textContent (not innerHTML) keeps the page safe from injected HTML
    text.textContent = msg.text;

    const time = document.createElement("time");
    time.textContent = formatTime(msg.time);

    item.append(author, text, time);
    messageList.appendChild(item);
  });

  // Always scroll to the newest message
  messageList.scrollTop = messageList.scrollHeight;
}

// --------- 4. Handle user actions (events) ---------
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  const text = input.value.trim();
  if (text === "") return;

  messages.push({
    sender: userSelect.value,
    text: text,
    time: Date.now(),
  });

  saveMessages();
  renderMessages();
  input.value = "";
  input.focus();
});

userSelect.addEventListener("change", () => {
  renderMessages(); // bubbles flip sides depending on who is "me"
  input.focus();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Delete all messages?")) {
    messages = [];
    saveMessages();
    renderMessages();
  }
});

// --------- 5. Live updates between browser tabs ---------
// The "storage" event fires in OTHER tabs when one tab saves data,
// so two open tabs behave like two people chatting.
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    messages = loadMessages();
    renderMessages();
  }
});

// --------- 6. First draw when the page opens ---------
renderMessages();




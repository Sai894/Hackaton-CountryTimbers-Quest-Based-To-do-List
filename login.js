// login.js
const emailInput = document.getElementById('email');
const continueBtn = document.getElementById('continueBtn');
const message = document.getElementById('message');

continueBtn.addEventListener('click', handleContinue);
emailInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleContinue();
});

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleContinue() {
  const email = emailInput.value.trim().toLowerCase();
  if (!email) { message.textContent = 'Please enter your email.'; return; }
  if (!validEmail(email)) { message.textContent = 'Invalid email address.'; return; }

  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (!users[email]) {
    users[email] = {
      email,
      xp: 0,
      level: 1,
      coins: 0,
      color: '#4cd137',
      quests: []
    };
  }

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('activeUser', email);
  window.location.href = 'index.html';
}


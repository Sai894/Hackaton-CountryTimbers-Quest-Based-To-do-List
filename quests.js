function getUserData() {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[activeUser];
  
  // Just in case user data gets lost or corrupted
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  return { user, users, activeUser };
}

function saveUser({ user, users, activeUser }) {
  users[activeUser] = user;
  localStorage.setItem("users", JSON.stringify(users));
}


function getNextQuest() {
  const { user } = getUserData();
  return user.quests.find(q => !q.completed);
}

function completeQuest(text) {
  const { user, users, activeUser } = getUserData();
  const quest = user.quests.find(q => q.text === text);

  if (quest && !quest.completed) {
    quest.completed = true;
    user.xp += 20;
    user.coins += 10;   // reward coins
    if (user.xp >= 100) {
      user.level++;
      user.xp -= 100;
      user.coins += 50; // level-up bonus
    }
    saveUser({ user, users, activeUser });
  }
}

/* === Cosmetic Shop Logic === */
const cosmetics = [
  { name: 'Red Outfit', color: '#e74c3c', price: 50 },
  { name: 'Blue Outfit', color: '#3498db', price: 50 },
  { name: 'Gold Armor', color: '#f1c40f', price: 100 },
  { name: 'Shadow Cloak', color: '#2c3e50', price: 75 }
];

function openShop() {
  const shop = document.getElementById('shop');
  const { user, users, activeUser } = getUserData();
  const shopItems = document.getElementById('shopItems');
  shopItems.innerHTML = '';

  cosmetics.forEach(item => {
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.textContent = `${item.name} - ${item.price} coins`;
    div.onclick = () => {
      if (user.coins >= item.price) {
        user.coins -= item.price;
        user.color = item.color;
        saveUser({ user, users, activeUser });
        alert(`You bought ${item.name}!`);
        updateHUD();
        closeShop();
      } else {
        alert('Not enough coins!');
      }
    };
    shopItems.appendChild(div);
  });

  shop.style.display = 'block';
}

function closeShop() {
  document.getElementById('shop').style.display = 'none';
}

function updateHUD() {
  const { user } = getUserData();
  document.getElementById('xp').textContent = user.xp;
  document.getElementById('level').textContent = user.level;
  document.getElementById('coins').textContent = `Coins: ${user.coins}`;
}

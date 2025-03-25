// Initialize Firebase
const db = firebase.firestore();

// Load all players
async function loadPlayers() {
  const playersList = document.getElementById('playersList');
  playersList.innerHTML = '<p class="loading">Loading players...</p>';

  try {
    const snapshot = await db.collection('players')
      .orderBy('timestamp', 'desc')
      .get();

    if (snapshot.empty) {
      playersList.innerHTML = '<p class="no-players">No players registered yet.</p>';
      return;
    }

    playersList.innerHTML = '';
    snapshot.forEach(doc => {
      const player = doc.data();
      playersList.innerHTML += `
        <div class="player-card" data-division="${player.division}">
          <h3>${player.name}</h3>
          <p><strong>Division:</strong> ${player.division}</p>
          <p><strong>Availability:</strong> ${player.availability}</p>
          <button class="challenge-btn" onclick="sendChallenge('${player.email}', '${player.name}')">
            Challenge
          </button>
        </div>
      `;
    });
  } catch (error) {
    playersList.innerHTML = '<p class="error">Failed to load players. Refresh to try again.</p>';
    console.error('Firebase error:', error);
  }
}

// Filter by division
document.getElementById('divisionFilter').addEventListener('change', (e) => {
  const division = e.target.value;
  document.querySelectorAll('.player-card').forEach(card => {
    card.style.display = (division === 'all' || card.dataset.division === division) ? 'block' : 'none';
  });
});

// Search players
document.getElementById('playerSearch').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.player-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
});

// Send challenge
function sendChallenge(email, name) {
  const time = prompt(`Propose match time to ${name} (e.g., "Friday 7 PM"):`);
  if (time) {
    alert(`Challenge sent!\nPlayer: ${name}\nTime: ${time}\nWe'll notify them at ${email}`);
    // Note: In production, integrate with EmailJS or Firebase Cloud Messaging
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadPlayers);
document.getElementById('playerRegistrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const playerData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      division: document.getElementById('division').value,
      availability: document.getElementById('availability').value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
  
    try {
      await db.collection('players').add(playerData);
      alert('Registration successful!');
      window.location.href = 'ladder.html';
    } catch (error) {
      console.error('Error registering player:', error);
    }
  });
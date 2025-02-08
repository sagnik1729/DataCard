

const form = document.getElementById('userForm');
const card = document.getElementById('card');
const themeButtons = document.querySelectorAll('.theme-btn');
const countryDropdown = document.getElementById('country');
card.classList.add('hidden'); // Hide card by default
form.classList.remove('hidden'); // Show form by default


document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
    const savedData = JSON.parse(localStorage.getItem('userProfile'));

    if (savedData) {
        updateCard(savedData);
        form.classList.add('hidden'); // Hide form if data exists
        card.classList.remove('hidden'); // Show card
    } else {
        form.classList.remove('hidden'); // Show form if no data
        card.classList.add('hidden'); // Hide card
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.className = savedTheme;
});

// Fetch countries from API
async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort alphabetically
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.textContent = country.name.common;
            countryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        country: form.country.value,
        phone: form.phone.value,
        email: form.email.value,
        state: form.state.value,
        city: form.city.value,
        pin: form.pin.value
    };

    localStorage.setItem('userProfile', JSON.stringify(userData));
    updateCard(userData);
    toggleFormVisibility(false); // Hide form after saving
    showConfetti();
});

function updateCard(data) {
    document.getElementById('cardName').textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById('cardEmail').textContent = data.email;
    document.getElementById('cardPhone').textContent = data.phone;
    document.getElementById('cardLocation').textContent =
        `${data.city}, ${data.state}, ${data.country}`;
    document.getElementById('cardPin').textContent = data.pin;

    card.classList.remove('hidden');
}

function enableEditing() {
    toggleFormVisibility(true);
    const savedData = JSON.parse(localStorage.getItem('userProfile'));

    if (savedData) {
        // Populate form with existing data
        form.firstName.value = savedData.firstName;
        form.lastName.value = savedData.lastName;
        form.country.value = savedData.country;
        form.phone.value = savedData.phone;
        form.email.value = savedData.email;
        form.state.value = savedData.state;
        form.city.value = savedData.city;
        form.pin.value = savedData.pin;
    }

    // Add smooth transition
    form.style.opacity = 0;
    setTimeout(() => {
        form.style.opacity = 1;
    }, 10);
}

// Modified toggle function
function toggleFormVisibility(showForm) {
    if (showForm) {
        form.classList.remove('hidden');
        card.classList.add('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.classList.add('hidden');
        card.classList.remove('hidden');
        card.scrollIntoView({ behavior: 'smooth' });
    }
    void form.offsetHeight;
    void card.offsetHeight;
}

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.body.className = `${btn.dataset.theme}-theme`;
        localStorage.setItem('theme', `${btn.dataset.theme}-theme`);
    });
});

function showConfetti() {
    const colors = ['#4a90e2', '#50e3c2', '#ff6b6b'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}%;
      border-radius: 50%;
      animation: confettiFall ${Math.random() * 3 + 2}s linear;
      z-index: 9999;
    `;

        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
  @keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(100vh) rotate(360deg); }
  }
`;
document.head.appendChild(style);
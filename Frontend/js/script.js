let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let darkMode = localStorage.getItem('dark-mode');

const enableDarkMode = () =>{
   toggleBtn.classList.replace('fa-sun', 'fa-moon');
   body.classList.add('dark');
   localStorage.setItem('dark-mode', 'enabled');
}

const disableDarkMode = () =>{
   toggleBtn.classList.replace('fa-moon', 'fa-sun');
   body.classList.remove('dark');
   localStorage.setItem('dark-mode', 'disabled');
}

if(darkMode === 'enabled'){
   enableDarkMode();
}

toggleBtn.onclick = (e) =>{
   darkMode = localStorage.getItem('dark-mode');
   if(darkMode === 'disabled'){
      enableDarkMode();
   }else{
      disableDarkMode();
   }
}

let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () =>{
   profile.classList.toggle('active');
   search.classList.remove('active');
}

let search = document.querySelector('.header .flex .search-form');

document.querySelector('#search-btn').onclick = () =>{
   search.classList.toggle('active');
   profile.classList.remove('active');
}

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

window.onscroll = () =>{
   profile.classList.remove('active');
   search.classList.remove('active');

   if(window.innerWidth < 1200){
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
}

async function analyzeLearning() {
    try {
        const response = await fetch('/analyze_learning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_id: "STU001",  // Replace with actual student ID
                course_id: "COURSE101" // Replace with actual course ID
            })
        });

        const data = await response.json();
        
        // Update UI with results
        document.getElementById('learningPace').textContent = data.learning_pace;
        document.getElementById('accuracyScore').textContent = `${data.accuracy.toFixed(2)}%`;
        document.getElementById('sessionDuration').textContent = data.recommendations.session_duration;
        document.getElementById('contentType').textContent = data.recommendations.content_type;
        document.getElementById('practiceLevel').textContent = data.recommendations.practice_exercises;

    } catch (error) {
        console.error('Error analyzing learning pace:', error);
    }
}

// Function to check auth status and update UI
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!token || !userData) {
        // Redirect to login if on protected pages
        const protectedPages = ['profile.html', 'update.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}

// Update profile data across all pages
function updateGlobalProfile() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isLoggedIn = checkAuthStatus();

    if (isLoggedIn) {
        // Update any profile elements present on the page
        const profileElements = document.querySelectorAll('.profile .name, #profileName, #sideProfileName');
        const roleElements = document.querySelectorAll('.profile .role, #profileRole, #sideProfileRole');

        profileElements.forEach(element => {
            if (element) element.textContent = userData.fullName || 'User';
        });

        roleElements.forEach(element => {
            if (element) element.textContent = userData.role || 'student';
        });
    }
}

// Call on every page load
document.addEventListener('DOMContentLoaded', updateGlobalProfile);
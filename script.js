// Global Variables
let currentUser = null;
let currentTab = 'dashboard';
let appointments = [];
let medications = [];
let referrals = [];
let patients = [];
let doctors = [];
let chatMessages = [];

// Sample Data
const sampleData = {
    doctors: [
        { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', email: 'sarah.johnson@medicare.com', phone: '(555) 123-4567' },
        { id: 2, name: 'Dr. Michael Chen', specialty: 'Pediatrics', email: 'michael.chen@medicare.com', phone: '(555) 234-5678' },
        { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Orthopedics', email: 'emily.rodriguez@medicare.com', phone: '(555) 345-6789' },
        { id: 4, name: 'Dr. David Wilson', specialty: 'Neurology', email: 'david.wilson@medicare.com', phone: '(555) 456-7890' }
    ],
    patients: [
        { id: 1, name: 'John Smith', age: 45, email: 'john.smith@email.com', phone: '(555) 111-2222' },
        { id: 2, name: 'Mary Johnson', age: 32, email: 'mary.johnson@email.com', phone: '(555) 222-3333' },
        { id: 3, name: 'Robert Brown', age: 67, email: 'robert.brown@email.com', phone: '(555) 333-4444' },
        { id: 4, name: 'Lisa Davis', age: 28, email: 'lisa.davis@email.com', phone: '(555) 444-5555' }
    ],
    staff: [
        { id: 1, name: 'Alice Cooper', role: 'Nurse', email: 'alice.cooper@medicare.com', phone: '(555) 555-6666' },
        { id: 2, name: 'Bob Martinez', role: 'Administrator', email: 'bob.martinez@medicare.com', phone: '(555) 666-7777' }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

function initializeApp() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Show login screen by default
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function loadSampleData() {
    doctors = [...sampleData.doctors];
    patients = [...sampleData.patients];
    
    // Generate sample appointments
    appointments = [
        {
            id: 1,
            patientId: 1,
            doctorId: 1,
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            reason: 'Regular checkup',
            status: 'scheduled'
        },
        {
            id: 2,
            patientId: 2,
            doctorId: 2,
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: '14:30',
            reason: 'Vaccination',
            status: 'scheduled'
        }
    ];
    
    // Generate sample medications
    medications = [
        {
            id: 1,
            patientId: 1,
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        },
        {
            id: 2,
            patientId: 2,
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            startDate: '2024-06-01',
            endDate: '2024-06-15'
        }
    ];
    
    // Generate sample referrals
    referrals = [
        {
            id: 1,
            patientId: 1,
            fromDoctorId: 1,
            toDoctorId: 3,
            reason: 'Joint pain evaluation',
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        }
    ];
}

function setupEventListeners() {
    // Chat toggle
    document.getElementById('chatToggle').addEventListener('click', toggleChatbot);
    document.getElementById('closeChatbot').addEventListener('click', closeChatbot);
    
    // Chat input
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    
    // Mobile menu toggle
    document.getElementById('mobileMenuToggle').addEventListener('click', toggleMobileMenu);
    
    // Form submissions
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);
    document.getElementById('medicationForm').addEventListener('submit', handleMedicationSubmit);
    document.getElementById('referralForm').addEventListener('submit', handleReferralSubmit);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Authentication Functions
function login(userType) {
    let userData;
    
    switch(userType) {
        case 1: // Doctor
            userData = {
                id: 1,
                name: 'Dr. Sarah Johnson',
                type: 'doctor',
                email: 'sarah.johnson@medicare.com',
                phone: '(555) 123-4567',
                specialty: 'Cardiology'
            };
            break;
        case 2: // Patient
            userData = {
                id: 1,
                name: 'John Smith',
                type: 'patient',
                email: 'john.smith@email.com',
                phone: '(555) 111-2222',
                age: 45
            };
            break;
        case 3: // Staff
            userData = {
                id: 1,
                name: 'Alice Cooper',
                type: 'staff',
                email: 'alice.cooper@medicare.com',
                phone: '(555) 555-6666',
                role: 'Nurse'
            };
            break;
    }
    
    currentUser = userData;
    
    // Hide login screen and show main app
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update UI based on user type
    updateUIForUser();
    
    // Load dashboard
    switchTab('dashboard');
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    closeChatbot();
}

function updateUIForUser() {
    // Update user name in header
    document.getElementById('userName').textContent = currentUser.name;
    
    // Update welcome message
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}!`;
    
    // Show/hide buttons based on user type
    const newMedicationBtn = document.getElementById('newMedicationBtn');
    const newReferralBtn = document.getElementById('newReferralBtn');
    
    if (currentUser.type === 'doctor') {
        newMedicationBtn.classList.remove('hidden');
        newReferralBtn.classList.remove('hidden');
    } else {
        newMedicationBtn.classList.add('hidden');
        newReferralBtn.classList.add('hidden');
    }
    
    // Update profile information
    updateProfileInfo();
    
    // Populate form dropdowns
    populateFormDropdowns();
}

function updateProfileInfo() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.type.charAt(0).toUpperCase() + currentUser.type.slice(1);
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profilePhone').value = currentUser.phone;
    
    if (currentUser.specialty) {
        document.getElementById('profileSpecialty').textContent = currentUser.specialty;
    } else if (currentUser.role) {
        document.getElementById('profileSpecialty').textContent = currentUser.role;
    } else {
        document.getElementById('profileSpecialty').textContent = '';
    }
    
    if (currentUser.age) {
        document.getElementById('profileAge').value = currentUser.age;
    } else {
        document.getElementById('profileAgeGroup').style.display = 'none';
    }
}

// Navigation Functions
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to selected nav button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    currentTab = tabName;
    
    // Load tab content
    loadTabContent(tabName);
    
    // Close mobile menu
    document.getElementById('sidebar').classList.remove('open');
}

function loadTabContent(tabName) {
    switch(tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'medications':
            loadMedications();
            break;
        case 'referrals':
            loadReferrals();
            break;
        case 'profile':
            // Profile is already loaded in updateUIForUser
            break;
    }
}

// Dashboard Functions
function loadDashboard() {
    // Update statistics
    const userAppointments = getUserAppointments();
    const userMedications = getUserMedications();
    const userReferrals = getUserReferrals();
    
    document.getElementById('appointmentCount').textContent = userAppointments.length;
    document.getElementById('medicationCount').textContent = userMedications.length;
    document.getElementById('referralCount').textContent = userReferrals.length;
    
    // Load recent appointments
    loadRecentAppointments();
}

function loadRecentAppointments() {
    const recentAppointments = getUserAppointments().slice(0, 5);
    const container = document.getElementById('recentAppointmentsList');
    
    if (recentAppointments.length === 0) {
        container.innerHTML = '<p>No recent appointments</p>';
        return;
    }
    
    container.innerHTML = recentAppointments.map(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        
        return `
            <div class="appointment-item">
                <div class="appointment-header">
                    <h4>${currentUser.type === 'patient' ? doctor?.name : patient?.name}</h4>
                    <span class="appointment-date">${formatDate(appointment.date)} at ${appointment.time}</span>
                </div>
                <p>${appointment.reason}</p>
                <span class="appointment-status status-${appointment.status}">${appointment.status}</span>
            </div>
        `;
    }).join('');
}

// Appointment Functions
function loadAppointments() {
    const userAppointments = getUserAppointments();
    const container = document.getElementById('appointmentsList');
    
    if (userAppointments.length === 0) {
        container.innerHTML = '<div class="empty-state">No appointments found</div>';
        return;
    }
    
    container.innerHTML = userAppointments.map(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        
        return `
            <div class="appointment-item">
                <div class="appointment-header">
                    <h4>${currentUser.type === 'patient' ? doctor?.name : patient?.name}</h4>
                    <div class="appointment-actions">
                        <button onclick="editAppointment(${appointment.id})" class="action-btn">Edit</button>
                        <button onclick="deleteAppointment(${appointment.id})" class="action-btn delete">Delete</button>
                    </div>
                </div>
                <p><strong>Date:</strong> ${formatDate(appointment.date)} at ${appointment.time}</p>
                <p><strong>Reason:</strong> ${appointment.reason}</p>
                <p><strong>Status:</strong> <span class="status-${appointment.status}">${appointment.status}</span></p>
            </div>
        `;
    }).join('');
}

function showNewAppointmentForm() {
    document.getElementById('newAppointmentForm').classList.remove('hidden');
    document.getElementById('appointmentDate').min = new Date().toISOString().split('T')[0];
}

function hideNewAppointmentForm() {
    document.getElementById('newAppointmentForm').classList.add('hidden');
    document.getElementById('appointmentForm').reset();
}

function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointment = {
        id: appointments.length + 1,
        patientId: parseInt(document.getElementById('appointmentPatient').value),
        doctorId: parseInt(document.getElementById('appointmentDoctor').value),
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        reason: document.getElementById('appointmentReason').value,
        status: 'scheduled'
    };
    
    appointments.push(appointment);
    hideNewAppointmentForm();
    loadAppointments();
    showNotification('Appointment created successfully!', 'success');
}

function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        appointments = appointments.filter(a => a.id !== appointmentId);
        loadAppointments();
        showNotification('Appointment deleted successfully!', 'success');
    }
}

// Medication Functions
function loadMedications() {
    const userMedications = getUserMedications();
    const container = document.getElementById('medicationsList');
    
    if (userMedications.length === 0) {
        container.innerHTML = '<div class="empty-state">No medications found</div>';
        return;
    }
    
    container.innerHTML = userMedications.map(medication => {
        const patient = patients.find(p => p.id === medication.patientId);
        
        return `
            <div class="medication-item">
                <div class="medication-header">
                    <h4>${medication.name}</h4>
                    <div class="medication-actions">
                        <button onclick="editMedication(${medication.id})" class="action-btn">Edit</button>
                        <button onclick="deleteMedication(${medication.id})" class="action-btn delete">Delete</button>
                    </div>
                </div>
                <p><strong>Patient:</strong> ${patient?.name}</p>
                <p><strong>Dosage:</strong> ${medication.dosage}</p>
                <p><strong>Frequency:</strong> ${medication.frequency}</p>
                <p><strong>Duration:</strong> ${formatDate(medication.startDate)} - ${medication.endDate ? formatDate(medication.endDate) : 'Ongoing'}</p>
            </div>
        `;
    }).join('');
}

function showNewMedicationForm() {
    document.getElementById('newMedicationForm').classList.remove('hidden');
    document.getElementById('medicationStartDate').min = new Date().toISOString().split('T')[0];
}

function hideNewMedicationForm() {
    document.getElementById('newMedicationForm').classList.add('hidden');
    document.getElementById('medicationForm').reset();
}

function handleMedicationSubmit(e) {
    e.preventDefault();
    
    const medication = {
        id: medications.length + 1,
        patientId: parseInt(document.getElementById('medicationPatient').value),
        name: document.getElementById('medicationName').value,
        dosage: document.getElementById('medicationDosage').value,
        frequency: document.getElementById('medicationFrequency').value,
        startDate: document.getElementById('medicationStartDate').value,
        endDate: document.getElementById('medicationEndDate').value || null
    };
    
    medications.push(medication);
    hideNewMedicationForm();
    loadMedications();
    showNotification('Medication added successfully!', 'success');
}

function deleteMedication(medicationId) {
    if (confirm('Are you sure you want to delete this medication?')) {
        medications = medications.filter(m => m.id !== medicationId);
        loadMedications();
        showNotification('Medication deleted successfully!', 'success');
    }
}

// Referral Functions
function loadReferrals() {
    const userReferrals = getUserReferrals();
    const container = document.getElementById('referralsList');
    
    if (userReferrals.length === 0) {
        container.innerHTML = '<div class="empty-state">No referrals found</div>';
        return;
    }
    
    container.innerHTML = userReferrals.map(referral => {
        const patient = patients.find(p => p.id === referral.patientId);
        const fromDoctor = doctors.find(d => d.id === referral.fromDoctorId);
        const toDoctor = doctors.find(d => d.id === referral.toDoctorId);
        
        return `
            <div class="referral-item">
                <div class="referral-header">
                    <h4>Referral to ${toDoctor?.name}</h4>
                    <div class="referral-actions">
                        <button onclick="deleteReferral(${referral.id})" class="action-btn delete">Delete</button>
                    </div>
                </div>
                <p><strong>Patient:</strong> ${patient?.name}</p>
                <p><strong>From:</strong> ${fromDoctor?.name}</p>
                <p><strong>To:</strong> ${toDoctor?.name} (${toDoctor?.specialty})</p>
                <p><strong>Reason:</strong> ${referral.reason}</p>
                <p><strong>Date:</strong> ${formatDate(referral.date)}</p>
                <p><strong>Status:</strong> <span class="status-${referral.status}">${referral.status}</span></p>
            </div>
        `;
    }).join('');
}

function showNewReferralForm() {
    document.getElementById('newReferralForm').classList.remove('hidden');
}

function hideNewReferralForm() {
    document.getElementById('newReferralForm').classList.add('hidden');
    document.getElementById('referralForm').reset();
}

function handleReferralSubmit(e) {
    e.preventDefault();
    
    const referral = {
        id: referrals.length + 1,
        patientId: parseInt(document.getElementById('referralPatient').value),
        fromDoctorId: currentUser.id,
        toDoctorId: parseInt(document.getElementById('referralDoctor').value),
        reason: document.getElementById('referralReason').value,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    };
    
    referrals.push(referral);
    hideNewReferralForm();
    loadReferrals();
    showNotification('Referral created successfully!', 'success');
}

function deleteReferral(referralId) {
    if (confirm('Are you sure you want to delete this referral?')) {
        referrals = referrals.filter(r => r.id !== referralId);
        loadReferrals();
        showNotification('Referral deleted successfully!', 'success');
    }
}

// Utility Functions
function getUserAppointments() {
    if (currentUser.type === 'patient') {
        return appointments.filter(a => a.patientId === currentUser.id);
    } else if (currentUser.type === 'doctor') {
        return appointments.filter(a => a.doctorId === currentUser.id);
    }
    return appointments; // Staff can see all
}

function getUserMedications() {
    if (currentUser.type === 'patient') {
        return medications.filter(m => m.patientId === currentUser.id);
    }
    return medications; // Doctors and staff can see all
}

function getUserReferrals() {
    if (currentUser.type === 'patient') {
        return referrals.filter(r => r.patientId === currentUser.id);
    } else if (currentUser.type === 'doctor') {
        return referrals.filter(r => r.fromDoctorId === currentUser.id || r.toDoctorId === currentUser.id);
    }
    return referrals; // Staff can see all
}

function populateFormDropdowns() {
    // Populate patient dropdowns
    const patientSelects = document.querySelectorAll('#appointmentPatient, #medicationPatient, #referralPatient');
    patientSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Patient</option>';
        patients.forEach(patient => {
            select.innerHTML += `<option value="${patient.id}">${patient.name}</option>`;
        });
    });
    
    // Populate doctor dropdowns
    const doctorSelects = document.querySelectorAll('#appointmentDoctor, #referralDoctor');
    doctorSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doctor => {
            select.innerHTML += `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty}</option>`;
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Mobile Functions
function toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Chatbot Functions
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const indicator = document.getElementById('chatIndicator');
    
    if (chatbot.classList.contains('hidden')) {
        chatbot.classList.remove('hidden');
        indicator.classList.add('hidden');
        
        // Add welcome message if no messages
        if (chatMessages.length === 0) {
            addChatMessage('Hello! I\'m MediBot, your virtual assistant. How can I help you today?', 'bot');
        }
    } else {
        chatbot.classList.add('hidden');
    }
}

function closeChatbot() {
    document.getElementById('chatbot').classList.add('hidden');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = generateBotResponse(message);
            addChatMessage(response, 'bot');
        }, 1000);
    }
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    
    messageElement.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
        <div class="message-time">
            ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
    `;
    
    // Add styles for chat messages
    if (sender === 'user') {
        messageElement.style.cssText = `
            text-align: right;
            margin-bottom: 10px;
        `;
        messageElement.querySelector('.message-content').style.cssText = `
            background: var(--primary-blue);
            color: white;
            padding: 10px 15px;
            border-radius: 18px 18px 4px 18px;
            display: inline-block;
            max-width: 80%;
            word-wrap: break-word;
        `;
    } else {
        messageElement.style.cssText = `
            text-align: left;
            margin-bottom: 10px;
        `;
        messageElement.querySelector('.message-content').style.cssText = `
            background: #f1f5f9;
            color: var(--text-primary);
            padding: 10px 15px;
            border-radius: 18px 18px 18px 4px;
            display: inline-block;
            max-width: 80%;
            word-wrap: break-word;
        `;
    }
    
    messageElement.querySelector('.message-time').style.cssText = `
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 5px;
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatMessages.push({ message, sender, timestamp: new Date() });
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('appointment')) {
        return 'I can help you with appointments! You can view, schedule, or manage your appointments in the Appointments tab. Would you like me to guide you there?';
    } else if (message.includes('medication')) {
        return 'For medication information, check the Medications tab where you can view your current prescriptions and dosage instructions.';
    } else if (message.includes('doctor')) {
        return 'You can find information about doctors and referrals in the Referrals tab. Is there something specific you\'d like to know?';
    } else if (message.includes('help')) {
        return 'I\'m here to help! You can ask me about appointments, medications, referrals, or navigating the system. What would you like to know?';
    } else if (message.includes('emergency')) {
        return 'For medical emergencies, please call 911 immediately or visit your nearest emergency room. This system is for non-emergency medical management only.';
    } else {
        return 'I understand you\'re asking about healthcare management. You can use the navigation menu to access different sections like appointments, medications, and referrals. Is there something specific I can help you with?';
    }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: var(--text-muted);
        font-style: italic;
    }
    
    .action-btn {
        background: var(--primary-blue);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin-left: 5px;
        transition: background 0.2s;
    }
    
    .action-btn:hover {
        background: var(--primary-blue-dark);
    }
    
    .action-btn.delete {
        background: #ef4444;
    }
    
    .action-btn.delete:hover {
        background: #dc2626;
    }
    
    .appointment-header,
    .medication-header,
    .referral-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .appointment-actions,
    .medication-actions,
    .referral-actions {
        display: flex;
    }
    
    .status-scheduled {
        color: var(--primary-blue);
        font-weight: 600;
    }
    
    .status-completed {
        color: var(--secondary-green);
        font-weight: 600;
    }
    
    .status-cancelled {
        color: #ef4444;
        font-weight: 600;
    }
    
    .status-pending {
        color: var(--accent-orange);
        font-weight: 600;
    }
`;

document.head.appendChild(notificationStyles);
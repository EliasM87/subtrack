// ==================== //
// API CONFIGURATION
// ==================== //

const API_BASE_URL = '/api/subscriptions';

// ==================== //
// DOM ELEMENTS
// ==================== //

const subscriptionForm = document.getElementById('subscriptionForm');
const subscriptionsList = document.getElementById('subscriptionsList');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const totalCountElement = document.getElementById('totalCount');
const totalCostElement = document.getElementById('totalCost');
const toast = document.getElementById('toast');

// ==================== //
// STATE MANAGEMENT
// ==================== //

let subscriptions = [];

// ==================== //
// INITIALIZATION
// ==================== //

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    console.log('🚀 Inicializando SubTrack...');

    // Event Listeners
    subscriptionForm.addEventListener('submit', handleFormSubmit);

    // Load subscriptions
    await loadSubscriptions();
}

// ==================== //
// API FUNCTIONS
// ==================== //

/**
 * Fetch all subscriptions from the API
 */
async function loadSubscriptions() {
    try {
        showLoading(true);
        console.log('📡 Cargando suscripciones desde:', API_BASE_URL);

        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        subscriptions = await response.json();
        console.log('✅ Suscripciones cargadas:', subscriptions);

        renderSubscriptions();
        updateStats();
        showLoading(false);

    } catch (error) {
        console.error('❌ Error al cargar suscripciones:', error);
        showLoading(false);
        showToast('Error al cargar las suscripciones', 'error');
        renderSubscriptions(); // Show empty state
    }
}

/**
 * Create a new subscription via API
 */
async function createSubscription(subscriptionData) {
    try {
        console.log('📤 Enviando nueva suscripción:', subscriptionData);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriptionData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newSubscription = await response.json();
        console.log('✅ Suscripción creada:', newSubscription);

        // Add to local state
        subscriptions.push(newSubscription);

        // Update UI
        renderSubscriptions();
        updateStats();
        showToast('¡Suscripción añadida correctamente!', 'success');

        return newSubscription;

    } catch (error) {
        console.error('❌ Error al crear suscripción:', error);
        showToast('Error al añadir la suscripción', 'error');
        throw error;
    }
}

/**
 * Delete a subscription (if DELETE endpoint exists)
 * Note: This assumes you might add a DELETE endpoint later
 */
async function deleteSubscription(id) {
    try {
        console.log('🗑️ Eliminando suscripción:', id);

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state
        subscriptions = subscriptions.filter(sub => sub.id !== id);

        // Update UI
        renderSubscriptions();
        updateStats();
        showToast('Suscripción eliminada', 'success');

    } catch (error) {
        console.error('❌ Error al eliminar suscripción:', error);
        showToast('Error al eliminar la suscripción', 'error');
    }
}

// ==================== //
// EVENT HANDLERS
// ==================== //

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const subscriptionData = {
        serviceName: formData.get('name'),
        price: parseFloat(formData.get('price')),
        currency: 'EUR',
        frequency: 'MONTHLY',
        category: formData.get('category'),
        billingDate: formData.get('renewalDate'),
    };

    // Validate data
    if (!validateSubscriptionData(subscriptionData)) {
        showToast('Por favor, completa todos los campos correctamente', 'error');
        return;
    }

    // Create subscription
    await createSubscription(subscriptionData);

    // Reset form
    event.target.reset();
}

/**
 * Handle delete button click
 */
function handleDeleteClick(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
        deleteSubscription(id);
    }
}

// ==================== //
// RENDERING FUNCTIONS
// ==================== //

/**
 * Render all subscriptions
 */
function renderSubscriptions() {
    if (subscriptions.length === 0) {
        subscriptionsList.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';

    subscriptionsList.innerHTML = subscriptions
        .map(subscription => createSubscriptionCard(subscription))
        .join('');

    // Add event listeners to delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            handleDeleteClick(id);
        });
    });
}

/**
 * Create HTML for a subscription card
 */
function createSubscriptionCard(subscription) {
    const formattedDate = formatDate(subscription.billingDate);
    const categoryColor = getCategoryColor(subscription.category);

    return `
        <div class="subscription-card">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(subscription.serviceName)}</h3>
                    <span class="card-category" style="background: ${categoryColor}20; border-color: ${categoryColor}40; color: ${categoryColor};">
                        ${escapeHtml(subscription.category)}
                    </span>
                </div>
            </div>
            
            <div class="card-body">
                <div class="card-price">
                    ${subscription.price.toFixed(2)}€
                    <span class="card-price-label">/mes</span>
                </div>
            </div>
            
            <div class="card-footer">
                <div class="card-date">
                    <span class="card-date-label">Próxima renovación</span>
                    <span class="card-date-value">${formattedDate}</span>
                </div>
                <button class="btn-delete" data-id="${subscription.id}">
                    Eliminar
                </button>
            </div>
        </div>
    `;
}

/**
 * Update statistics in header
 */
function updateStats() {
    const totalCount = subscriptions.length;
    const totalCost = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

    totalCountElement.textContent = totalCount;
    totalCostElement.textContent = `${totalCost.toFixed(2)}€`;

    // Add animation
    totalCountElement.classList.add('pulse');
    totalCostElement.classList.add('pulse');

    setTimeout(() => {
        totalCountElement.classList.remove('pulse');
        totalCostElement.classList.remove('pulse');
    }, 1000);
}

// ==================== //
// UI HELPER FUNCTIONS
// ==================== //

/**
 * Show/hide loading state
 */
function showLoading(show) {
    loadingState.style.display = show ? 'flex' : 'none';
    subscriptionsList.style.display = show ? 'none' : 'grid';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== //
// UTILITY FUNCTIONS
// ==================== //

/**
 * Validate subscription data
 */
function validateSubscriptionData(data) {
    if (!data.serviceName || data.serviceName.trim() === '') return false;
    if (!data.price || data.price <= 0) return false;
    if (!data.category || data.category.trim() === '') return false;
    if (!data.billingDate) return false;

    return true;
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Get color for category
 */
function getCategoryColor(category) {
    const colors = {
        'Streaming': '#667eea',
        'Música': '#f093fb',
        'Software': '#4facfe',
        'Cloud': '#00f2fe',
        'Fitness': '#fa709a',
        'Educación': '#fee140',
        'Otros': '#a0aec0',
    };

    return colors[category] || colors['Otros'];
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    // Handle null/undefined values
    if (text == null) {
        return '';
    }

    // Convert to string if not already
    text = String(text);

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== //
// EXPORT FOR DEBUGGING
// ==================== //

// Make functions available in console for debugging
window.SubTrack = {
    loadSubscriptions,
    createSubscription,
    deleteSubscription,
    subscriptions: () => subscriptions,
};

console.log('✨ SubTrack cargado correctamente');
console.log('💡 Usa window.SubTrack para acceder a las funciones de la API');

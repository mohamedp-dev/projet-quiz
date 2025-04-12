// Stockage des questions
let questions = [];

// Charger les questions au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    setupEventListeners();
    renderQuestionForm();
});

// Écouteurs d'événements
function setupEventListeners() {
    document.getElementById('question-type').addEventListener('change', renderQuestionForm);
    document.getElementById('add-question-btn').addEventListener('click', addQuestion);
}

// Afficher le formulaire selon le type de question
function renderQuestionForm() {
    const type = document.getElementById('question-type').value;
    const container = document.getElementById('options-container');
    
    container.innerHTML = '';
    
    if (type === 'qcm') {
        container.innerHTML = `
            <div class="form-group">
                <label>Options (cochez les réponses correctes) :</label>
                <div id="qcm-options">
                    <div class="option-item">
                        <input type="text" placeholder="Option 1" required>
                        <input type="checkbox"> Correcte
                    </div>
                    <div class="option-item">
                        <input type="text" placeholder="Option 2" required>
                        <input type="checkbox"> Correcte
                    </div>
                    <div class="option-item">
                        <input type="text" placeholder="Option 3" required>
                        <input type="checkbox"> Correcte
                    </div>
                    <div class="option-item">
                        <input type="text" placeholder="Option 4" required>
                        <input type="checkbox"> Correcte
                    </div>
                </div>
                <button id="add-option-btn" class="btn-primary">Ajouter une option supplémentaire</button>
            </div>
        `;
        
        document.getElementById('add-option-btn').addEventListener('click', () => {
            const optionsDiv = document.getElementById('qcm-options');
            const optionCount = optionsDiv.children.length + 1;
            const newOption = document.createElement('div');
            newOption.className = 'option-item';
            newOption.innerHTML = `
                <input type="text" placeholder="Option ${optionCount}">
                <input type="checkbox"> Correcte
            `;
            optionsDiv.appendChild(newOption);
        });
    }
    else if (type === 'truefalse') {
        container.innerHTML = `
            <div class="form-group">
                <label>Réponse correcte :</label>
                <label><input type="radio" name="correct" value="true" checked> Vrai</label>
                <label><input type="radio" name="correct" value="false"> Faux</label>
            </div>
        `;
    }
    else if (type === 'open') {
        container.innerHTML = `
            <div class="form-group">
                <label>Réponses acceptées :</label>
                <input type="text" placeholder="Réponse 1">
                <input type="text" placeholder="Réponse 2">
            </div>
        `;
    }
}

// Ajouter une nouvelle question
function addQuestion() {
    const type = document.getElementById('question-type').value;
    const text = document.getElementById('question-text').value;
    
    if (!text) {
        alert('Veuillez entrer une question');
        return;
    }
    
    const question = {
        id: Date.now(),
        type,
        text
    };
    
    // Récupérer les options selon le type
    if (type === 'qcm') {
        question.options = Array.from(document.querySelectorAll('#qcm-options .option-item')).map(div => ({
            text: div.querySelector('input[type="text"]').value,
            correct: div.querySelector('input[type="checkbox"]').checked
        }));
    }
    else if (type === 'truefalse') {
        question.correct = document.querySelector('input[name="correct"]:checked').value === 'true';
    }
    else if (type === 'open') {
        question.acceptedAnswers = Array.from(document.querySelectorAll('#options-container input[type="text"]'))
            .map(input => input.value)
            .filter(text => text.trim() !== '');
    }
    
    questions.push(question);
    saveQuestions();
    renderQuestions();
    
    // Réinitialiser le formulaire
    document.getElementById('question-text').value = '';
}

// Afficher la liste des questions
function renderQuestions() {
    const container = document.getElementById('questions-list');
    
    container.innerHTML = questions.map(q => `
        <div class="question-item" data-id="${q.id}">
            <div>
                <strong>${q.text}</strong><br>
                <small>Type: ${getTypeName(q.type)}</small>
            </div>
            <div class="question-actions">
                <button class="btn-primary edit-btn">Modifier</button>
                <button class="btn-danger delete-btn">Supprimer</button>
            </div>
        </div>
    `).join('');
    
    // Ajouter les écouteurs d'événements
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = parseInt(this.closest('.question-item').dataset.id);
            deleteQuestion(questionId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = parseInt(this.closest('.question-item').dataset.id);
            editQuestion(questionId);
        });
    });
}

// Fonctions utilitaires
function getTypeName(type) {
    const names = {
        'qcm': 'QCM',
        'truefalse': 'Vrai/Faux',
        'open': 'Réponse ouverte'
    };
    return names[type] || type;
}

function deleteQuestion(id) {
    questions = questions.filter(q => q.id !== id);
    saveQuestions();
    renderQuestions();
}

function editQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    
    // Pré-remplir le formulaire
    document.getElementById('question-type').value = question.type;
    document.getElementById('question-text').value = question.text;
    
    // Supprimer la question originale
    deleteQuestion(id);
    
    // Afficher les options
    renderQuestionForm();
    
    // Pré-remplir les options selon le type
    if (question.type === 'qcm') {
        // Implémentez la logique pour pré-remplir les options QCM
    }
}

// Sauvegarde/chargement
function saveQuestions() {
    localStorage.setItem('questions', JSON.stringify(questions));
}

function loadQuestions() {
    const saved = localStorage.getItem('questions');
    questions = saved ? JSON.parse(saved) : [];
    renderQuestions();
}
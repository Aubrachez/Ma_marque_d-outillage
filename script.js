// Initialisation
let questions = [];
let currentQuestion = 0;
let resultats = {
    "Makita": 0,
    "Milwaukee": 0,
    "Festool": 0,
    "Bosch Pro": 0,
    "Ryobi": 0,
    "DeWalt": 0
};
const BASE_URL = "https://aubrachez.github.io/Ma_marque_d-outillage/";
// Charger les questions
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        updateQuestion();
    })
    .catch(error => {
        console.error('Erreur de chargement des questions:', error);
        document.getElementById('question').textContent = "Erreur de chargement du questionnaire";
    });

// Mettre à jour l'affichage de la question
function updateQuestion() {
    if (questions.length === 0) return;

    const questionElement = document.getElementById('question');
    const progressElement = document.getElementById('progress');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    questionElement.textContent = questions[currentQuestion].question;
    progressElement.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    
    if (currentQuestion === questions.length - 1) {
        yesBtn.textContent = "Oui";
        noBtn.textContent = "Non";
    } else {
        yesBtn.textContent = "Oui";
        noBtn.textContent = "Non";
    }
}

// Gérer la réponse
function handleAnswer(isYes) {
    if (isYes) {
        // Récupérer les marques de la question actuelle
        const marquesQuestion = questions[currentQuestion].marque.split(/[/\s]+/).map(m => m.trim());
        
        // Ajouter 1 point à chaque marque concernée
        marquesQuestion.forEach(marque => {
            if (resultats.hasOwnProperty(marque)) {
                resultats[marque]++;
            }
        });
    }

    // Passer à la question suivante ou afficher les résultats
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        updateQuestion();
    } else {
        afficherResultats();
    }
}

// Afficher les résultats finaux
function afficherResultats() {
    const container = document.querySelector('.question-container');
    
    // Trier les résultats du plus grand au plus petit
    const resultatsTries = Object.entries(resultats)
        .sort((a, b) => b[1] - a[1]);
    
    // Trouver le score maximal
    const scoreMaximal = resultatsTries[0][1];
    
    // Filtrer les marques avec le score maximal
    const marquesGagnantes = resultatsTries.filter(([_, score]) => score === scoreMaximal);
    
    // Créer le contenu avec toutes les marques gagnantes
    let resultatsHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">Résultats du Questionnaire</h2>
        
    `;
    
    marquesGagnantes.forEach(([marque, score]) => {
        resultatsHTML += `
            <div class="result-container" style="margin-bottom: 40px;">
                <div class="image-container">
                    <img src="${BASE_URL}images/${marque.toLowerCase()}.png" alt="${marque}">
                </div>
                <div class="text-container">
                    <h3>${marque}</h3>
                    <p><strong>Profil :</strong> ${getDescriptionMarque(marque)}</p>
                    <p><strong>Caractéristiques :</strong> ${getCaracteristiques(marque)}</p>
                </div>
            </div>
        `;
    });
    
    resultatsHTML += `<button id="restartBtn" style="display: block; margin: 30px auto 0;">Recommencer le test</button>`;
    
    container.innerHTML = resultatsHTML;
    
    // Bouton pour recommencer
    document.getElementById('restartBtn').addEventListener('click', () => {
        location.reload();
    });
}

// Fonction pour obtenir la description de la marque
function getDescriptionMarque(marque) {
    const descriptions = {
        "Makita": "T'es le ninja du bricolage : discret, fidèle, fan de mangas et de boissons chelou à la pompe. Tu bricoles proprement, sans faire de bruit... mais toujours avec style.",
        "Milwaukee": "Toi c’est la puissance, le rouge qui claque, les pick-ups, le whisky-coca et les grosses blagues. T’aimes en mettre plein la vue, et t’as toujours une perceuse à montrer.",
        "Festool": "L’élite du chantier. Tu veux le meilleur, t’as du goût, et tu touches pas un outil qui dépasse d’un millimètre. T’es classe, net, précis.",
        "Bosch Pro": "Le cerveau du groupe. Tu réfléchis, t’optimises, t’aimes l’allemand bien fait. Ta perceuse a plus de fonctions que ton téléphone.",
        "Ryobi": "Le roi du pratique. T’as pas besoin de 1000W pour faire un tabouret. T’es cool, efficace, et tu kiffes la vie à ton rythme.",
        "DeWalt": "VTu veux du jaune, de l’énergie et des pirates. T’es cash, parfois trash, mais jamais boring. Ta visseuse ? Un missile. Toi ? Un personnage."
    };
    return descriptions[marque] || "Cette marque correspond bien à votre profil d'utilisateur.";
}

// Fonction pour obtenir les caractéristiques
function getCaracteristiques(marque) {
    const caracteristiques = {
        "Makita": "Batterie Lithium-Ion, bonne autonomie, design ergonomique, gamme complète",
        "Milwaukee": "Puissance extrême, moteurs haute performance, durabilité exceptionnelle",
        "Festool": "Précision allemande, système d'aspiration intégré, qualité premium",
        "Bosch Pro": "Technologie innovante, faible vibration, système de protection électronique",
        "Ryobi": "Prix abordable, compatibilité ONE+, bonnes performances générales",
        "DeWalt": "Construction robuste, résistance aux chutes, moteurs durables"
    };
    return caracteristiques[marque] || "Outils professionnels de qualité";
}

// Écouteurs d'événements
document.getElementById('yesBtn').addEventListener('click', () => handleAnswer(true));
document.getElementById('noBtn').addEventListener('click', () => handleAnswer(false));

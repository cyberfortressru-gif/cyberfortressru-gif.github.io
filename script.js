const startQuizBtn = document.getElementById('start-quiz-btn');
const heroSection = document.getElementById('hero-section');
const quizContainer = document.getElementById('quiz-container');
const quizQuestionsBlock = document.getElementById('quiz-questions');
const submitQuizBtn = document.getElementById('submit-quiz-btn');
const backBtn = document.getElementById('back-btn');
const contentSections = document.getElementById('content-sections');
const postQuizActions = document.getElementById('post-quiz-actions');
const retakeQuizBtn = document.getElementById('retake-quiz-btn');
const quizProgress = document.getElementById('quiz-progress');
const progressFill = quizProgress ? quizProgress.querySelector('.progress-fill') : null;
const progressText = quizProgress ? quizProgress.querySelector('.progress-text') : null;
const quizResultsModal = document.getElementById('quiz-results-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalContinueBtn = document.getElementById('modal-continue-btn');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultScore = document.getElementById('result-score');
const resultJudgment = document.getElementById('result-judgment');
const resultDetails = document.getElementById('result-details');

const QUIZ_RESULTS_KEY = 'digitalFortressQuizResults';

const questionElements = [];
const answeredQuestions = new Set();

const sectionLinkMap = {
    'basic-security': 'basic-security.html',
    'advanced-security': 'advanced-security.html',
    'social-media-safety': 'social-media-safety.html',
    'gamer-security': 'gamer-security.html',
    'parental-control': 'parental-control.html',
    'student-digital-hygiene': 'student-digital-hygiene.html',
    'career-in-cyber': 'career-in-cyber.html',
    resources: 'resources.html',
    faq: 'faq.html',
    about: 'about.html',
    'basic-passwords': 'basic-passwords.html',
    'basic-updates': 'basic-updates.html',
    'basic-safe-links': 'basic-safe-links.html',
    'advanced-password-managers': 'advanced-password-managers.html',
    'advanced-2fa': 'advanced-2fa.html',
    'advanced-vpn': 'advanced-vpn.html',
    'social-privacy': 'social-privacy.html',
    'social-info': 'social-info.html',
    'social-links': 'social-links.html',
    'gamer-2fa': 'gamer-2fa.html',
    'gamer-phishing': 'gamer-phishing.html',
    'gamer-email': 'gamer-email.html',
    'parental-filters': 'parental-filters.html',
    'parental-rules': 'parental-rules.html',
    'parental-presence': 'parental-presence.html',
    'student-accounts': 'student-accounts.html',
    'student-footprint': 'student-footprint.html',
    'student-devices': 'student-devices.html',
    'career-roles': 'career-roles.html',
    'career-portfolio': 'career-portfolio.html',
    'career-trends': 'career-trends.html',
    'resources-trainings': 'resources-trainings.html',
    'resources-guides': 'resources-guides.html',
    'resources-community': 'resources-community.html',
    'faq-updates': 'faq-updates.html',
    'faq-antiphishing': 'faq-antiphishing.html',
    'faq-2fa': 'faq-2fa.html',
    'about-mission': 'about-mission.html',
    'about-content': 'about-content.html',
    'about-contact': 'about-contact.html'
};

const quizQuestions = [
    {
        question: 'Сколько тебе лет?',
        type: 'number',
        name: 'age',
        options: {
            min: 7,
            max: 99,
            step: 1
        }
    },
    {
        question: 'Насколько часто ты пользуешься социальными сетями?',
        type: 'radio',
        name: 'social-media-usage',
        options: [
            { text: 'Редко', value: 'rarely' },
            { text: 'Иногда', value: 'sometimes' },
            { text: 'Часто', value: 'often' },
            { text: 'Постоянно', value: 'constantly' }
        ]
    },
    {
        question: 'Знаешь ли ты, что такое двухфакторная аутентификация?',
        type: 'radio',
        name: '2fa-knowledge',
        options: [
            { text: 'Да', value: 'yes' },
            { text: 'Нет', value: 'no' },
            { text: 'Что это?', value: 'what_is_it' }
        ]
    },
    {
        question: 'Интересуешься ли ты онлайн-играми?',
        type: 'radio',
        name: 'gaming-interest',
        options: [
            { text: 'Да', value: 'yes' },
            { text: 'Нет', value: 'no' },
            { text: 'Немного', value: 'a_little' }
        ]
    },
    {
        question: 'Есть ли у тебя дети или младшие братья/сестры, которым ты помогаешь с интернетом?',
        type: 'radio',
        name: 'parental-help',
        options: [
            { text: 'Да', value: 'yes' },
            { text: 'Нет', value: 'no' }
        ]
    }
];

function launchQuiz() {
    document.body.classList.add('is-quiz-active');

    if (heroSection) {
        heroSection.setAttribute('aria-hidden', 'true');
        heroSection.classList.add('hidden');
        heroSection.style.display = 'none';
    }

    if (contentSections) {
        contentSections.classList.add('hidden');
        contentSections.classList.remove('visible');
        contentSections.style.display = 'none';
    }

    if (postQuizActions) {
        postQuizActions.style.display = 'none';
    }

    if (quizQuestionsBlock) {
        quizQuestionsBlock.innerHTML = '';
    }

    if (quizContainer) {
        quizContainer.style.display = 'flex';

        requestAnimationFrame(() => {
            quizContainer.classList.add('is-visible');
        });
    }

    if (submitQuizBtn) {
        submitQuizBtn.style.display = 'inline-flex';
        submitQuizBtn.style.opacity = '0';

        requestAnimationFrame(() => {
            submitQuizBtn.style.transition = 'opacity 0.5s ease';
            submitQuizBtn.style.opacity = '1';
        });
    }

    if (quizProgress) {
        quizProgress.style.display = 'flex';
        updateProgress();
    }

    renderQuestions();
}

function updateProgress() {
    if (!progressFill || !progressText || !quizQuestions) {
        return;
    }

    const total = quizQuestions.length;
    const answered = answeredQuestions.size;
    const percentage = total > 0 ? (answered / total) * 100 : 0;

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${answered} / ${total}`;
}

if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
        launchQuiz();
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        document.body.classList.remove('is-quiz-active');

        if (heroSection) {
            heroSection.removeAttribute('aria-hidden');
            heroSection.classList.remove('hidden');
            heroSection.style.display = '';
        }

        if (submitQuizBtn) {
            submitQuizBtn.style.transition = '';
            submitQuizBtn.style.opacity = '';
            submitQuizBtn.style.display = 'none';
        }

        if (quizContainer) {
            quizContainer.classList.remove('is-visible');

            setTimeout(() => {
                quizContainer.style.display = 'none';
            }, 650);
        }

        if (quizQuestionsBlock) {
            quizQuestionsBlock.innerHTML = '';
        }

        if (quizProgress) {
            quizProgress.style.display = 'none';
        }

        if (contentSections) {
            contentSections.classList.add('hidden');
            contentSections.classList.remove('visible');
            contentSections.style.display = 'none';
        }

        if (postQuizActions) {
            postQuizActions.style.display = 'none';
        }

        questionElements.length = 0;
        answeredQuestions.clear();
    });
}

if (submitQuizBtn) {
    submitQuizBtn.addEventListener('click', event => {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }

        const userAnswers = {};

        for (const item of quizQuestions) {
            if (item.type === 'radio') {
                const selected = document.querySelector(`input[name="${item.name}"]:checked`);

                if (!selected) {
                    alert(`Пожалуйста, выбери ответ для: "${item.question}"`);
                    return;
                }

                userAnswers[item.name] = selected.value;
                continue;
            }

            if (item.type === 'number') {
                const input = document.querySelector(`input[name="${item.name}"]`);

                if (!input || input.value.trim() === '') {
                    alert(`Пожалуйста, введи значение для: "${item.question}"`);
                    return;
                }

                userAnswers[item.name] = Number(input.value);
                continue;
            }

            if (item.type === 'select') {
                const select = document.querySelector(`select[name="${item.name}"]`);

                if (!select || !select.value) {
                    alert(`Пожалуйста, выбери вариант для: "${item.question}"`);
                    return;
                }

                userAnswers[item.name] = select.value;
            }
        }

        if (quizContainer) {
            quizContainer.classList.remove('is-visible');

            setTimeout(() => {
                quizContainer.style.display = 'none';
            }, 650);
        }

        if (submitQuizBtn) {
            submitQuizBtn.style.transition = '';
            submitQuizBtn.style.opacity = '';
            submitQuizBtn.style.display = 'none';
        }

        document.body.classList.remove('is-quiz-active');

        if (heroSection) {
            heroSection.classList.add('hidden');
            heroSection.style.display = 'none';
            heroSection.setAttribute('aria-hidden', 'true');
        }

        const result = analyzeQuizResults(userAnswers);
        showQuizResults(result);

        displayRelevantContent(userAnswers);

        try {
            localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(userAnswers));
        } catch (storageError) {
            console.error('Не удалось сохранить результаты теста', storageError);
        }
    });
}

function analyzeQuizResults(answers) {
    let score = 0;
    let maxScore = 0;
    const details = [];

    const age = answers.age || 0;
    const socialMediaUsage = answers['social-media-usage'] || '';
    const twoFactorKnowledge = answers['2fa-knowledge'] || '';
    const gamingInterest = answers['gaming-interest'] || '';
    const parentalHelp = answers['parental-help'] || '';

    maxScore = 5;

    if (age >= 15) {
        score += 1;
        details.push('Твой возраст говорит о том, что ты можешь освоить более продвинутые методы защиты');
    } else {
        details.push('Начни с основ — это поможет заложить крепкий фундамент знаний');
    }

    if (twoFactorKnowledge === 'yes') {
        score += 1;
        details.push('Отлично, что знаешь о двухфакторной аутентификации!');
    } else if (twoFactorKnowledge === 'what_is_it') {
        score += 0.5;
        details.push('2FA — важный инструмент защиты, стоит изучить его подробнее');
    } else {
        details.push('Двухфакторная аутентификация значительно повышает безопасность аккаунтов');
    }

    if (socialMediaUsage === 'rarely' || socialMediaUsage === 'sometimes') {
        score += 1;
        details.push('Умеренное использование соцсетей снижает риски');
    } else if (socialMediaUsage === 'often' || socialMediaUsage === 'constantly') {
        score += 0.5;
        details.push('Активное использование соцсетей требует особого внимания к настройкам приватности');
    }

    if (gamingInterest === 'yes' || gamingInterest === 'a_little') {
        score += 0.5;
        details.push('Игровые аккаунты нуждаются в защите — не забывай об этом');
    }

    if (parentalHelp === 'yes') {
        score += 1;
        details.push('Забота о безопасности детей — это важно и ответственно');
    }

    const percentage = Math.round((score / maxScore) * 100);

    let level, judgment, iconClass, iconEmoji;

    if (percentage >= 80) {
        level = 'Отлично';
        iconClass = 'excellent';
        iconEmoji = '🛡️';
        judgment = 'Ты уже обладаешь хорошими знаниями о кибербезопасности! Продолжай изучать новые методы защиты и оставайся в курсе актуальных угроз.';
    } else if (percentage >= 60) {
        level = 'Хорошо';
        iconClass = 'good';
        iconEmoji = '👍';
        judgment = 'У тебя есть базовые знания, но есть куда расти. Изучи материалы на сайте, чтобы усилить свою защиту в интернете.';
    } else if (percentage >= 40) {
        level = 'Средне';
        iconClass = 'average';
        iconEmoji = '📚';
        judgment = 'Есть понимание основ, но стоит углубить знания. Начни с базовых разделов и постепенно переходи к более сложным темам.';
    } else {
        level = 'Требуется улучшение';
        iconClass = 'needs-improvement';
        iconEmoji = '🔒';
        judgment = 'Не переживай! Каждый эксперт когда-то начинал с нуля. Изучи материалы на сайте, начни с основ и постепенно повышай свой уровень защиты.';
    }

    return {
        score: percentage,
        level,
        judgment,
        iconClass,
        iconEmoji,
        details
    };
}

function showQuizResults(result) {
    if (!quizResultsModal || !resultIcon || !resultScore || !resultJudgment || !resultDetails) {
        return;
    }

    resultIcon.className = `result-icon ${result.iconClass}`;
    resultIcon.textContent = result.iconEmoji;

    resultScore.textContent = `${result.score}%`;

    resultJudgment.textContent = result.judgment;

    let detailsHTML = '<h3>Рекомендации:</h3><ul>';
    result.details.forEach(detail => {
        detailsHTML += `<li>${detail}</li>`;
    });
    detailsHTML += '</ul>';
    resultDetails.innerHTML = detailsHTML;

    quizResultsModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeQuizResults() {
    if (!quizResultsModal) {
        return;
    }

    quizResultsModal.classList.remove('show');
    document.body.style.overflow = '';
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQuizResults);
}

if (modalContinueBtn) {
    modalContinueBtn.addEventListener('click', closeQuizResults);
}

if (quizResultsModal) {
    quizResultsModal.addEventListener('click', (e) => {
        if (e.target === quizResultsModal) {
            closeQuizResults();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quizResultsModal.classList.contains('show')) {
            closeQuizResults();
        }
    });
}

if (retakeQuizBtn) {
    retakeQuizBtn.addEventListener('click', () => {
        try {
            localStorage.removeItem(QUIZ_RESULTS_KEY);
        } catch (storageError) {
            console.error('Не удалось очистить сохранённые результаты', storageError);
        }

        questionElements.length = 0;
        answeredQuestions.clear();

        if (contentSections) {
            contentSections.classList.add('hidden');
            contentSections.classList.remove('visible');
            contentSections.style.display = 'none';
        }

        if (postQuizActions) {
            postQuizActions.style.display = 'none';
        }

        launchQuiz();
    });
}

function renderQuestions() {
    if (!quizQuestionsBlock) {
        return;
    }

    quizQuestionsBlock.innerHTML = '';
    questionElements.length = 0;
    answeredQuestions.clear();

    quizQuestions.forEach((item, index) => {
        const questionWrapper = document.createElement('div');
        questionWrapper.classList.add('quiz-question');

        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${item.question}`;
        questionWrapper.appendChild(title);

        if (item.type === 'radio' && Array.isArray(item.options)) {
            item.options.forEach(option => {
                const label = document.createElement('label');
                label.classList.add('quiz-option');

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = item.name;
                input.value = option.value;

                input.addEventListener('change', () => handleAnswer(index));

                label.appendChild(input);
                label.appendChild(document.createTextNode(option.text));
                questionWrapper.appendChild(label);
            });
        }

        if (item.type === 'select' && Array.isArray(item.options)) {
            const select = document.createElement('select');
            select.name = item.name;

            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'Выбери вариант';
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            item.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                select.appendChild(opt);
            });

            select.addEventListener('change', () => handleAnswer(index));
            questionWrapper.appendChild(select);
        }

        if (item.type === 'number' && item.options) {
            const input = document.createElement('input');
            input.type = 'number';
            input.name = item.name;
            input.min = item.options.min;
            input.max = item.options.max;
            input.step = item.options.step;

            input.addEventListener('input', () => {
                if (input.value !== '') {
                    handleAnswer(index);
                }
            });

            questionWrapper.appendChild(input);
        }

        quizQuestionsBlock.appendChild(questionWrapper);
        questionElements.push(questionWrapper);
    });

    revealQuestion(0);
}

function revealQuestion(index) {
    const target = questionElements[index];

    if (!target) {
        return;
    }

    requestAnimationFrame(() => {
        target.classList.add('is-visible');
    });
}

function handleAnswer(questionIndex) {
    if (answeredQuestions.has(questionIndex)) {
        return;
    }

    answeredQuestions.add(questionIndex);
    updateProgress();

    const nextIndex = questionIndex + 1;

    if (questionElements[nextIndex]) {
        revealQuestion(nextIndex);
    } else if (submitQuizBtn) {
        submitQuizBtn.style.display = 'inline-flex';
        submitQuizBtn.style.opacity = '0';
        requestAnimationFrame(() => {
            submitQuizBtn.style.transition = 'opacity 0.5s ease';
            submitQuizBtn.style.opacity = '1';
        });
    }
}

function displayRelevantContent(answers) {
    if (!contentSections) {
        return;
    }

    contentSections.style.display = 'block';
    contentSections.classList.remove('hidden');
    contentSections.classList.add('visible');

    const sections = contentSections.querySelectorAll('.content-section');
    const sectionsToShow = new Set();

    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.add('hidden');
        section.classList.remove('visible');
        section.classList.remove('pull-left', 'pull-right');
    });

    const age = typeof answers.age === 'number' ? answers.age : Number(answers.age);
    const twoFactor = answers['2fa-knowledge'];
    const socialUsage = answers['social-media-usage'];
    const gamingInterest = answers['gaming-interest'];
    const parentalHelp = answers['parental-help'];

    if (!Number.isNaN(age) && age >= 15) {
        sectionsToShow.add('advanced-security');
    }

    if (twoFactor === 'yes' || twoFactor === 'what_is_it') {
        sectionsToShow.add('advanced-security');
    }

    if ((Number.isNaN(age) || age < 15) || twoFactor === 'no') {
        sectionsToShow.add('basic-security');
    }

    if (socialUsage && ['often', 'constantly'].includes(socialUsage)) {
        sectionsToShow.add('social-media-safety');
    }

    if (gamingInterest && ['yes', 'a_little'].includes(gamingInterest)) {
        sectionsToShow.add('gamer-security');
    }

    if (parentalHelp === 'yes') {
        sectionsToShow.add('parental-control');
    }

    if (!Number.isNaN(age) && age >= 16 && age <= 25) {
        sectionsToShow.add('student-digital-hygiene');
    }

    if (!Number.isNaN(age) && age >= 18) {
        sectionsToShow.add('career-in-cyber');
    }

    if (!sectionsToShow.has('advanced-security') && !sectionsToShow.has('basic-security')) {
        if (!Number.isNaN(age) && age >= 15) {
            sectionsToShow.add('advanced-security');
        } else {
            sectionsToShow.add('basic-security');
        }
    }

    const orderedVisible = [];

    sections.forEach(section => {
        if (sectionsToShow.has(section.id)) {
            section.style.display = 'block';
            section.classList.add('visible');
            section.classList.remove('hidden');
            orderedVisible.push(section);
        }
    });

    orderedVisible.forEach((section, idx) => {
        if (idx % 2 === 0) {
            section.classList.add('pull-left');
        } else {
            section.classList.add('pull-right');
        }
    });

    if (postQuizActions) {
        postQuizActions.style.display = 'flex';
    }
}

function setupSectionLinks() {
    Object.entries(sectionLinkMap).forEach(([sectionId, href]) => {
        const section = document.getElementById(sectionId);

        if (!section) {
            return;
        }

        section.dataset.link = section.dataset.link || href;
        section.classList.add('is-clickable');
        section.setAttribute('role', 'link');
        if (!section.hasAttribute('tabindex')) {
            section.setAttribute('tabindex', '0');
        }

        const navigate = () => {
            window.location.href = section.dataset.link;
        };

        if (!section.dataset.linkBound) {
            section.addEventListener('click', navigate);
            section.addEventListener('keypress', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate();
                }
            });

            section.dataset.linkBound = 'true';
        }
    });
}

function applySavedResults() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }

    const stored = localStorage.getItem(QUIZ_RESULTS_KEY);

    if (!stored) {
        return;
    }

    try {
        const parsed = JSON.parse(stored);

        if (!parsed || typeof parsed !== 'object') {
            localStorage.removeItem(QUIZ_RESULTS_KEY);
            return;
        }

        document.body.classList.remove('is-quiz-active');

        if (quizContainer) {
            quizContainer.classList.remove('is-visible');
            quizContainer.style.display = 'none';
        }

        if (submitQuizBtn) {
            submitQuizBtn.style.transition = '';
            submitQuizBtn.style.opacity = '';
            submitQuizBtn.style.display = 'none';
        }

        if (heroSection) {
            heroSection.setAttribute('aria-hidden', 'true');
            heroSection.classList.add('hidden');
            heroSection.style.display = 'none';
        }

        displayRelevantContent(parsed);
    } catch (error) {
        console.error('Не удалось восстановить результаты теста', error);
        localStorage.removeItem(QUIZ_RESULTS_KEY);
    }
}

setupSectionLinks();
applySavedResults();


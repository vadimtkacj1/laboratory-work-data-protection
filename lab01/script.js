const commonPasswords = [
    "password",
    "qwerty",
    "admin",
    "welcome",
    "monkey",
    "dragon",
    "master",
    "sunshine",
    "princess",
    "football",
];

function analyzePassword() {
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDate = document.getElementById("birthDate").value;
    const phone = document.getElementById("phone").value;

    if (!password) {
        alert("Будь ласка, введіть пароль!");
        return;
    }

    const analysis = {
        score: 0,
        maxScore: 10,
        issues: [],
        strengths: [],
        recommendations: [],
        personalDataFound: [],
        criteria: {},
    };

    const pwd = password;
    const pwdLower = pwd.toLowerCase();

    if (pwd.length >= 12) {
        analysis.score += 2;
        analysis.strengths.push("Достатня довжина пароля (12+ символів)");
        analysis.criteria.length = { passed: true, score: 2 };
    } else if (pwd.length >= 8) {
        analysis.score += 1;
        analysis.issues.push("Пароль занадто короткий (менше 12 символів)");
        analysis.criteria.length = { passed: false, score: 1 };
    } else {
        analysis.issues.push("Пароль дуже короткий (менше 8 символів)");
        analysis.criteria.length = { passed: false, score: 0 };
    }

    const hasLower = /[a-zа-яії]/.test(pwd);
    const hasUpper = /[A-ZА-ЯЇІ]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    let diversityScore = 0;
    if (hasLower) diversityScore++;
    if (hasUpper) diversityScore++;
    if (hasDigit) diversityScore++;
    if (hasSpecial) diversityScore++;

    analysis.score += diversityScore;
    analysis.criteria.diversity = {
        passed: diversityScore >= 3,
        score: diversityScore,
    };

    if (diversityScore === 4) {
        analysis.strengths.push("Відмінна різноманітність символів");
    } else {
        if (!hasUpper) analysis.issues.push("Відсутні великі літери");
        if (!hasLower) analysis.issues.push("Відсутні малі літери");
        if (!hasDigit) analysis.issues.push("Відсутні цифри");
        if (!hasSpecial) analysis.issues.push("Відсутні спеціальні символи");
    }

    let personalDataPenalty = 0;

    if (firstName && pwdLower.includes(firstName.toLowerCase())) {
        analysis.personalDataFound.push(
            `Ім'я "${firstName}" знайдено в паролі`
        );
        personalDataPenalty += 1;
    }

    if (lastName && pwdLower.includes(lastName.toLowerCase())) {
        analysis.personalDataFound.push(
            `Прізвище "${lastName}" знайдено в паролі`
        );
        personalDataPenalty += 1;
    }

    if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        if (pwd.includes(year)) {
            analysis.personalDataFound.push(
                `Рік народження "${year}" знайдено в паролі`
            );
            personalDataPenalty += 1;
        }
        if (pwd.includes(month + day) || pwd.includes(day + month)) {
            analysis.personalDataFound.push(
                `День та місяць народження знайдено в паролі`
            );
            personalDataPenalty += 1;
        }
    }

    if (phone) {
        const phoneDigits = phone.replace(/\D/g, "");
        const last4 = phoneDigits.slice(-4);
        if (pwd.includes(last4) && last4.length === 4) {
            analysis.personalDataFound.push(
                `Частина телефону "${last4}" знайдена в паролі`
            );
            personalDataPenalty += 1;
        }
    }

    analysis.score -= personalDataPenalty;
    analysis.criteria.personalData = {
        passed: personalDataPenalty === 0,
        penalty: personalDataPenalty,
    };

    const foundCommon = commonPasswords.find((common) =>
        pwdLower.includes(common)
    );
    if (foundCommon) {
        analysis.issues.push(`Містить поширене слово: "${foundCommon}"`);
        analysis.score -= 2;
        analysis.criteria.dictionary = {
            passed: false,
            penalty: 2,
        };
    } else {
        analysis.strengths.push("Не містить словникових слів");
        analysis.score += 2;
        analysis.criteria.dictionary = { passed: true, score: 2 };
    }

    const hasSequence =
        /(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
            pwd
        );
    const hasRepeat = /(.)\1{2,}/.test(pwd);

    if (!hasSequence && !hasRepeat) {
        analysis.strengths.push("Немає послідовностей або повторень");
        analysis.score += 2;
        analysis.criteria.patterns = { passed: true, score: 2 };
    } else {
        if (hasSequence) analysis.issues.push("Містить послідовні символи");
        if (hasRepeat) analysis.issues.push("Містить повторення символів");
        analysis.criteria.patterns = { passed: false, score: 0 };
    }

    analysis.score = Math.max(0, Math.min(analysis.maxScore, analysis.score));

    if (analysis.personalDataFound.length > 0) {
        analysis.recommendations.push(
            "КРИТИЧНО: Уникайте використання особистих даних у паролі"
        );
    }

    if (pwd.length < 12) {
        analysis.recommendations.push(
            "Збільште довжину пароля до мінімум 12 символів"
        );
    }

    if (!hasSpecial) {
        analysis.recommendations.push("Додайте спеціальні символи (!@#$%^&*)");
    }

    if (!hasUpper || !hasLower) {
        analysis.recommendations.push(
            "Використовуйте комбінацію великих та малих літер"
        );
    }

    if (hasSequence || hasRepeat) {
        analysis.recommendations.push("Уникайте послідовностей та повторень");
    }

    if (foundCommon) {
        analysis.recommendations.push("Не використовуйте поширені слова");
    }

    if (analysis.score >= 8) {
        analysis.recommendations.push("Ваш пароль має високий рівень безпеки!");
    }

    displayResults(analysis);
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById("results");

    const scoreColor =
        analysis.score >= 8
            ? "#10b981"
            : analysis.score >= 5
            ? "#f59e0b"
            : "#e53e3e";
    const scoreLabel =
        analysis.score >= 8
            ? "Сильний"
            : analysis.score >= 5
            ? "Середній"
            : "Слабкий";

    let html = `
                <div class="score-box">
                    <div style="color: #666; margin-bottom: 5px;">Оцінка безпеки</div>
                    <div class="score-value" style="color: ${scoreColor};">${analysis.score}/${analysis.maxScore}</div>
                    <div class="score-label" style="color: ${scoreColor};">${scoreLabel}</div>
                </div>
            `;

    if (analysis.personalDataFound.length > 0) {
        html += `
                    <div class="section section-danger">
                        <div class="section-title">Виявлено персональні дані!</div>
                        <ul>
                            ${analysis.personalDataFound
                                .map((item) => `<li>${item}</li>`)
                                .join("")}
                        </ul>
                    </div>
                `;
    }

    if (analysis.strengths.length > 0) {
        html += `
                    <div class="section section-success">
                        <div class="section-title">Переваги</div>
                        <ul>
                            ${analysis.strengths
                                .map((item) => `<li>${item}</li>`)
                                .join("")}
                        </ul>
                    </div>
                `;
    }

    if (analysis.issues.length > 0) {
        html += `
                    <div class="section section-warning">
                        <div class="section-title">Виявлені проблеми</div>
                        <ul>
                            ${analysis.issues
                                .map((item) => `<li>${item}</li>`)
                                .join("")}
                        </ul>
                    </div>
                `;
    }

    html += `
                <div class="section section-info">
                    <div class="section-title">Рекомендації для покращення</div>
                    <ul>
                        ${analysis.recommendations
                            .map((item, idx) => `<li>${idx + 1}. ${item}</li>`)
                            .join("")}
                    </ul>
                </div>
            `;

    html += `
                <div class="criteria">
                    <div class="criteria-title">Детальний аналіз критеріїв</div>
                    <div class="criteria-item">
                        <span>Довжина пароля:</span>
                        <strong style="color: ${
                            analysis.criteria.length.passed
                                ? "#10b981"
                                : "#e53e3e"
                        }">
                            ${analysis.criteria.length.score}/2 балів
                        </strong>
                    </div>
                    <div class="criteria-item">
                        <span>Різноманітність символів:</span>
                        <strong style="color: ${
                            analysis.criteria.diversity.passed
                                ? "#10b981"
                                : "#f59e0b"
                        }">
                            ${analysis.criteria.diversity.score}/4 бали
                        </strong>
                    </div>
                    <div class="criteria-item">
                        <span>Персональні дані:</span>
                        <strong style="color: ${
                            analysis.criteria.personalData.passed
                                ? "#10b981"
                                : "#e53e3e"
                        }">
                            ${
                                analysis.criteria.personalData.passed
                                    ? "Не виявлено"
                                    : `Штраф -${analysis.criteria.personalData.penalty}`
                            }
                        </strong>
                    </div>
                    <div class="criteria-item">
                        <span>Словникові слова:</span>
                        <strong style="color: ${
                            analysis.criteria.dictionary.passed
                                ? "#10b981"
                                : "#e53e3e"
                        }">
                            ${
                                analysis.criteria.dictionary.passed
                                    ? "+2 бали"
                                    : `Штраф -${analysis.criteria.dictionary.penalty}`
                            }
                        </strong>
                    </div>
                    <div class="criteria-item">
                        <span>Послідовності та повтори:</span>
                        <strong style="color: ${
                            analysis.criteria.patterns.passed
                                ? "#10b981"
                                : "#e53e3e"
                        }">
                            ${analysis.criteria.patterns.score}/2 балів
                        </strong>
                    </div>
                </div>
            `;

    resultsDiv.innerHTML = html;
    resultsDiv.classList.add("show");
    resultsDiv.scrollIntoView({ behavior: "smooth" });
}

const analyzebtn = document.querySelector("#analyzebtn")

analyzebtn.addEventListener('click', analyzePassword)
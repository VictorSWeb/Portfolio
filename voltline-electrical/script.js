const problemCards = document.querySelectorAll(".problem-card");
const describeButton = document.querySelector(".describe-button");
const diagnosticStage = document.querySelector(".diagnostic-stage");
const diagnosticStartButton = document.querySelector("#diagnostic-start");
const problemConsole = document.querySelector("#problem-console");
const consoleBackButton = document.querySelector(".console-back");
const diagnosticFlow = document.querySelector("#diagnostic-flow");
const diagnosticResult = document.querySelector("#diagnostic-result");
const flowCategory = document.querySelector("#flow-category");
const flowQuestion = document.querySelector("#flow-question");
const answerGrid = document.querySelector("#answer-grid");
const backButton = document.querySelector("#back-button");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");

let currentProblem = null;
let currentQuestion = 0;
let answers = {};

const diagnostics = {

    flickering: {
        category: "Lights are flickering",

        questions: [
            {
                question: "How many lights are affected?",
                answers: [
                    "One light",
                    "Several lights",
                    "Most of the house"
                ]
            },
            {
                question: "When does it happen?",
                answers: [
                    "Randomly",
                    "When something turns on",
                    "All the time"
                ]
            }
        ],

        result: {
            title: "Let's take a closer look at the circuit.",
            description:
                "Flickering can have several causes, including a fixture, connection or circuit issue. An electrician can inspect the system and identify the cause."
        }
    },


    breaker: {
        category: "Breaker keeps tripping",

        questions: [
            {
                question: "How often does it trip?",
                answers: [
                    "Once in a while",
                    "Several times a day",
                    "Immediately after resetting"
                ]
            },
            {
                question: "Does it happen with a specific appliance?",
                answers: [
                    "Yes",
                    "No",
                    "I'm not sure"
                ]
            }
        ],

        result: {
            title: "The circuit may need to be inspected.",
            description:
                "Repeated breaker trips can have different causes, including circuit overloads, appliance issues or electrical faults. An electrician can determine what's happening."
        }
    },


    outlet: {
        category: "Outlet isn't working",

        questions: [
            {
                question: "Is it just one outlet?",
                answers: [
                    "Yes",
                    "Several outlets",
                    "I'm not sure"
                ]
            },
            {
                question: "Have you checked the breaker?",
                answers: [
                    "Yes",
                    "No",
                    "I'm not sure where it is"
                ]
            }
        ],

        result: {
            title: "Let's check the circuit.",
            description:
                "A non-working outlet can be caused by the outlet itself or another point in the circuit. An electrician can locate the problem safely."
        }
    },


    outage: {
        category: "Power went out",

        questions: [
            {
                question: "Is the whole property without power?",
                answers: [
                    "Yes",
                    "Only part of the property",
                    "I'm not sure"
                ]
            },
            {
                question: "Do your neighbors have power?",
                answers: [
                    "Yes",
                    "No",
                    "I'm not sure"
                ]
            }
        ],

        result: {
            title: "Let's figure out where the outage is.",
            description:
                "If your neighbors are also without power, the issue may be with the local utility rather than your electrical system. If only your property is affected, an electrician can investigate."
        }
    },


    wiring: {
        category: "Need new wiring",

        questions: [
            {
                question: "What are you planning?",
                answers: [
                    "Renovation",
                    "New room or addition",
                    "New appliance",
                    "Older wiring",
                    "Something else"
                ]
            },
            {
                question: "What type of property is it?",
                answers: [
                    "House",
                    "Apartment",
                    "Business"
                ]
            }
        ],

        result: {
            title: "Let's talk about your project.",
            description:
                "New wiring projects vary depending on the property, existing electrical system and planned work. Send us the details and we'll help determine the next step."
        }
    },


    unsafe: {
        category: "Something feels unsafe",

        questions: [
            {
                question: "What are you noticing?",
                answers: [
                    "Burning smell",
                    "Sparks",
                    "Hot outlet or switch",
                    "Shock or tingling",
                    "Something else"
                ]
            }
        ],

        result: {
            title: "This may need immediate attention.",
            description:
                "If you see sparks, smell burning, or notice unusual heat from an electrical component, avoid using the affected equipment and contact an electrician."
        },

        urgent: true
    },


    unknown: {
        category: "Electrical problem",

        questions: [
            {
                question: "What best describes your situation?",
                answers: [
                    "Something stopped working",
                    "Something looks unusual",
                    "I'm planning electrical work",
                    "I'm not sure"
                ]
            },
            {
                question: "What type of property is it?",
                answers: [
                    "House",
                    "Apartment",
                    "Business",
                    "Other"
                ]
            }
        ],

        result: {
            title: "We'll help you figure it out.",
            description:
                "Electrical problems aren't always easy to identify from the symptoms alone. Tell us what you're experiencing and an electrician can help determine the next step."
        }
    }

};


function startDiagnostic(problem) {

    currentProblem = problem;
    currentQuestion = 0;
    answers = {};

    const diagnostic = diagnostics[problem];

    if (!diagnostic) {
        return;
    }

    diagnosticFlow.classList.add("active");

    diagnosticResult.classList.remove("active");

    renderQuestion();

    diagnosticFlow.scrollIntoView({
        behavior: "smooth"
    });
}


function openProblemConsole() {

    diagnosticStartButton.hidden = true;
    diagnosticStage.classList.add("is-open");
    problemConsole.setAttribute("aria-hidden", "false");
    problemConsole.inert = false;
    diagnosticStartButton.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
        problemCards[0].focus({ preventScroll: true });
        problemConsole.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "center"
        });
    });
}


function returnToIntro() {

    diagnosticStartButton.setAttribute("aria-expanded", "false");
    diagnosticStartButton.hidden = false;
    diagnosticStage.classList.remove("is-open");
    problemConsole.setAttribute("aria-hidden", "true");
    problemConsole.inert = true;

    requestAnimationFrame(() => {
        diagnosticStartButton.focus({ preventScroll: true });
        diagnosticStartButton.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "center"
        });
    });
}


function renderQuestion() {

    const diagnostic = diagnostics[currentProblem];
    const question = diagnostic.questions[currentQuestion];

    flowCategory.textContent = diagnostic.category;
    flowQuestion.textContent = question.question;

    answerGrid.innerHTML = "";

    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.className = "answer-button";
        button.textContent = answer;

        button.addEventListener("click", () => {
            selectAnswer(index, answer);
        });

        answerGrid.appendChild(button);
    });

}


function selectAnswer(index, answer) {

    answers[currentQuestion] = answer;

    const diagnostic = diagnostics[currentProblem];

    if (
        currentProblem === "unsafe" &&
        currentQuestion === 0
    ) {
        showResult();
        return;
    }

    if (currentQuestion < diagnostic.questions.length - 1) {

        currentQuestion++;

        renderQuestion();

    } else {

        showResult();

    }

}


function showResult() {

    const diagnostic = diagnostics[currentProblem];

    resultTitle.textContent = diagnostic.result.title;
    resultDescription.textContent = diagnostic.result.description;

    diagnosticResult.classList.add("active");

    diagnosticResult.scrollIntoView({
        behavior: "smooth"
    });
}


function goBack() {

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

        return;
    }

    diagnosticFlow.classList.remove("active");

    document.querySelector("#diagnostic").scrollIntoView({
        behavior: "smooth"
    });
}


problemCards.forEach(card => {

    card.addEventListener("click", () => {

        const problem = card.dataset.problem;

        startDiagnostic(problem);

    });

});


describeButton.addEventListener("click", () => {

    startDiagnostic("unknown");

});


backButton.addEventListener("click", goBack);


diagnosticStartButton.addEventListener("click", openProblemConsole);


consoleBackButton.addEventListener("click", returnToIntro);
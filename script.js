const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const languageButtons = document.querySelectorAll(".language-option");

const translations = {
    en: {
        pageTitle: "Victor Saraiva — Web Designer &amp; Developer",
        metaDescription: "I design and build websites for small businesses. Explore three website concepts by Victor Saraiva.",
        skipLink: "Skip to content",
        logoLabel: "VictorSWeb home",
        menuOpen: "Open navigation",
        menuClose: "Close navigation",
        mainNavigation: "Main navigation",
        languageGroup: "Choose language",
        navWork: "Selected work",
        navApproach: "Approach",
        navAbout: "About",
        navCta: "Got a project?",
        heroEyebrow: "Web designer &amp; developer",
        heroTitle: "I make websites<br><em>For small businesses</em>",
        heroIntro: "I design and build websites that make it easier for people to understand a business and find what they need.",
        heroPrimary: "See the projects",
        heroSecondary: "Have a project in mind?",
        heroFootnote: "I design and build your site<br><strong>You work directly with me</strong>",
        heroWorkLabel: "Previews of selected website concepts",
        barberAria: "Explore the Northside Barber Co. website concept",
        barberAlt: "Northside Barber Co. website concept preview",
        categoryHospitality: "Neighborhood barbershop",
        barberViewAria: "View Northside Barber Co. concept",
        barberPreviewAlt: "Northside Barber Co. barbershop website concept",
        barberKicker: "Barbershop website concept",
        barberDetailOneTitle: "The first impression",
        barberDetailTwoTitle: "The useful bits",
        voltlineAria: "Explore the Voltline Electrical website concept",
        voltlineAlt: "Voltline Electrical website concept preview",
        categoryHomeServices: "Electrician",
        voltlineViewAria: "View Voltline Electrical concept",
        voltlinePreviewAlt: "Voltline Electrical service website concept",
        voltlineKicker: "Electrical services website concept",
        voltlineDetailOneTitle: "A clear first step",
        voltlineDetailTwoTitle: "No guesswork",
        smashAria: "Explore the Smash & Co. burger delivery website concept",
        smashAlt: "Smash & Co. burger restaurant website concept preview",
        categoryHospitality03: "Burger restaurant",
        scrollCue: "Take a closer look",
        workEyebrow: "A note about these projects",
        workTitle: "A barbershop, an electrician<br><em>and a burger restaurant.</em>",
        workIntro: "These are concepts, not client work. I made each one for a different kind of business, thinking about what its customers might need to know or do.",
        barberSummary: "A neighborhood barbershop made for regulars. I kept the feel familiar and made the practical details easy to find.",
        barberDirection: "Warm colors and shop photography help the site feel like a place regulars already know.",
        barberExperience: "Cuts, prices and opening hours are easy to find, whether you’re on a phone or a computer.",
        barberLink: "Visit the barbershop",
        voltlineSummary: "When something electrical needs attention, people want clear answers. This concept helps them figure out where to start.",
        voltlineDirection: "A direct layout and industrial details give the site a practical, capable feel.",
        voltlineExperience: "A simple guide helps visitors find the right next step for the issue they’re dealing with.",
        voltlineLink: "See how it works",
        smashViewAria: "View the Smash & Co. burger delivery website concept",
        smashPreviewAlt: "Smash & Co. burger restaurant website concept preview",
        smashKicker: "Burger restaurant website concept",
        smashDetailOneTitle: "The menu",
        smashDetailTwoTitle: "The full order",
        smashSummary: "I wanted ordering to feel as straightforward as walking up to the counter: choose a burger, make it yours and follow the sample delivery.",
        smashDirection: "Big food photos and bold type give the menu the relaxed feel of a neighborhood burger spot.",
        smashExperience: "The demo lets you customize a burger, check out and follow a sample order.",
        smashLink: "Try the ordering demo",
        conceptNote: "These are fictional businesses. Names, locations and contact details inside the demos are made up.",
        approachEyebrow: "How I work",
        approachTitle: "A site should be clear<br><em>before it is clever.</em>",
        approachIntro: "Good design matters, but first people need to understand what you do and find what they came for. That’s where I start.",
        stepOneTitle: "First, understand the business",
        stepOneText: "I want to know who the site is for, what those people need and what the business wants them to do.",
        stepTwoTitle: "Then, find the right direction",
        stepTwoText: "I plan the pages and visual style around the business, rather than starting with a ready-made look.",
        stepThreeTitle: "Build, test, adjust",
        stepThreeText: "I put the site together, check it on different screens and keep refining until the details feel right.",
        aboutIndex: "HI, I’M VICTOR",
        aboutEyebrow: "A little about me",
        aboutTitle: "I’m Victor.<br><em>I make websites.</em>",
        aboutParagraphOne: "I design and build websites for small businesses. That means one point of contact from the first conversation to the finished site: me.",
        aboutParagraphTwo: "The projects here are concepts I made for a barbershop, an electrician and a burger restaurant. They’re not client work, but you can explore each one just like a real site.",
        aboutLink: "Got an idea? Tell me about it",
        contactEyebrow: "Get in touch",
        contactTitle: "Need a website?<br><em>Let’s talk.</em>",
        contactCopy: "Tell me a little about your business and what you need. We can figure out the next step from there.",
        contactEmailButton: "Email me",
        whatsappAria: "Message Victor on WhatsApp",
        contactWhatsappButton: "Message me on WhatsApp",
        footerTagline: "Designed and built by Victor Saraiva.",
        backToTop: "Back to top ↑"
    },
    pt: {
        pageTitle: "Victor Saraiva — Designer e Desenvolvedor Web",
        metaDescription: "Desenho e desenvolvo sites para pequenos negócios. Conheça três projetos conceituais de Victor Saraiva.",
        skipLink: "Pular para o conteúdo",
        logoLabel: "Página inicial de VictorSWeb",
        menuOpen: "Abrir navegação",
        menuClose: "Fechar navegação",
        mainNavigation: "Navegação principal",
        languageGroup: "Escolha o idioma",
        navWork: "Projetos",
        navApproach: "Processo",
        navAbout: "Sobre",
        navCta: "Tem um projeto?",
        heroEyebrow: "Designer e desenvolvedor web",
        heroTitle: "Faço sites<br><em>Para pequenos negócios</em>",
        heroIntro: "Desenho e desenvolvo sites para ajudar as pessoas a entender o negócio e encontrar o que precisam.",
        heroPrimary: "Ver os projetos",
        heroSecondary: "Está pensando em criar um site?",
        heroFootnote: "Desenho e desenvolvo seu site<br><strong>Você fala direto comigo</strong>",
        heroWorkLabel: "Prévia de projetos conceituais de sites",
        barberAria: "Conheça o projeto de site da Northside Barber Co.",
        barberAlt: "Prévia do projeto de site da Northside Barber Co.",
        categoryHospitality: "Barbearia de bairro",
        barberViewAria: "Ver o projeto da Northside Barber Co.",
        barberPreviewAlt: "Projeto de site da barbearia Northside Barber Co.",
        barberKicker: "Projeto de site para barbearia",
        barberDetailOneTitle: "A primeira impressão",
        barberDetailTwoTitle: "O que importa",
        voltlineAria: "Conheça o projeto de site da Voltline Electrical",
        voltlineAlt: "Prévia do projeto de site da Voltline Electrical",
        categoryHomeServices: "Eletricista",
        voltlineViewAria: "Ver o projeto da Voltline Electrical",
        voltlinePreviewAlt: "Projeto de site de serviços elétricos da Voltline Electrical",
        voltlineKicker: "Projeto de site para eletricista",
        voltlineDetailOneTitle: "Por onde começar",
        voltlineDetailTwoTitle: "Sem adivinhação",
        smashAria: "Conheça o projeto de delivery de hambúrgueres da Smash & Co.",
        smashAlt: "Prévia do projeto de site da hamburgueria Smash &amp; Co.",
        categoryHospitality03: "Hamburgueria",
        scrollCue: "Veja mais de perto",
        workEyebrow: "Uma nota sobre estes projetos",
        workTitle: "Uma barbearia, um eletricista<br><em>e uma hamburgueria.</em>",
        workIntro: "São conceitos, não trabalhos para clientes. Criei cada um para um tipo de negócio, pensando no que seus clientes talvez precisem saber ou fazer.",
        barberSummary: "Uma barbearia de bairro feita para quem já é de casa. Mantive o clima familiar e deixei as informações práticas fáceis de encontrar.",
        barberDirection: "Cores quentes e fotos da barbearia ajudam o site a parecer um lugar que os clientes já conhecem.",
        barberExperience: "Cortes, preços e horários são fáceis de encontrar, no celular ou no computador.",
        barberLink: "Conheça a barbearia",
        voltlineSummary: "Quando surge um problema elétrico, a pessoa quer respostas claras. Este conceito ajuda a entender por onde começar.",
        voltlineDirection: "Um layout direto e detalhes industriais dão ao site um jeito prático e confiável.",
        voltlineExperience: "Um guia simples ajuda a encontrar o próximo passo para cada tipo de problema.",
        voltlineLink: "Veja como funciona",
        smashViewAria: "Ver o projeto de delivery de hambúrgueres da Smash & Co.",
        smashPreviewAlt: "Prévia do projeto de site da hamburgueria Smash & Co.",
        smashKicker: "Projeto de site para hamburgueria",
        smashDetailOneTitle: "O cardápio",
        smashDetailTwoTitle: "O pedido completo",
        smashSummary: "Quis deixar o pedido simples como pedir no balcão: escolha o hambúrguer, monte do seu jeito e acompanhe a entrega de demonstração.",
        smashDirection: "Fotos generosas e letras marcantes dão ao cardápio o clima descontraído de uma hamburgueria de bairro.",
        smashExperience: "No projeto, dá para personalizar o hambúrguer, fechar o pedido e acompanhar uma entrega de demonstração.",
        smashLink: "Teste o pedido",
        conceptNote: "Os negócios são fictícios. Nomes, locais e contatos dentro dos projetos foram inventados.",
        approachEyebrow: "Como eu trabalho",
        approachTitle: "Um site precisa ser claro<br><em>antes de ser criativo.</em>",
        approachIntro: "Um bom visual importa, mas primeiro as pessoas precisam entender o que você faz e encontrar o que vieram buscar. É por aí que começo.",
        stepOneTitle: "Primeiro, entender o negócio",
        stepOneText: "Quero saber para quem é o site, do que essas pessoas precisam e o que o negócio espera que elas façam.",
        stepTwoTitle: "Depois, encontrar o caminho",
        stepTwoText: "Organizo as páginas e penso no visual a partir do negócio, em vez de começar por um modelo pronto.",
        stepThreeTitle: "Desenvolver, testar, ajustar",
        stepThreeText: "Monto o site, confiro como funciona em diferentes telas e ajusto os detalhes até tudo ficar no lugar.",
        aboutIndex: "OI, EU SOU O VICTOR",
        aboutEyebrow: "Um pouco sobre mim",
        aboutTitle: "Sou o Victor.<br><em>Faço sites.</em>",
        aboutParagraphOne: "Desenho e desenvolvo sites para pequenos negócios. Você fala com uma pessoa só, da primeira conversa até o site ficar pronto: comigo.",
        aboutParagraphTwo: "Os projetos aqui são conceitos que criei para uma barbearia, um eletricista e uma hamburgueria. Não são trabalhos para clientes, mas dá para navegar por cada um como em um site de verdade.",
        aboutLink: "Tem uma ideia? Me conta",
        contactEyebrow: "Entre em contato",
        contactTitle: "Precisa de um site?<br><em>Vamos conversar.</em>",
        contactCopy: "Me conte um pouco sobre o seu negócio e do que você precisa. A gente conversa sobre o próximo passo.",
        contactEmailButton: "Me mande um e-mail",
        whatsappAria: "Enviar mensagem para Victor pelo WhatsApp",
        contactWhatsappButton: "Me chame no WhatsApp",
        footerTagline: "Design e desenvolvimento por Victor Saraiva.",
        backToTop: "Voltar ao topo ↑"
    }
};

let currentLanguage = "en";

function translatePage(language) {
    currentLanguage = language;
    const copy = translations[language];

    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.innerHTML = copy[element.dataset.i18n];
    });

    document.querySelectorAll("[data-i18n-content]").forEach(element => {
        element.content = copy[element.dataset.i18nContent];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(element => {
        const key = element.dataset.i18nAria;
        element.setAttribute("aria-label", copy[key]);
    });

    if (menuToggle) {
        const menuLabel = menuToggle.getAttribute("aria-expanded") === "true" ? "menuClose" : "menuOpen";
        menuToggle.setAttribute("aria-label", copy[menuLabel]);
    }

    document.querySelectorAll("[data-i18n-alt]").forEach(element => {
        element.alt = copy[element.dataset.i18nAlt];
    });

    languageButtons.forEach(button => {
        const isActive = button.dataset.language === language;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function closeNavigation(restoreFocus = false) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", translations[currentLanguage].menuOpen);
    navigation.classList.remove("is-open");

    if (restoreFocus) {
        menuToggle.focus();
    }
}

translatePage("en");

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", translations[currentLanguage][isOpen ? "menuOpen" : "menuClose"]);
    navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => closeNavigation());
});

languageButtons.forEach(button => {
    button.addEventListener("click", () => translatePage(button.dataset.language));
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation(true);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 680 && menuToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation();
    }
});

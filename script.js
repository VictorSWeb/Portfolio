const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const languageButtons = document.querySelectorAll(".language-option");

const translations = {
    en: {
        pageTitle: "Victor Saraiva — Web Designer &amp; Developer",
        metaDescription: "I design and build distinctive websites for small businesses. Explore website concepts by independent designer and developer Victor Saraiva.",
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
        heroTitle: "Less template.<br><em>More like your business.</em>",
        heroIntro: "The best sites feel like the business behind them. I design and build sites that make it easy to see what you do and get in touch.",
        heroPrimary: "See what I’ve been making",
        heroSecondary: "Tell me what you have in mind",
        heroFootnote: "One person, start to finish<br><strong>You work directly with me</strong>",
        heroWorkLabel: "Previews of selected website concepts",
        barberAria: "Explore the Northside Barber Co. website concept",
        barberAlt: "Northside Barber Co. website concept preview",
        categoryHospitality: "01 / HOSPITALITY",
        barberViewAria: "View Northside Barber Co. concept",
        barberPreviewAlt: "Northside Barber Co. barbershop website concept shown in a browser window",
        barberBrowserLabel: "northside / portland",
        voltlineAria: "Explore the Voltline Electrical website concept",
        voltlineAlt: "Voltline Electrical website concept preview",
        categoryHomeServices: "02 / HOME SERVICES",
        voltlineViewAria: "View Voltline Electrical concept",
        voltlinePreviewAlt: "Voltline Electrical service website concept shown in a browser window",
        voltlineBrowserLabel: "voltline / austin tx",
        smashAria: "Explore the Smash & Co. burger delivery website concept",
        smashAlt: "Smash & Co. burger restaurant website concept preview",
        categoryHospitality03: "03 / HOSPITALITY",
        heroIndex: "THREE IDEAS / 2026",
        scrollCue: "Take a closer look",
        workEyebrow: "A few things I’ve made · 2026",
        workTitle: "Projects<br><em>Take a closer look.</em>",
        workIntro: "These are fictional projects, but the design decisions are real. Each one starts with a different kind of business and asks: what would make its website feel like it?",
        openConcept: "SEE THE SITE",
        categoryHospitalityText: "HOSPITALITY",
        barberSummary: "A neighborhood barbershop made for regulars. The site keeps things familiar and puts the essentials up front.",
        direction: "THE LOOK",
        barberDirection: "Warm colors, confident type and photography that gives the shop its own character.",
        experience: "THE DETAILS",
        barberExperience: "Cuts, prices and opening hours are right where you’d expect them — on any screen.",
        brandDirection: "Brand direction",
        responsiveDesign: "Responsive design",
        frontendBuild: "Front-end build",
        exploreConcept: "Take a look around",
        homeServices: "HOME SERVICES",
        voltlineSummary: "Electrical work can be technical; finding help shouldn’t be. This concept gets visitors to the right information fast.",
        voltlineDirection: "A crisp palette and industrial details make the business feel capable without feeling cold.",
        voltlineExperience: "A simple guide points visitors toward useful next steps when something needs attention.",
        artDirection: "Art direction",
        interactiveUi: "Interactive UI",
        hospitalityEcommerce: "HOSPITALITY / E-COMMERCE",
        smashViewAria: "View the Smash & Co. burger delivery website concept",
        smashPreviewAlt: "Smash & Co. burger restaurant website concept preview",
        smashBrowserLabel: "smash &amp; co. / order online",
        smashSummary: "From the first look at the menu to the delivery tracker, this concept takes a burger order all the way through.",
        smashDirection: "Big food photography, punchy type and the laid-back confidence of a neighborhood burger spot.",
        smashExperience: "Pick a burger, make it yours, check out and follow a sample order — all in the demo.",
        ecommerceFlow: "E-commerce flow",
        noteLabel: "NOTE",
        conceptNote: "These three sites are portfolio concepts, not client projects. Business details and contact information inside the demos are made up for the designs.",
        approachEyebrow: "How I work",
        approachTitle: "A good website does more than <em>look the part.</em>",
        approachIntro: "It should help people get what you do, find what they need and know what to do next. Here’s how I get there.",
        stepOneTitle: "First, I ask questions",
        stepOneText: "What makes the business tick? Who are its customers? What should the site help them do?",
        stepTwoTitle: "Then, I make a plan",
        stepTwoText: "I map out the pages and find a visual direction that fits the business — not a template.",
        stepThreeTitle: "Make it real",
        stepThreeText: "I design, build and test the site on different screens, then fine-tune the details.",
        aboutIndex: "HI, I’M VICTOR",
        aboutEyebrow: "The person behind the sites",
        aboutTitle: "One person.<br><em>The whole project.</em>",
        aboutParagraphOne: "I’m Victor. I design and build websites for small businesses, so I handle both how a site looks and how it works. You deal directly with me from the first conversation to the finished site.",
        aboutParagraphTwo: "Here, I get to try out ideas for a barbershop, an electrician and a burger place. Each one is a complete concept you can click through.",
        aboutLink: "Got an idea? Tell me about it",
        contactEyebrow: "Have something in mind?",
        contactTitle: "Tell me what<br><em>you’re working on.</em>",
        contactCopy: "A rough idea is a fine place to start. Tell me a little about it and we’ll take it from there.",
        contactEmailButton: "Email me",
        whatsappAria: "Message Victor on WhatsApp",
        contactWhatsappButton: "Message me on WhatsApp",
        footerTagline: "Designed and built by Victor Saraiva.",
        backToTop: "Back to top ↑"
    },
    pt: {
        pageTitle: "Victor Saraiva — Designer e Desenvolvedor Web",
        metaDescription: "Crio sites marcantes para pequenos negócios. Conheça os projetos conceituais de Victor Saraiva, designer e desenvolvedor web independente.",
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
        heroTitle: "Menos cara de template.<br><em>Mais a cara do negócio.</em>",
        heroIntro: "Os melhores sites têm a cara do negócio. Eu desenho e desenvolvo sites que deixam claro o que você faz e como entrar em contato.",
        heroPrimary: "Veja o que eu ando criando",
        heroSecondary: "Me conte sua ideia",
        heroFootnote: "Uma pessoa, do começo ao fim<br><strong>Você fala direto comigo</strong>",
        heroWorkLabel: "Prévia de projetos conceituais de sites",
        barberAria: "Conheça o projeto de site da Northside Barber Co.",
        barberAlt: "Prévia do projeto de site da Northside Barber Co.",
        categoryHospitality: "01 / HOSPITALIDADE",
        barberViewAria: "Ver o projeto da Northside Barber Co.",
        barberPreviewAlt: "Projeto de site da barbearia Northside Barber Co. exibido em uma janela de navegador",
        barberBrowserLabel: "northside / portland",
        voltlineAria: "Conheça o projeto de site da Voltline Electrical",
        voltlineAlt: "Prévia do projeto de site da Voltline Electrical",
        categoryHomeServices: "02 / SERVIÇOS RESIDENCIAIS",
        voltlineViewAria: "Ver o projeto da Voltline Electrical",
        voltlinePreviewAlt: "Projeto de site de serviços elétricos da Voltline Electrical exibido em uma janela de navegador",
        voltlineBrowserLabel: "voltline / austin tx",
        smashAria: "Conheça o projeto de delivery de hambúrgueres da Smash & Co.",
        smashAlt: "Prévia do projeto de site da hamburgueria Smash &amp; Co.",
        categoryHospitality03: "03 / HOSPITALIDADE",
        heroIndex: "TRÊS IDEIAS / 2026",
        scrollCue: "Veja mais de perto",
        workEyebrow: "Algumas coisas que criei · 2026",
        workTitle: "Projetos<br><em>Veja mais de perto.</em>",
        workIntro: "Os negócios são fictícios, mas as decisões de design são reais. Cada projeto parte de um tipo de negócio e pergunta: como seria um site com a cara dele?",
        openConcept: "VER SITE",
        categoryHospitalityText: "HOSPITALIDADE",
        barberSummary: "Uma barbearia de bairro feita para quem já é de casa. O site mantém esse clima e deixa o essencial à mão.",
        direction: "VISUAL",
        barberDirection: "Cores quentes, tipografia confiante e fotos que dão personalidade à barbearia.",
        experience: "NA PRÁTICA",
        barberExperience: "Cortes, preços e horário de funcionamento: tudo fácil de achar, em qualquer tela.",
        brandDirection: "Direção de marca",
        responsiveDesign: "Design responsivo",
        frontendBuild: "Desenvolvimento front-end",
        exploreConcept: "Conheça o site",
        homeServices: "SERVIÇOS RESIDENCIAIS",
        voltlineSummary: "Serviço elétrico pode ser complicado. Encontrar ajuda não precisa ser. Este conceito leva cada pessoa direto à informação de que precisa.",
        voltlineDirection: "Cores fortes e referências industriais passam confiança sem deixar o site frio ou distante.",
        voltlineExperience: "Um guia simples ajuda a entender por onde começar quando algo precisa de atenção.",
        artDirection: "Direção de arte",
        interactiveUi: "Interface interativa",
        hospitalityEcommerce: "HOSPITALIDADE / E-COMMERCE",
        smashViewAria: "Ver o projeto de delivery de hambúrgueres da Smash & Co.",
        smashPreviewAlt: "Prévia do projeto de site da hamburgueria Smash & Co.",
        smashBrowserLabel: "smash &amp; co. / peça online",
        smashSummary: "Do primeiro olhar no cardápio ao acompanhamento da entrega: este conceito leva o pedido de hambúrguer do começo ao fim.",
        smashDirection: "Fotos de dar fome, tipografia marcante e o jeito descontraído de uma hamburgueria de bairro.",
        smashExperience: "Escolha o hambúrguer, monte do seu jeito, feche o pedido e acompanhe uma entrega de demonstração.",
        ecommerceFlow: "Fluxo de e-commerce",
        noteLabel: "NOTA",
        conceptNote: "Estes três sites são projetos conceituais, não trabalhos para clientes. Os dados comerciais e de contato nas demonstrações foram criados só para os projetos.",
        approachEyebrow: "Como eu trabalho",
        approachTitle: "Um bom site faz mais do que <em>ficar bonito.</em>",
        approachIntro: "Ele precisa deixar claro o que você faz, ajudar as pessoas a encontrar o que procuram e mostrar qual é o próximo passo. É assim que eu chego lá.",
        stepOneTitle: "Primeiro, boas perguntas",
        stepOneText: "O que faz o negócio ser especial? Quem são os clientes? O que o site precisa ajudar essas pessoas a fazer?",
        stepTwoTitle: "Depois, um plano",
        stepTwoText: "Organizo as páginas e encontro um caminho visual que combine com o negócio — não com um modelo pronto.",
        stepThreeTitle: "Hora de tirar do papel",
        stepThreeText: "Desenho, desenvolvo e testo o site em diferentes telas. Aí ajusto o que precisar.",
        aboutIndex: "OI, EU SOU O VICTOR",
        aboutEyebrow: "Quem faz os sites",
        aboutTitle: "Uma pessoa.<br><em>O projeto inteiro.</em>",
        aboutParagraphOne: "Sou Victor. Desenho e desenvolvo sites para pequenos negócios, cuidando tanto da aparência quanto do funcionamento. Você fala direto comigo, da primeira conversa até o site ficar pronto.",
        aboutParagraphTwo: "Aqui, experimento ideias para uma barbearia, um eletricista e uma hamburgueria. Cada projeto é um conceito completo, que dá para navegar de verdade.",
        aboutLink: "Tem uma ideia? Me conta",
        contactEyebrow: "Já tem algo em mente?",
        contactTitle: "Me conta o que<br><em>você quer tirar do papel.</em>",
        contactCopy: "Pode ser só uma ideia por enquanto. Me conte um pouco e a gente pensa nos próximos passos.",
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

// ═══ Capa de datos · window.RPT ═══
// Fuente única de verdad: el manuscrito "Análisis bibliométrico de revistas en
// Bibliotecología y Ciencias de la Información indexadas en OpenAlex y SJR" (2026).
// Nada aquí se inventa: cada cifra traza a una tabla/figura del paper (ver sources.js).
window.RPT = (() => {

  const corpus = {
    total: 338,
    curacion: "Auditoría manual de los sitios oficiales de las 338 revistas (Aims & Scope), filtrando adscripciones débiles o puramente instrumentales.",
    nucleo: 20,
    nucleo_nota: "Top 20 por citación: reduce la densidad de red y representa el flujo principal de conocimiento (principio de ventaja acumulativa).",
  };

  // Figura 2 · distribución geográfica del corpus (n = 338)
  const regions = [
    { name: "Europa",   n: 176, pct: 52.07, oa: 58, oa_known: true  },
    { name: "América",  n: 126, pct: 37.28, oa: 58, oa_known: true  },
    { name: "Asia",     n: 28,  pct: 8.28,  oa: 21, oa_known: true  },
    { name: "Otros",    n: 6,   pct: 1.78,  oa: null, oa_known: false },
    { name: "África",   n: 1,   pct: 0.30,  oa: null, oa_known: false },
    { name: "Oceanía",  n: 1,   pct: 0.30,  oa: null, oa_known: false },
  ];

  // Figura 2 · modelos de acceso del corpus completo
  const access = [
    { key: "oa",     name: "Acceso abierto >50%", n: 142, pct: 42.10 },
    { key: "apc",    name: "APC <20%",            n: 165, pct: 48.82 },
    { key: "hybrid", name: "Híbrido OA–APC (20–50%)", n: 31, pct: 9.17 },
  ];

  // Tabla 2 · las 20 revistas más citadas (OpenAlex)
  const cited_top20 = [
    { r: 1,  j: "IEEE Transactions on Information Theory",        c: "Estados Unidos", reg: "América", cites: 1367000 },
    { r: 2,  j: "Scientometrics",                                 c: "Hungría",        reg: "Europa",  cites: 309400 },
    { r: 3,  j: "International Journal of Information Management",c: "Reino Unido",    reg: "Europa",  cites: 282000 },
    { r: 4,  j: "Information Systems Research",                   c: "Estados Unidos", reg: "América", cites: 279300 },
    { r: 5,  j: "Scientific Data",                                c: "Reino Unido",    reg: "Europa",  cites: 276800 },
    { r: 6,  j: "Information Processing and Management",          c: "Reino Unido",    reg: "Europa",  cites: 223400 },
    { r: 7,  j: "Journal of Information Systems Management",      c: "Reino Unido",    reg: "Europa",  cites: 223000 },
    { r: 8,  j: "Information Communication and Society",          c: "Reino Unido",    reg: "Europa",  cites: 145400 },
    { r: 9,  j: "Education and Information Technologies",         c: "Estados Unidos", reg: "América", cites: 144800 },
    { r: 10, j: "Government Information Quarterly",               c: "Reino Unido",    reg: "Europa",  cites: 134400 },
    { r: 11, j: "Notes and Queries",                              c: "Reino Unido",    reg: "Europa",  cites: 126200 },
    { r: 12, j: "Lecture Notes in Control and Information Sciences", c: "Alemania",    reg: "Europa",  cites: 125400 },
    { r: 13, j: "European Journal of Information Systems",        c: "Reino Unido",    reg: "Europa",  cites: 122600 },
    { r: 14, j: "Journal of Academic Librarianship",              c: "Reino Unido",    reg: "Europa",  cites: 94040 },
    { r: 15, j: "Telecommunications Policy",                      c: "Reino Unido",    reg: "Europa",  cites: 92430 },
    { r: 16, j: "Journal of Documentation",                       c: "Reino Unido",    reg: "Europa",  cites: 91800 },
    { r: 17, j: "Personal and Ubiquitous Computing",              c: "Reino Unido",    reg: "Europa",  cites: 85880 },
    { r: 18, j: "Journal of Informetrics",                        c: "Países Bajos",   reg: "Europa",  cites: 79630 },
    { r: 19, j: "Journal of Information Science",                 c: "Reino Unido",    reg: "Europa",  cites: 73120 },
    { r: 20, j: "Notes",                                          c: "Estados Unidos", reg: "América", cites: 72080 },
  ];
  // Ranking por país (Tabla 2, nota del paper): UK 13 (65%), EE.UU. 4 (20%), Alemania 1, Hungría 1, Países Bajos 1.

  // Revistas periféricas / iberoamericanas citadas en el texto (escalas menores)
  const periphery = [
    { j: "Revista Española de Documentación Científica", c: "España",      cites: 7180 },
    { j: "Perspectivas em Ciência da Informação",        c: "Brasil",      cites: 5362 },
    { j: "Palabra Clave",                                c: "Colombia",    cites: 3230 },
    { j: "Encontros Bibli",                              c: "Brasil",      cites: 3049 },
    { j: "African Journal of Library Archives and Information Science", c: "Nigeria", cites: 2617 },
    { j: "e-Ciencias de la Información",                 c: "Costa Rica",  cites: 922 },
  ];

  // Tabla 3 · las 20 revistas más productivas (documentos acumulados, OpenAlex)
  // access: "APC" (🔘) o "OA" (🟢) según la nota de la tabla. 17 APC · 3 OA.
  const productive_top20 = [
    { r: 1,  j: "Notes and Queries",                          pub: "Oxford Univ. Press",        docs: 341800, access: "APC" },
    { r: 2,  j: "IEEE Transactions on Information Theory",    pub: "IEEE",                      docs: 20160,  access: "APC" },
    { r: 3,  j: "Notes",                                      pub: "Music Library Assoc.",      docs: 16410,  access: "APC" },
    { r: 4,  j: "Information Technology Newsletter",          pub: "IEEE",                      docs: 10900,  access: "APC" },
    { r: 5,  j: "Library",                                    pub: "Oxford Univ. Press",        docs: 9631,   access: "APC" },
    { r: 6,  j: "Lecture Notes in Control and Information Sciences", pub: "Springer Nature",    docs: 9583,   access: "APC" },
    { r: 7,  j: "Library Quarterly",                          pub: "Univ. of Chicago Press",    docs: 9571,   access: "APC" },
    { r: 8,  j: "College and Research Libraries",             pub: "ACRL",                      docs: 9027,   access: "OA"  },
    { r: 9,  j: "College and Research Libraries News",        pub: "ACRL",                      docs: 9027,   access: "OA"  },
    { r: 10, j: "Scientometrics",                             pub: "Springer Nature",           docs: 8295,   access: "APC" },
    { r: 11, j: "Acervo",                                     pub: "Arquivo Nacional",          docs: 8168,   access: "OA"  },
    { r: 12, j: "Scientific Data",                            pub: "Springer Nature",           docs: 7851,   access: "APC" },
    { r: 13, j: "Journal of Library and Information Science in Agriculture", pub: "Chinese Academy", docs: 6680, access: "APC" },
    { r: 14, j: "Information Processing and Management",      pub: "Elsevier",                  docs: 6394,   access: "APC" },
    { r: 15, j: "Serials Review",                             pub: "Taylor & Francis",          docs: 5641,   access: "APC" },
    { r: 16, j: "Papers of the Bibliographical Society of America", pub: "Bibliographical Soc.", docs: 5553,  access: "APC" },
    { r: 17, j: "Journal of Academic Librarianship",          pub: "Elsevier",                  docs: 5313,   access: "APC" },
    { r: 18, j: "World Patent Information",                   pub: "Elsevier",                  docs: 5299,   access: "APC" },
    { r: 19, j: "Education and Information Technologies",     pub: "Springer Nature",           docs: 5223,   access: "APC" },
    { r: 20, j: "Telecommunications Policy",                  pub: "Elsevier",                  docs: 4082,   access: "APC" },
  ];

  // Intersección Tabla 2 ∩ Tabla 3: revistas con citación y productividad (10 títulos)
  const output_vs_impact = [
    { j: "Notes and Queries",                 docs: 341800, cites: 126200, q: "Q4" },
    { j: "IEEE Trans. on Information Theory", docs: 20160,  cites: 1367000, q: "Q1" },
    { j: "Notes",                             docs: 16410,  cites: 72080,  q: null },
    { j: "Lecture Notes in Control and Inf. Sciences", docs: 9583, cites: 125400, q: null },
    { j: "Scientometrics",                    docs: 8295,   cites: 309400, q: "Q1" },
    { j: "Scientific Data",                   docs: 7851,   cites: 276800, q: "Q1" },
    { j: "Information Processing & Management", docs: 6394, cites: 223400, q: "Q1" },
    { j: "Journal of Academic Librarianship", docs: 5313,   cites: 94040,  q: "Q1" },
    { j: "Education and Information Technologies", docs: 5223, cites: 144800, q: "Q1" },
    { j: "Telecommunications Policy",         docs: 4082,   cites: 92430,  q: "Q1 (desde 2021)" },
  ];

  // Tabla 4 · evolución de cuartiles SJR 2015–2025 (solo lo que el paper afirma)
  const years = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
  const quartiles = [
    { j: "13 revistas del núcleo (agregado)", traj: ["Q1","Q1","Q1","Q1","Q1","Q1","Q1","Q1","Q1","Q1","Q1"],
      note: "Estabilidad en Q1 durante todo el período: el núcleo duro de alta visibilidad de la disciplina." },
    { j: "Journal of Information Science", traj: ["Q2","Q2","Q1","Q1","Q1","Q1","Q1","Q1","Q1","Q1","Q1"],
      note: "Transición positiva Q2 (2015–2016) → Q1 (2017–2025)." },
    { j: "Telecommunications Policy", traj: [null,null,null,null,null,null,"Q1","Q1","Q1","Q1","Q1"],
      note: "Se integra al primer cuartil hasta 2021. Cuartiles 2015–2020 no reportados en el paper." },
    { j: "Personal and Ubiquitous Computing", traj: [null,null,null,null,null,null,"Q1","Q1","Q1","Q1","Q1"],
      note: "Se integra al primer cuartil hasta 2021. Cuartiles 2015–2020 no reportados en el paper." },
    { j: "Notes and Queries", traj: ["Q4","Q4","Q4","Q4","Q4","Q4","Q4","Q4","Q4","Q4","Q4"],
      note: "La revista más productiva del corpus (341,800 docs) permanece en Q4 toda la década: output ≠ impacto." },
  ];

  // Figura 4 · co-ocurrencia temática (topics OpenAlex, umbral ≥2 co-ocurrencias, relevancia ≥0.5)
  // domain: dominio OpenAlex según la leyenda del paper
  const topics = [
    { name: "Technology Adoption and User Behaviour", freq: 111, rel: 99.2, journals: 12, domain: "Information Science" },
    { name: "Scientometrics and Bibliometrics Research", freq: 96, rel: 98.7, journals: 5, domain: "Information Science" },
    { name: "Digital Marketing and Social Media", freq: 64, rel: 98.8, journals: 12, domain: "Other" },
    { name: "Social Media and Politics", freq: 58, rel: 97.5, journals: 7, domain: "Other" },
    { name: "Knowledge Management and Sharing", freq: 53, rel: 98.9, journals: 11, domain: "Management" },
    { name: "Customer Service Quality and Loyalty", freq: 36, rel: 99.4, journals: 6, domain: "Management" },
    { name: "E-Government and Public Services", freq: null, rel: null, journals: null, domain: "Other" },
    { name: "Innovative Human-Technology Interaction", freq: 21, rel: 99.2, journals: 5, domain: "Computer Science" },
    { name: "Online Learning and Analytics", freq: 18, rel: 98.0, journals: 2, domain: "Computer Science" },
    { name: "Library Science and Information Literacy", freq: 17, rel: 99.3, journals: 3, domain: "Library Science" },
    { name: "Library Science and Administration", freq: 9, rel: 98.3, journals: 2, domain: "Library Science" },
  ];
  const topic_domains = [
    { d: "Other", n: 31 }, { d: "Computer Science", n: 18 }, { d: "Information Science", n: 15 },
    { d: "Management", n: 10 }, { d: "Data Science", n: 3 }, { d: "Library Science", n: 2 },
    { d: "Knowledge Management", n: 1 },
  ];

  // Las cinco corrientes disciplinares del ranking (texto de Resultados)
  const currents = [
    { name: "Bibliometría y Ciencia de la Ciencia", reg: "Europa continental",
      js: ["Scientometrics", "IEEE Trans. on Information Theory"],
      gist: "El núcleo más autorreferencial: medir la ciencia con las mismas herramientas que se estudian." },
    { name: "Gestión de Información Empresarial y Sistemas de Información", reg: "Reino Unido / EE.UU.",
      js: ["Int. J. of Information Management", "Information Systems Research", "J. of Information Systems Management", "Information Processing and Management"],
      gist: "Gestión del conocimiento, transformación digital y big data organizacional; liderada por Elsevier, Taylor & Francis y Wiley." },
    { name: "Tecnología, Sociedad e Impacto Digital", reg: "Reino Unido / EE.UU.",
      js: ["Scientific Data", "Information Communication and Society", "Education and Information Technologies", "Government Information Quarterly", "Telecommunications Policy"],
      gist: "AI/ML, datos abiertos, e-government y tecnología educativa desplazan la agenda clásica." },
    { name: "Bibliotecología e Informática Documental Clásica", reg: "Reino Unido",
      js: ["Journal of Documentation", "Journal of Academic Librarianship", "Journal of Information Science", "Interacting with Computers"],
      gist: "La identidad disciplinar reconocible: organización del conocimiento, servicios, recuperación de información." },
    { name: "Informática Aplicada e Ingeniería de la Información", reg: "Europa",
      js: ["Lecture Notes in Control and Information Sciences", "European Journal of Information Systems", "Personal and Ubiquitous Computing", "Notes and Queries"],
      gist: "Adscripción débil al núcleo LIS: ilustra el ensanchamiento de fronteras de OpenAlex/SJR." },
  ];

  // Balanza final · discusión (ponderación cualitativa, no un puntaje)
  const verdict = {
    apc: [
      "165 revistas (48.8%) operan con APC <20%",
      "17 de las 20 más productivas cobran APC (85%)",
      "Oligopolio editorial: Elsevier, Springer Nature, T&F, SAGE, Emerald",
      "Políticas de prestigio consolidan el núcleo (Cronin & Sugimoto, 2014)",
    ],
    oa: [
      "142 revistas (42.1%) operan >50% en acceso abierto",
      "Paridad OA América–Europa: 58 contra 58 títulos",
      "Asia: 21 de 28 revistas en acceso abierto",
      "OpenAlex habilita métrica abierta y replicable (Macêdo et al., 2025)",
    ],
    triggers: [
      "Migración masiva del núcleo Q1 a OA pleno",
      "Datos de costos reales de APC por editorial",
      "Mayor integración del sur global en redes de coautoría",
    ],
    falsificacion: [
      "Si el share APC del corpus cae bajo 30% en el próximo ciclo",
      "Si una revista iberoamericana entra al Top 20 de citación",
      "Si los topics de Library Science vuelven al núcleo de co-ocurrencia",
    ],
    fallo: "Coexistencia equilibrada con núcleo APC: el campo se reconfigura, pero el acceso abierto genuino aún no lidera el centro productivo.",
  };

  return { corpus, regions, access, cited_top20, periphery, productive_top20,
           output_vs_impact, years, quartiles, topics, topic_domains, currents, verdict };
})();

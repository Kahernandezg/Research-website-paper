// ═══ Registro de fuentes · anclas K1–K20 + referencias del paper ═══
// Cuatro clases de fuente (todas fechadas): OpenAlex · SCImago/Scopus ·
// Análisis del estudio (tablas/figuras del manuscrito) · Literatura citada.
(() => {
  const K = [
    { id: "K1", cat: "industry", catlab: "OpenAlex",
      fact: "338 revistas de Bibliotecología y Ciencias de la Información identificadas en OpenAlex; núcleo de 20 para co-citación, impacto y productividad.",
      cite: "Estudio · Figura 1, Red SNA (ObservableHQ) · datos OpenAlex, compilado 2026" },
    { id: "K2", cat: "kimi", catlab: "Análisis del estudio",
      fact: "Curación manual de los 338 sitios oficiales (Aims & Scope) para filtrar adscripciones débiles o instrumentales al núcleo LIS.",
      cite: "Estudio · Metodología, curación y validación · 2026" },
    { id: "K3", cat: "industry", catlab: "OpenAlex",
      fact: "Distribución geográfica del corpus: Europa 176 (52.07%), América 126 (37.28%), Asia 28 (8.28%), otros 6 (1.78%), África 1 (0.30%), Oceanía 1 (0.30%).",
      cite: "Estudio · Figura 2, nota de fuente · datos OpenAlex, compilado 2026" },
    { id: "K4", cat: "industry", catlab: "OpenAlex",
      fact: "Modelos de acceso del corpus: 142 revistas (42.1%) >50% OA; 165 (48.82%) con APC <20%; 31 híbridas (20–50%).",
      cite: "Estudio · Figura 2 y Resultados · datos OpenAlex, compilado 2026" },
    { id: "K5", cat: "industry", catlab: "OpenAlex",
      fact: "OA >50% por región: América 58 y Europa 58 (paridad); Asia 21 de 28 revistas en acceso abierto.",
      cite: "Estudio · Resultados, análisis continental · datos OpenAlex, compilado 2026" },
    { id: "K6", cat: "industry", catlab: "OpenAlex",
      fact: "Ranking de citación Top 20: IEEE Transactions on Information Theory 1,367,000 citas; Scientometrics 309,400; … Notes 72,080.",
      cite: "Estudio · Tabla 2 · datos OpenAlex, compilado 2026" },
    { id: "K7", cat: "kimi", catlab: "Análisis del estudio",
      fact: "Concentración anglosajona del Top 20: Reino Unido 13 revistas (65%), EE.UU. 4 (20%), Alemania 1, Hungría 1, Países Bajos 1.",
      cite: "Estudio · Tabla 2 y Resultados · 2026" },
    { id: "K8", cat: "industry", catlab: "OpenAlex",
      fact: "Periferia iberoamericana y africana: REDEC 7,180; Perspectivas em Ciência da Informação 5,362; Palabra Clave 3,230; Encontros Bibli 3,049; AJLAIS 2,617; e-Ciencias de la Información 922 citas.",
      cite: "Estudio · Resultados · datos OpenAlex, compilado 2026" },
    { id: "K9", cat: "industry", catlab: "OpenAlex",
      fact: "Ranking de productividad Top 20: Notes and Queries 341,800 documentos; IEEE Trans. 20,160; Notes 16,410; … Telecommunications Policy 4,082.",
      cite: "Estudio · Tabla 3 · datos OpenAlex, compilado 2026" },
    { id: "K10", cat: "kimi", catlab: "Análisis del estudio",
      fact: "De las 20 revistas más productivas, 17 operan con APC (85%) y solo 3 son acceso abierto pleno (15%).",
      cite: "Estudio · Tabla 3, nota 🔘/🟢 · 2026" },
    { id: "K11", cat: "company", catlab: "SCImago / Scopus",
      fact: "13 revistas estables en Q1 durante 2015–2025; Journal of Information Science Q2→Q1 (2017); Telecommunications Policy y Personal and Ubiquitous Computing entran a Q1 en 2021; Notes and Queries permanece en Q4 toda la década.",
      cite: "Estudio · Tabla 4, mapa de calor SJR (Datawrapper) · SCImago Journal & Country Rank, 2015–2025" },
    { id: "K12", cat: "industry", catlab: "OpenAlex",
      fact: "Topics dominantes: Technology Adoption and User Behaviour 111 (99.2% relevancia, 12 revistas); Scientometrics and Bibliometrics 96; Digital Marketing and Social Media 64; Social Media and Politics 58; Knowledge Management and Sharing 53.",
      cite: "Estudio · Figura 4, mapa de co-ocurrencia · OpenAlex topics, compilado 2026" },
    { id: "K13", cat: "industry", catlab: "OpenAlex",
      fact: "Dominios de tópicos en la red: Other 31, Computer Science 18, Information Science 15, Management 10, Data Science 3, Library Science 2, Knowledge Management 1.",
      cite: "Estudio · Figura 4, leyenda · OpenAlex topics, compilado 2026" },
    { id: "K14", cat: "kimi", catlab: "Análisis del estudio",
      fact: "Umbrales de red temática: co-ocurrencia mínima de 2 para generar enlace; relevancia mínima 0.5 en topics/concepts de OpenAlex.",
      cite: "Estudio · Metodología y Figura 4 · 2026" },
    { id: "K15", cat: "broker", catlab: "Literatura citada",
      fact: "Efecto Mateo / ventaja acumulativa: las revistas prestigiosas atraen más citas y refuerzan su dominio.",
      cite: "Merton (1968), Science 159(3810); Price (1976), JASIS 27 · citados en Discusión" },
    { id: "K16", cat: "broker", catlab: "Literatura citada",
      fact: "Geopolítica del conocimiento: las revistas de América Latina y África reciben proporcionalmente menos citas incluso controlando por calidad percibida.",
      cite: "Canagarajah (2002); Alperin et al. (2021), El Profesional de la Información 30(3) · citados en Discusión" },
    { id: "K17", cat: "broker", catlab: "Literatura citada",
      fact: "«Políticas de prestigio»: las editoriales comerciales invierten en visibilidad mediante indexación agresiva y acuerdos institucionales.",
      cite: "Cronin & Sugimoto (eds.) (2014), Beyond Bibliometrics, MIT Press · citado en Resultados" },
    { id: "K18", cat: "broker", catlab: "Literatura citada",
      fact: "«El JCR sufre de un importante sesgo lingüístico y geográfico», situación que persiste en Scimago/Scopus con matices.",
      cite: "Sobrido Prieto & Sobrido Prieto (2013), Enfermería Global 12(31) · citado en Resultados" },
    { id: "K19", cat: "broker", catlab: "Literatura citada",
      fact: "OpenAlex emerge como «alternativa robusta y accesible para la investigación bibliométrica, con cobertura global y datos actualizados».",
      cite: "Macêdo, Ingrid & Shintaku (2025), Biblios (esp.), e015 · citado en Introducción" },
    { id: "K20", cat: "kimi", catlab: "Análisis del estudio",
      fact: "Instrumental: API de OpenAlex, SCImago Journal Rank, ObservableHQ (redes), Datawrapper (mapa de calor), Plotly/WebGL (co-citación), Connected Papers (mapeo), Kimi.com (curación de scripts).",
      cite: "Estudio · Metodología, fuente de datos y tratamiento · 2026" },
  ];

  // Referencias bibliográficas del manuscrito (transcripción fiel)
  const REFS = [
    'Alperin, J. P., Babini, D., Fischman, G. E., & Willinsky, J. (2021). Open access and scholarly communications in Latin America. <i>El Profesional de la Información, 30</i>(3), e300312.',
    'Nolin, J., & Åström, F. (2010). Turning weakness into strength: strategies for future LIS. <i>Journal of Documentation, 66</i>(1), 7–27.',
    'Canagarajah, A. S. (2002). <i>A geopolitics of academic writing.</i> University of Pittsburgh Press.',
    'Cascón-Katchadourian, J., Moral-Munoz, J. A., Liao, H., & Cobo, M. J. (2020). Análisis bibliométrico de la Revista Española de Documentación Científica (2008-2018). <i>REDC, 43</i>(3), e267.',
    'Cronin, B., & Sugimoto, C. R. (Eds.). (2014). <i>Beyond bibliometrics: Harnessing multidimensional indicators of scholarly impact.</i> MIT Press.',
    'Escamilla González, G., Torre Villar, E. de la, & UNAM IIB. (1987). <i>Interpretación catalográfica de los libros</i> (2a reimp.). UNAM.',
    'Furner, J., & Gilliland, A. J. (2022). Knowledge organization and information science: A historical and conceptual overview. <i>JASIST, 73</i>(1), 5–20.',
    'Guerra González, J. T. (2019). Experiencias de bibliotecólogos en los procesos editoriales de revistas académicas mexicanas. <i>Biblios</i>, (75), 1–15.',
    'Julien, H., Pecoskie, J. L., & Reed, K. (2011). Trends in information behavior research, 1999–2008. <i>Library & Information Science Research, 33</i>(1), 19–24.',
    'Macêdo, D. J., Ingrid, & Shintaku, M. (2025). El uso de OpenAlex en los estudios de métricas bibliométricas. <i>Biblios</i>, (esp.), e015.',
    'Merton, R. K. (1968). The Matthew effect in science. <i>Science, 159</i>(3810), 56–63.',
    'Moreno-Pulido, A., et al. (2013). Evolución de las revistas españolas de Ciencias Sociales en el JCR (2006-2010). <i>REDC, 36</i>(3).',
    'Price, D. D. S. (1976). A general theory of bibliometric and other cumulative advantage processes. <i>JASIS, 27</i>, 292-306.',
    'Rozemblum, C., & Banzato, G. (2012). La cooperación entre editores y bibliotecarios como estrategia institucional. <i>Información, cultura y sociedad</i>, (27), 91-106.',
    'Sobrido Prieto, N., & Sobrido Prieto, M. (2013). ¿Se puede evaluar la calidad de las revistas científicas? <i>Enfermería Global, 12</i>(31), 265-272.',
    'de Jesus-Tavares, M. de L., Espinosa-Calvo, M. E., & Fernández, L. M. R. (2025). Producción científica sobre economía en Portugal (2001-2023). <i>Ibersid, 19</i>(2), 131–143.',
  ];

  window.SRC = Object.fromEntries(K.map(k => [k.id, k]));

  // Render del registro en el pie
  const list = document.getElementById("source-list");
  if (list) {
    list.innerHTML = K.map(k => `
      <div class="src-row">
        <span class="s-fact"><span class="src-cat ${k.cat}">${k.catlab}</span><b>${k.id}</b> · ${k.fact}</span>
        <span class="s-cite">${k.cite}</span>
      </div>`).join("");
  }
  const refs = document.getElementById("ref-list");
  if (refs) {
    refs.innerHTML = REFS.map(r => `<div class="src-row"><span class="s-fact" style="font-size:12.5px">${r}</span></div>`).join("");
  }
})();

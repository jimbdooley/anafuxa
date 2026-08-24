window.AnafuxaStrings = (() => {
  const supportedLanguages = ['en', 'es', 'zh'];

  const translations = {
    AppTitleText: { en: 'anafuxa', es: 'anafuxa', zh: 'anafuxa' },
    AppSubtitleText: { en: 'Analyze FUXA', es: 'Analizar FUXA', zh: '分析 FUXA' },
    HomeNavText: { en: 'Home / Summarize for AI', es: 'Inicio / Resumir para IA', zh: '首页 / 为 AI 总结' },
    FindReferencesNavText: { en: 'Find All References', es: 'Buscar todas las referencias', zh: '查找所有引用' },
    TagInsightsNavText: { en: 'Tag Insights', es: 'Análisis de Tags', zh: '标签分析' },
    ScriptInsightsNavText: { en: 'Script Insights', es: 'Análisis de Scripts', zh: '脚本分析' },
    TagEditNavText: { en: 'Tag Edit', es: 'Edición de Tags', zh: '标签编辑' },
    TopbarLoadFileText: { en: 'Load File', es: 'Cargar archivo', zh: '加载文件' },
    ValidationBodyText: {
      en: 'Client-side JSON validation and duplicate-key validation are not implemented yet.',
      es: 'La validación de JSON del lado del cliente y la validación de claves duplicadas aún no están implementadas.',
      zh: '客户端 JSON 验证和重复键验证尚未实现。'
    },
    ConvertButtonText: { en: 'Convert to TOON', es: 'Convertir a TOON', zh: '转换为 TOON' },
    DownloadButtonText: { en: 'Download TOON', es: 'Descargar TOON', zh: '下载 TOON' },
    CopyButtonText: { en: 'Copy TOON', es: 'Copiar TOON', zh: '复制 TOON' },
    ReferenceSearchLabelText: { en: 'Search string', es: 'Buscar cadena', zh: '搜索字符串' },
    ReferenceSearchHelpText: {
      en: 'The navigator starts collapsed except for top-level string values. Matching keys, values, and ancestor subtrees will be highlighted after you explicitly apply the search.',
      es: 'El navegador comienza colapsado excepto por los valores de cadena del nivel superior. Se resaltarán las claves, los valores y los subárboles ancestros que coincidan después de aplicar la búsqueda explícitamente.',
      zh: '导航器初始为折叠状态，顶层字符串值除外。只有在你明确应用搜索后，匹配的键、值及其祖先子树才会被高亮。'
    },
    ApplyReferenceSearchText: { en: 'Apply Search', es: 'Aplicar búsqueda', zh: '应用搜索' },
    ReferenceNavigatorHeadingText: { en: 'JSON Navigator', es: 'Navegador JSON', zh: 'JSON 导航器' },
    TagInsightsHeadingText: { en: 'Tag Insights', es: 'Análisis de Tags', zh: '标签分析' },
    TagInsightsBodyText: {
      en: 'Tag analysis and reporting will appear here in a future step.',
      es: 'El análisis y los informes de tags aparecerán aquí en un paso futuro.',
      zh: '标签分析和报告功能将在后续步骤中显示在这里。'
    },
    ScriptInsightsHeadingText: { en: 'Script Insights', es: 'Análisis de Scripts', zh: '脚本分析' },
    ScriptInsightsBodyText: {
      en: 'Script inspection and analysis will appear here in a future step.',
      es: 'La inspección y el análisis de scripts aparecerán aquí en un paso futuro.',
      zh: '脚本检查和分析功能将在后续步骤中显示在这里。'
    },
    TagEditHeadingText: { en: 'Tag Edit', es: 'Edición de Tags', zh: '标签编辑' },
    TagEditBodyText: {
      en: 'Tag editing tools will appear here in a future step.',
      es: 'Las herramientas de edición de tags aparecerán aquí en un paso futuro.',
      zh: '标签编辑工具将在后续步骤中显示在这里。'
    },
    ReadmePlaceholderText: {
      en: 'Optional text to prepend before the generated TOON output.',
      es: 'Texto opcional para anteponer antes de la salida TOON generada.',
      zh: '可选文本，将来会附加在生成的 TOON 输出之前。'
    },
    ToonOutputPlaceholderText: {
      en: 'TOON output will appear here in a future step.',
      es: 'La salida TOON aparecerá aquí en un paso futuro.',
      zh: 'TOON 输出将在后续步骤中显示在这里。'
    },
    ReferenceSearchPlaceholderText: {
      en: 'Enter text to find in keys or values',
      es: 'Ingrese texto para buscar en claves o valores',
      zh: '输入要在键或值中查找的文本'
    },
    NotImplementedTitleText: { en: 'Not implemented yet', es: 'Aún no implementado', zh: '尚未实现' },
  };

  const textBindings = {
    AppTitleText: 'AppTitleText',
    AppSubtitleText: 'AppSubtitleText',
    HomeNavText: 'HomeNavText',
    FindReferencesNavText: 'FindReferencesNavText',
    TagInsightsNavText: 'TagInsightsNavText',
    ScriptInsightsNavText: 'ScriptInsightsNavText',
    TagEditNavText: 'TagEditNavText',
    TopbarLoadFileText: 'TopbarLoadFileText',
    ConvertButtonText: 'ConvertButtonText',
    DownloadButtonText: 'DownloadButtonText',
    CopyButtonText: 'CopyButtonText',
    ReferenceSearchLabelText: 'ReferenceSearchLabelText',
    ApplyReferenceSearchText: 'ApplyReferenceSearchText',
    ReferenceSearchHelpText: 'ReferenceSearchHelpText',
    ReferenceNavigatorHeadingText: 'ReferenceNavigatorHeadingText',
    TagInsightsHeadingText: 'TagInsightsHeadingText',
    TagInsightsBodyText: 'TagInsightsBodyText',
    ScriptInsightsHeadingText: 'ScriptInsightsHeadingText',
    ScriptInsightsBodyText: 'ScriptInsightsBodyText',
    TagEditHeadingText: 'TagEditHeadingText',
    TagEditBodyText: 'TagEditBodyText',
  };

  const fileStatusTranslations = {
    noFileTitle: {
      en: 'No file loaded.',
      es: 'No hay ningún archivo cargado.',
      zh: '尚未加载文件。'
    },
    noFileBody: {
      en: 'Choose a project file to see basic browser-available file information.',
      es: 'Seleccione un archivo de proyecto para ver la información básica disponible desde el navegador.',
      zh: '选择项目文件后，可查看浏览器可提供的基础文件信息。'
    },
    fileSelectedTitle: {
      en: 'File selected:',
      es: 'Archivo seleccionado:',
      zh: '已选择文件：'
    },
    filenameLabel: {
      en: 'Filename',
      es: 'Nombre del archivo',
      zh: '文件名'
    },
    sizeLabel: {
      en: 'Size',
      es: 'Tamaño',
      zh: '大小'
    },
    typeLabel: {
      en: 'Type',
      es: 'Tipo',
      zh: '类型'
    },
    unknownType: {
      en: 'Unknown / not provided by browser',
      es: 'Desconocido / no proporcionado por el navegador',
      zh: '未知 / 浏览器未提供'
    }
  };

  const referenceStatusTranslations = {
    noFileTitle: {
      en: 'No JSON loaded for navigation.',
      es: 'No hay JSON cargado para navegar.',
      zh: '尚未加载用于导航的 JSON。'
    },
    noFileBody: {
      en: 'Load a JSON file on the Home tab to inspect references here.',
      es: 'Cargue un archivo JSON en la pestaña Inicio para inspeccionar referencias aquí.',
      zh: '请先在首页加载 JSON 文件，然后再在这里检查引用。'
    },
    invalidTitle: {
      en: 'The loaded file is not valid JSON.',
      es: 'El archivo cargado no es un JSON válido.',
      zh: '已加载的文件不是有效的 JSON。'
    },
    invalidBody: {
      en: 'Fix the file and reload it to use the navigator.',
      es: 'Corrija el archivo y vuelva a cargarlo para usar el navegador.',
      zh: '请修复文件并重新加载后再使用导航器。'
    },
    readyTitle: {
      en: 'JSON navigator is ready.',
      es: 'El navegador JSON está listo.',
      zh: 'JSON 导航器已就绪。'
    },
    readyBody: {
      en: 'Use the search box to highlight matches in keys, values, and containing subtrees.',
      es: 'Use el cuadro de búsqueda para resaltar coincidencias en claves, valores y subárboles contenedores.',
      zh: '使用搜索框可高亮键、值及其所在子树中的匹配项。'
    }
  };

  function isSupportedLanguage(language) {
    return supportedLanguages.includes(language);
  }

  function translate(key, language) {
    const entry = translations[key];
    if (!entry) {
      return key;
    }

    return entry[language] || entry.en || key;
  }

  return {
    supportedLanguages,
    translations,
    textBindings,
    fileStatusTranslations,
    referenceStatusTranslations,
    isSupportedLanguage,
    translate,
  };
})();

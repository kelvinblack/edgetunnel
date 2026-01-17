/**
 * 简易电子书转换工具 (Simple E-book Converter)
 * 
 * 这是一个轻量级的电子书格式转换示例，证明电子书转换程序不需要耗费大量资源。
 * This is a lightweight e-book format conversion example, demonstrating that
 * e-book conversion programs don't require extensive resources.
 * 
 * 支持的转换 (Supported conversions):
 * - TXT → JSON (元数据结构)
 * - TXT → HTML (简单网页格式)
 * - Markdown → HTML
 */

/**
 * 将纯文本转换为JSON格式的电子书结构
 * Convert plain text to JSON e-book structure
 * @param {string} textContent - 文本内容
 * @param {object} metadata - 元数据 (标题、作者等)
 * @returns {string} JSON格式的电子书数据
 */
export function txtToJson(textContent, metadata = {}) {
    const lines = textContent.split('\n').filter(line => line.trim());
    const chapters = [];
    let currentChapter = null;
    
    // 简单的章节检测 (Simple chapter detection)
    lines.forEach(line => {
        if (line.match(/^(第[一二三四五六七八九十百千\d]+章|Chapter\s+\d+)/i)) {
            if (currentChapter) {
                chapters.push(currentChapter);
            }
            currentChapter = {
                title: line.trim(),
                content: []
            };
        } else if (currentChapter) {
            currentChapter.content.push(line);
        }
    });
    
    if (currentChapter) {
        chapters.push(currentChapter);
    }
    
    const ebook = {
        metadata: {
            title: metadata.title || '未命名',
            author: metadata.author || '匿名',
            language: metadata.language || 'zh-CN',
            created: new Date().toISOString(),
            format: 'json'
        },
        chapters: chapters.length > 0 ? chapters : [{
            title: '正文',
            content: lines
        }]
    };
    
    return JSON.stringify(ebook, null, 2);
}

/**
 * 将纯文本转换为HTML格式
 * Convert plain text to HTML format
 * @param {string} textContent - 文本内容
 * @param {object} metadata - 元数据
 * @returns {string} HTML格式的电子书
 */
export function txtToHtml(textContent, metadata = {}) {
    const title = metadata.title || '未命名电子书';
    const author = metadata.author || '匿名';
    const lines = textContent.split('\n');
    
    let htmlContent = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '<br>';
        if (trimmed.match(/^(第[一二三四五六七八九十百千\d]+章|Chapter\s+\d+)/i)) {
            return `<h2>${escapeHtml(trimmed)}</h2>`;
        }
        return `<p>${escapeHtml(trimmed)}</p>`;
    }).join('\n');
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: "Microsoft YaHei", Arial, sans-serif;
            line-height: 1.8;
        }
        h1 { text-align: center; color: #333; }
        h2 { color: #666; margin-top: 2em; }
        p { text-indent: 2em; margin: 1em 0; }
        .author { text-align: center; color: #999; margin-bottom: 2em; }
    </style>
</head>
<body>
    <h1>${escapeHtml(title)}</h1>
    <p class="author">作者: ${escapeHtml(author)}</p>
    ${htmlContent}
</body>
</html>`;
}

/**
 * 将Markdown转换为HTML
 * Convert Markdown to HTML (basic implementation)
 * @param {string} markdown - Markdown内容
 * @param {object} metadata - 元数据
 * @returns {string} HTML输出
 */
export function markdownToHtml(markdown, metadata = {}) {
    const title = metadata.title || '文档';
    
    // 简单的Markdown解析 (Simple Markdown parsing)
    let html = markdown
        // 标题 Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 粗体 Bold
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        // 斜体 Italic
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // 链接 Links
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
        // 段落 Paragraphs
        .split('\n\n')
        .map(para => {
            if (para.trim().startsWith('<h') || para.trim() === '') return para;
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('\n');
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: "Microsoft YaHei", Arial, sans-serif;
            line-height: 1.6;
        }
        h1, h2, h3 { color: #333; }
        p { margin: 1em 0; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
}

/**
 * HTML转义函数，防止XSS攻击
 * HTML escape function to prevent XSS
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 通用转换函数 (Universal conversion function)
 * @param {string} content - 输入内容
 * @param {string} fromFormat - 源格式 (txt, md)
 * @param {string} toFormat - 目标格式 (json, html)
 * @param {object} metadata - 元数据
 * @returns {string} 转换后的内容
 */
export function convertEbook(content, fromFormat, toFormat, metadata = {}) {
    if (!content || typeof content !== 'string') {
        throw new Error('内容不能为空 (Content cannot be empty)');
    }
    
    const converters = {
        'txt-json': txtToJson,
        'txt-html': txtToHtml,
        'md-html': markdownToHtml,
        'markdown-html': markdownToHtml
    };
    
    const key = `${fromFormat.toLowerCase()}-${toFormat.toLowerCase()}`;
    const converter = converters[key];
    
    if (!converter) {
        throw new Error(`不支持的转换: ${fromFormat} → ${toFormat} (Unsupported conversion)`);
    }
    
    return converter(content, metadata);
}

// 默认导出 (Default export)
export default {
    txtToJson,
    txtToHtml,
    markdownToHtml,
    convertEbook,
    escapeHtml
};

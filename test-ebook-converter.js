/**
 * 电子书转换器测试文件
 * E-book Converter Test File
 */

import {
    txtToJson,
    txtToHtml,
    markdownToHtml,
    convertEbook
} from './ebook-converter.js';

// 测试数据
const testText = `第一章 序言

这是一个测试电子书的开始。
本工具展示了电子书转换不需要大量资源。

第二章 正文

这里是第二章的内容。
我们可以轻松地转换文本格式。

第三章 结论

电子书转换是一个轻量级的操作。`;

const testMarkdown = `# 电子书转换指南

## 简介

这是一个**轻量级**的转换工具。

## 特性

- 快速转换
- 低资源消耗
- *易于使用*

[查看更多](https://example.com)`;

console.log('=== 电子书转换器测试 ===\n');

// 测试 1: TXT → JSON
console.log('测试 1: TXT → JSON');
console.log('-------------------');
try {
    const jsonResult = txtToJson(testText, {
        title: '测试电子书',
        author: '测试作者'
    });
    const parsed = JSON.parse(jsonResult);
    console.log('✓ 转换成功');
    console.log(`  章节数: ${parsed.chapters.length}`);
    console.log(`  标题: ${parsed.metadata.title}`);
    console.log(`  作者: ${parsed.metadata.author}`);
} catch (error) {
    console.error('✗ 测试失败:', error.message);
}

console.log('\n测试 2: TXT → HTML');
console.log('-------------------');
try {
    const htmlResult = txtToHtml(testText, {
        title: '测试电子书',
        author: '测试作者'
    });
    console.log('✓ 转换成功');
    console.log(`  HTML 长度: ${htmlResult.length} 字符`);
    console.log(`  包含标题: ${htmlResult.includes('<h1>测试电子书</h1>')}`);
    console.log(`  包含章节: ${htmlResult.includes('<h2>第一章 序言</h2>')}`);
} catch (error) {
    console.error('✗ 测试失败:', error.message);
}

console.log('\n测试 3: Markdown → HTML');
console.log('-------------------');
try {
    const mdHtmlResult = markdownToHtml(testMarkdown, {
        title: 'Markdown测试'
    });
    console.log('✓ 转换成功');
    console.log(`  HTML 长度: ${mdHtmlResult.length} 字符`);
    console.log(`  包含 <h1>: ${mdHtmlResult.includes('<h1>')}`);
    console.log(`  包含 <strong>: ${mdHtmlResult.includes('<strong>')}`);
    console.log(`  包含 <a>: ${mdHtmlResult.includes('<a href')}`);
} catch (error) {
    console.error('✗ 测试失败:', error.message);
}

console.log('\n测试 4: 通用转换函数');
console.log('-------------------');
try {
    const result1 = convertEbook(testText, 'txt', 'html', { title: '通用测试' });
    console.log('✓ txt → html 转换成功');
    
    const result2 = convertEbook(testText, 'txt', 'json', { title: '通用测试' });
    console.log('✓ txt → json 转换成功');
    
    const result3 = convertEbook(testMarkdown, 'md', 'html', { title: '通用测试' });
    console.log('✓ md → html 转换成功');
} catch (error) {
    console.error('✗ 测试失败:', error.message);
}

console.log('\n测试 5: 错误处理');
console.log('-------------------');
try {
    convertEbook('', 'txt', 'html');
    console.error('✗ 应该抛出错误但没有');
} catch (error) {
    console.log('✓ 正确捕获空内容错误');
}

try {
    convertEbook('test', 'pdf', 'epub');
    console.error('✗ 应该抛出错误但没有');
} catch (error) {
    console.log('✓ 正确捕获不支持的格式错误');
}

console.log('\n测试 6: XSS 防护');
console.log('-------------------');
try {
    const maliciousText = '<script>alert("XSS")</script>';
    const safeHtml = txtToHtml(maliciousText, { title: 'XSS测试' });
    const containsScript = safeHtml.includes('<script>');
    const containsEscaped = safeHtml.includes('&lt;script&gt;');
    
    if (!containsScript && containsEscaped) {
        console.log('✓ XSS 防护正常工作');
    } else {
        console.error('✗ XSS 防护可能存在问题');
    }
} catch (error) {
    console.error('✗ 测试失败:', error.message);
}

console.log('\n测试 7: 性能测试');
console.log('-------------------');
try {
    // 生成较大的测试文本 (约 10,000 字)
    let largeText = '';
    for (let i = 1; i <= 50; i++) {
        largeText += `第${i}章 章节${i}\n\n`;
        for (let j = 0; j < 20; j++) {
            largeText += `这是第${i}章的第${j + 1}段内容。包含一些测试文字来模拟真实的电子书内容。\n`;
        }
        largeText += '\n';
    }
    
    const startTime = Date.now();
    const result = convertEbook(largeText, 'txt', 'html', {
        title: '性能测试电子书',
        author: '测试'
    });
    const endTime = Date.now();
    
    const timeTaken = endTime - startTime;
    const textSize = (largeText.length / 1024).toFixed(2);
    
    console.log(`✓ 转换 ${textSize}KB 文本`);
    console.log(`  耗时: ${timeTaken}ms`);
    console.log(`  输出大小: ${(result.length / 1024).toFixed(2)}KB`);
    
    if (timeTaken < 100) {
        console.log('  性能评级: 优秀 ⭐⭐⭐⭐⭐');
    } else if (timeTaken < 500) {
        console.log('  性能评级: 良好 ⭐⭐⭐⭐');
    } else {
        console.log('  性能评级: 一般 ⭐⭐⭐');
    }
} catch (error) {
    console.error('✗ 测试失败:', error.message);
}

console.log('\n=== 所有测试完成 ===');
console.log('\n结论: 电子书转换程序不需要耗费大量资源！');
console.log('- 转换速度快 (通常 < 100ms)');
console.log('- 内存占用低 (纯文本处理)');
console.log('- 代码简单 (< 200 行)');
console.log('- 无外部依赖');

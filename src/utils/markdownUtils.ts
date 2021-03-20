
import * as MarkdownIt from 'markdown-it';
import MarkdownItKatex from 'markdown-it-katex';
import * as hljs from 'highlight.js';

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {  // TODO: highlight currently not work
    const langModule = hljs.getLanguage(lang);
    if (lang && langModule) {
      try {
        const res = hljs.highlight(lang, str);
        console.log(`Render language ${lang} to markdown: ${res.value}`);
        return res.value;
      } catch (err) {
        console.log(err);
      }
    }
    return ''; // use external default escaping
  }
}).use(MarkdownItKatex);

markdownIt.renderer.rules.table_open = () => {
  return '<table class="table">';
};

export function initHighlight() {
  hljs.initHighlightingOnLoad();
}

export function parseMarkdown(mdString: string): string {
  return markdownIt.render(mdString);
}
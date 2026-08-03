export const toPersianDigits = (value) => String(value ?? '').replace(/[0-9]/g, (digit) => String.fromCharCode(0x06f0 + Number(digit)));

const SKIP_TEXT_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE']);

const shouldSkipNode = (node) => {
  const parent = node.parentElement;
  if (!parent) return true;
  return SKIP_TEXT_TAGS.has(parent.tagName) || parent.closest('[data-skip-persian-digits]');
};

const convertTextNode = (node) => {
  if (shouldSkipNode(node)) return;

  const nextValue = toPersianDigits(node.nodeValue);
  if (nextValue !== node.nodeValue) {
    node.nodeValue = nextValue;
  }
};

const convertTree = (root) => {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  textNodes.forEach(convertTextNode);
};

export const applyPersianDigitsToDocument = () => {
  if (typeof document === 'undefined' || !document.body) {
    return () => {};
  }

  convertTree(document.body);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') {
        convertTextNode(mutation.target);
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          convertTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          convertTree(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  return () => observer.disconnect();
};
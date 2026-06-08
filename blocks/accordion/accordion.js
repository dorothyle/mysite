/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

const DURATION = 250; // keep in sync with CSS transition duration

function animateBody(body, fromStyles, toStyles, onComplete) {
  Object.assign(body.style, fromStyles);
  // force the browser to apply fromStyles before starting the transition
  // eslint-disable-next-line no-unused-expressions
  body.offsetHeight;
  Object.assign(body.style, toStyles);

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    body.removeEventListener('transitionend', onEnd);
    if (onComplete) onComplete();
  };
  body.addEventListener('transitionend', onEnd);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (details.open) {
        // closing: slide from current height down to 0
        animateBody(
          body,
          { height: `${body.scrollHeight}px`, opacity: '1', transform: 'translateY(0)' },
          { height: '0', opacity: '0', transform: 'translateY(-6px)' },
          () => {
            details.open = false;
            body.style.cssText = '';
          },
        );
      } else {
        // opening: open first so the browser renders the content, then slide in
        details.open = true;
        const fullHeight = body.scrollHeight;
        animateBody(
          body,
          { height: '0', opacity: '0', transform: 'translateY(-6px)' },
          { height: `${fullHeight}px`, opacity: '1', transform: 'translateY(0)' },
          () => {
            // release the fixed pixel height so content can reflow naturally
            body.style.cssText = '';
          },
        );
      }
    });
  });
}

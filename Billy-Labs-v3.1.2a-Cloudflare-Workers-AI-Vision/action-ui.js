/* Shared public mashup action feedback and optical blurblet alignment. */
(() => {
  const timers = new WeakMap();

  function labelFor(button) {
    return button?.querySelector?.('.button-label') || null;
  }

  async function runCopyFeedback(button, copyOperation, successMessage = 'Copied') {
    const label = labelFor(button);
    if (!button || !label || button.disabled) return false;
    const originalLabel = label.textContent;
    clearTimeout(timers.get(button));
    try {
      await copyOperation();
      label.textContent = 'Copied!';
      button.disabled = true;
      const timer = window.setTimeout(() => {
        label.textContent = originalLabel;
        button.disabled = false;
        timers.delete(button);
      }, 1200);
      timers.set(button, timer);
      return true;
    } catch (error) {
      label.textContent = originalLabel;
      button.disabled = false;
      throw error;
    }
  }

  function alignBlurblet(group) {
    if (!group) return;
    const copyLabel = group.querySelector('.copy-emojis-button .button-label');
    const favoriteLabel = group.querySelector('.favorite-button .button-label');
    const blurblet = group.querySelector('.action-blurblet');
    if (!copyLabel || !favoriteLabel || !blurblet || blurblet.hidden) return;

    blurblet.style.removeProperty('right');
    blurblet.style.removeProperty('left');
    blurblet.style.removeProperty('transform');
    blurblet.style.removeProperty('width');
    blurblet.style.removeProperty('margin-left');
    blurblet.style.removeProperty('margin-right');

    const copyRect = copyLabel.getBoundingClientRect();
    const favoriteRect = favoriteLabel.getBoundingClientRect();
    const groupRect = group.getBoundingClientRect();

    // Keep the blurblet in normal document flow so long text wraps and
    // the card grows naturally. Its right edge sits on the optical guide
    // halfway between the rendered ends of the two button labels.
    const rawGuideX = ((copyRect.right + favoriteRect.right) / 2) - groupRect.left;
    const guideX = Math.max(0, Math.min(groupRect.width, rawGuideX));
    const rightSpace = Math.max(0, groupRect.width - guideX);

    blurblet.style.position = 'static';
    blurblet.style.left = 'auto';
    blurblet.style.right = 'auto';
    blurblet.style.transform = 'none';
    blurblet.style.width = 'max-content';
    blurblet.style.maxWidth = `${guideX}px`;
    blurblet.style.marginLeft = 'auto';
    blurblet.style.marginRight = `${rightSpace}px`;
  }

  function observeBlurblet(group) {
    if (!group) return;
    const align = () => window.requestAnimationFrame(() => alignBlurblet(group));
    align();
    window.addEventListener('resize', align, {passive:true});
    if ('ResizeObserver' in window) new ResizeObserver(align).observe(group);
    if (document.fonts?.ready) document.fonts.ready.then(align);
    return align;
  }

  window.BillyActionUI = {runCopyFeedback, alignBlurblet, observeBlurblet};
})();

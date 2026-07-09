document.querySelectorAll('.copyPrompt').forEach((button)=>{
  button.addEventListener('click', async ()=>{
    const card = button.closest('.prompt-card');
    const pre = card ? card.querySelector('pre') : null;
    const text = pre ? pre.innerText.trim() : '';
    if (!text) return;
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    button.textContent = '복사 완료';
    button.disabled = true;
    setTimeout(()=>{button.textContent = original; button.disabled = false;}, 1500);
  });
});

function setupInstallPage() {
  window.yangmou.setLang(window.yangmou.getLang());
  const nav = document.querySelector(".nav");
  if (nav && !document.querySelector(".lang-toggle")) {
    nav.appendChild(window.yangmou.createLangToggle());
  }

  const copyButton = document.getElementById("copy-install");
  const command = document.getElementById("install-command");
  if (copyButton && command) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(command.textContent.trim());
      } catch (err) {
        const textarea = document.createElement("textarea");
        textarea.value = command.textContent.trim();
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      const original = copyButton.textContent;
      copyButton.textContent = window.yangmou.I18N.install_copied[window.yangmou.getLang()];
      window.setTimeout(() => { copyButton.textContent = original; }, 1600);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupInstallPage);
} else {
  setupInstallPage();
}

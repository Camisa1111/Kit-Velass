/**
 * Exit Intent Detection - APENAS BOTÃO VOLTAR REAL
 * Ativa com: scroll, movimento do mouse, toque, teclas, cliques
 * Redireciona para oferta especial APENAS quando o usuário tenta SAIR da página
 * Ignora navegação interna (âncoras, scroll suave, etc)
 */

(function () {
  'use strict';

  // Configurações
  const CONFIG = {
    redirectUrl: 'ofertaespecial.html',
    sessionKey: 'exitIntentShown'
  };

  // Verificar se já foi mostrado nesta sessão
  if (sessionStorage.getItem(CONFIG.sessionKey)) {
    return;
  }

  // Flags de controle
  let exitIntentTriggered = false;
  let isInternalNavigation = false;
  let historyActivated = false;

  // Ativar o history.pushState (necessário para o popstate funcionar)
  function activateHistory() {
    if (!historyActivated) {
      historyActivated = true;
      history.pushState({ page: 'main' }, '', location.href);
      console.log('✅ Exit-intent ATIVADO - Pronto para detectar VOLTAR');
    }
  }

  // Trigger do exit intent
  function triggerExitIntent() {
    if (exitIntentTriggered) {
      return;
    }

    exitIntentTriggered = true;
    sessionStorage.setItem(CONFIG.sessionKey, 'true');

    // Redirecionar para a página de oferta especial
    window.location.href = CONFIG.redirectUrl;
  }

  // ===== ATIVAÇÃO AUTOMÁTICA COM MÚLTIPLOS EVENTOS =====

  // 1. Ativar com SCROLL (muito comum)
  window.addEventListener('scroll', activateHistory, {
    once: true,
    passive: true
  });

  // 2. Ativar com MOVIMENTO DO MOUSE (desktop)
  document.addEventListener('mousemove', activateHistory, {
    once: true,
    passive: true
  });

  // 3. Ativar com TOQUE (mobile)
  document.addEventListener('touchstart', activateHistory, {
    once: true,
    passive: true
  });

  // 4. Ativar com TECLA PRESSIONADA
  document.addEventListener('keydown', activateHistory, {
    once: true,
    passive: true
  });

  // 5. Ativar com CLIQUE (qualquer lugar)
  document.addEventListener('click', activateHistory, {
    once: true,
    passive: true
  });

  // 6. Fallback: tentar ativar após 1 segundo (caso usuário não faça nada)
  setTimeout(activateHistory, 1000);

  // ===== DETECTAR NAVEGAÇÃO INTERNA (ÂNCORAS) =====

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      const url = new URL(link.href);
      // Se é uma âncora na mesma página (#pricing, #offer, etc)
      if (url.hash && url.pathname === window.location.pathname) {
        isInternalNavigation = true;
        // Resetar flag após 1 segundo
        setTimeout(function () {
          isInternalNavigation = false;
        }, 1000);
      }
    }
  }, true);

  // ===== DETECTAR BOTÃO VOLTAR REAL =====

  window.addEventListener('popstate', function (event) {
    // Se é navegação interna (clique em âncora), IGNORAR
    if (isInternalNavigation) {
      console.log('⚠️ Navegação interna detectada - IGNORANDO');
      return;
    }

    // Se não tem estado ou está tentando voltar, é uma saída real
    if (!event.state || event.state.page !== 'main') {
      console.log('🚀 VOLTAR detectado - Redirecionando para oferta especial');
      // Prevenir navegação e mostrar oferta
      history.pushState({ page: 'main' }, '', location.href);
      triggerExitIntent();
    }
  });

  // Log inicial
  console.log('🎯 Exit Intent Detection carregado - Aguardando ativação (scroll, mouse, toque, etc)');

})();

/**
 * SA’ADAT CLINIC — INTERACTION SCRIPT
 * Custom premium animation triggers, scroll listeners, and WhatsApp chatbot.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. STICKY HEADER SCROLL TRANSITION
  // ==========================================================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });


  // ==========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  const toggleMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('nav-active');
  };

  const closeMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('nav-active');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });


  // ==========================================================================
  // 3. INTERSECTION OBSERVER: SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================================================
  // 4. INTERSECTION OBSERVER: ACTIVE LINK SYNC
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  
  const navObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const navObserver = new IntersectionObserver(navObserverCallback, {
    root: null,
    threshold: 0.4,
    rootMargin: '-80px 0px -20px 0px'
  });

  sections.forEach(section => {
    navObserver.observe(section);
  });


  // ==========================================================================
  // 5. ANIMATED STAT COUNTER MODULE
  // ==========================================================================
  const statElements = document.querySelectorAll('.stat-number, .counter');
  
  const animateCount = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const countInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * easeProgress;

      if (isDecimal) {
        element.textContent = currentValue.toFixed(1);
      } else {
        element.textContent = Math.floor(currentValue);
      }

      if (frame >= totalFrames) {
        clearInterval(countInterval);
        element.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }, frameRate);
  };

  const statsObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(statsObserverCallback, {
    root: null,
    threshold: 0.1
  });

  statElements.forEach(stat => {
    statsObserver.observe(stat);
  });


  // ==========================================================================
  // 6. WHATSAPP CHATBOT INTERACTIONS
  // ==========================================================================
  
  // Set Current Time on Chat Bubbles
  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const t1 = document.getElementById('chat-time-1');
  const t2 = document.getElementById('chat-time-2');
  if (t1) t1.textContent = formatTime();
  if (t2) t2.textContent = formatTime();

  // In-Card WhatsApp Chatbot Input
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatBody = document.querySelector('.chat-body');

  const sendChatMessage = () => {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    // 1. Create and show outgoing user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble outgoing';
    
    const userTextPara = document.createElement('p');
    userTextPara.textContent = messageText;
    userBubble.appendChild(userTextPara);

    const userTimeSpan = document.createElement('span');
    userTimeSpan.className = 'chat-time';
    userTimeSpan.textContent = formatTime();
    userBubble.appendChild(userTimeSpan);

    chatBody.appendChild(userBubble);
    
    // Clear Input
    chatInput.value = '';
    
    // Scroll Chat to Bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Wait 800ms and show assistant replying status
    setTimeout(() => {
      const replyBubble = document.createElement('div');
      replyBubble.className = 'chat-bubble incoming';
      
      const replyTextPara = document.createElement('p');
      replyTextPara.innerHTML = 'Connecting to WhatsApp... <span class="loading-dots"></span>';
      replyBubble.appendChild(replyTextPara);

      const replyTimeSpan = document.createElement('span');
      replyTimeSpan.className = 'chat-time';
      replyTimeSpan.textContent = formatTime();
      replyBubble.appendChild(replyTimeSpan);

      chatBody.appendChild(replyBubble);
      chatBody.scrollTop = chatBody.scrollHeight;

      // 3. Open WhatsApp link with prefilled user message
      setTimeout(() => {
        replyTextPara.textContent = 'Opening chat window...';
        const formattedMsg = encodeURIComponent(messageText);
        const waLink = `https://wa.me/917045076097?text=${formattedMsg}`;
        window.open(waLink, '_blank');
      }, 1000);

    }, 800);
  };

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }

  // ==========================================================================
  // 7. FLOATING WHATSAPP BUTTON POPUP WIDGET
  // ==========================================================================
  const waTrigger = document.getElementById('wa-trigger');
  const waChatWindow = document.getElementById('wa-chat-window');
  const waChatClose = document.getElementById('wa-chat-close');

  if (waTrigger && waChatWindow) {
    // Toggle Window on Trigger Click
    waTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      waChatWindow.classList.toggle('active');
    });

    // Close Window on Close Button Click
    if (waChatClose) {
      waChatClose.addEventListener('click', (e) => {
        e.stopPropagation();
        waChatWindow.classList.remove('active');
      });
    }

    // Close on document click outside
    document.addEventListener('click', (e) => {
      if (waChatWindow.classList.contains('active') && 
          !waChatWindow.contains(e.target) && 
          !waTrigger.contains(e.target)) {
        waChatWindow.classList.remove('active');
      }
    });

    // Auto-popup floating chat window after 6 seconds to grab user attention
    setTimeout(() => {
      if (!waChatWindow.classList.contains('active')) {
        waChatWindow.classList.add('active');
      }
    }, 6000);
  }
});

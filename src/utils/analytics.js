import FingerprintJS from '@fingerprintjs/fingerprintjs';

class Analytics {
  constructor() {
    this.sessionId = null;
    this.fingerprint = null;
    this.startTime = Date.now();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Отримуємо fingerprint
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.fingerprint = result.visitorId;
      
      // Генеруємо sessionId
      this.sessionId = `${this.fingerprint}_${Date.now()}`;
      
      // Створюємо сесію на бекенді
      await this.createSession();
      
      // Слухаємо події
      this.setupListeners();
      
      this.isInitialized = true;
      console.log('Analytics initialized:', this.sessionId);
    } catch (error) {
      console.error('Analytics init error:', error);
    }
  }

  async createSession() {
    const urlParams = new URLSearchParams(window.location.search);
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/analytics/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          fingerprint: this.fingerprint,
          referrer: document.referrer,
          utmSource: urlParams.get('utm_source'),
          utmMedium: urlParams.get('utm_medium'),
          utmCampaign: urlParams.get('utm_campaign'),
          userAgent: navigator.userAgent,
          currentUrl: window.location.href
        })
      });
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  async trackEvent(type, data = {}) {
    if (!this.isInitialized || !this.sessionId) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          type,
          data,
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  setupListeners() {
    // Час на сторінці
    let timeOnPage = 0;
    const interval = setInterval(() => {
      timeOnPage += 30;
      this.trackEvent('time_on_page', { 
        url: window.location.pathname,
        seconds: timeOnPage 
      });
    }, 30000); // кожні 30 секунд

    // Закриття вкладки
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
      this.trackEvent('session_end', { 
        totalTime: Date.now() - this.startTime 
      });
    });

    // Scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth % 25 === 0) { // кожні 25%
          this.trackEvent('scroll', { 
            depth: scrollDepth,
            url: window.location.pathname 
          });
        }
      }
    });
  }

  // Трекінг переходу на нову сторінку
  trackPageView(path) {
    this.trackEvent('page_view', { url: path });
  }

  // Спеціальні події
  trackArticleView(articleId, authorId) {
    this.trackEvent('article_view', { articleId, authorId });
  }

  trackAddToCart(articleId, authorId, price) {
    this.trackEvent('add_to_cart', { articleId, authorId, price });
  }

  trackRemoveFromCart(articleId) {
    this.trackEvent('remove_from_cart', { articleId });
  }

  trackPurchase(articleId, authorId, price) {
    this.trackEvent('purchase', { articleId, authorId, price });
  }

  trackFollow(targetUserId) {
    this.trackEvent('follow', { targetUserId });
  }

  trackUnfollow(targetUserId) {
    this.trackEvent('unfollow', { targetUserId });
  }

  trackSearch(query) {
    this.trackEvent('search', { query });
  }

  trackArticleCreate() {
    this.trackEvent('article_create');
  }

  trackAddToFavorites(articleId, authorId) {
    this.trackEvent('add_to_favorites', { articleId, authorId });
  }

  trackRemoveFromFavorites(articleId, authorId) {
    this.trackEvent('remove_from_favorites', { articleId, authorId });
  }
}

export const analytics = new Analytics();
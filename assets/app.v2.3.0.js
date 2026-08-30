(function() {
            'use strict';
            const APP_VERSION = '2.3.0';
            window.SCHOOL_WEBSITE_VERSION = APP_VERSION;

            const RAW_RUNTIME_CONFIG = window.SCHOOL_WEBSITE_RUNTIME_CONFIG && typeof window.SCHOOL_WEBSITE_RUNTIME_CONFIG === 'object'
                ? window.SCHOOL_WEBSITE_RUNTIME_CONFIG
                : {};
            const runtimeText = (value, fallback = '') => {
                const text = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
                return text || fallback;
            };
            const normalizeCanonicalUrl = value => {
                try {
                    const parsed = new URL(String(value || '').trim());
                    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return '';
                    parsed.hash = '';
                    return parsed.href;
                } catch (error) { return ''; }
            };
            const supabaseUrl = runtimeText(RAW_RUNTIME_CONFIG.supabaseUrl).replace(/\/$/, '');
            const publishableKey = runtimeText(RAW_RUNTIME_CONFIG.supabasePublishableKey);
            const configuredSchoolName = runtimeText(RAW_RUNTIME_CONFIG.schoolName, 'School Website Master');
            const derivedInitials = configuredSchoolName.split(/\s+/).filter(Boolean).slice(0, 3).map(word => word[0]).join('').toUpperCase() || 'SW';
            const configuredInitials = runtimeText(RAW_RUNTIME_CONFIG.schoolInitials, derivedInitials).replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || derivedInitials;
            const configuredMotto = runtimeText(RAW_RUNTIME_CONFIG.schoolMotto, 'Learning Today, Leading Tomorrow');
            const configuredHeroTag = runtimeText(RAW_RUNTIME_CONFIG.heroTag, 'Knowledge • Character • Excellence');
            const canonicalUrl = normalizeCanonicalUrl(RAW_RUNTIME_CONFIG.canonicalUrl);
            const isValidProjectUrl = /^https:\/\/[a-z0-9]{8,}\.supabase\.co$/i.test(supabaseUrl);
            const isValidPublishableKey = /^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(publishableKey);
            const IS_RUNTIME_CONFIGURED = RAW_RUNTIME_CONFIG.configured === true && isValidProjectUrl && isValidPublishableKey && configuredSchoolName !== 'School Website Master';
            const CANONICAL_SCHOOL_NAME = configuredSchoolName;
            const CANONICAL_SCHOOL_INITIALS = configuredInitials;
            const CURRENT_YEAR = new Date().getFullYear();

            const DEFAULT_CONFIG = {
                supabase: { url: supabaseUrl, anonKey: publishableKey },
                settingsKey: runtimeText(RAW_RUNTIME_CONFIG.settingsKey, 'default'),
                storageBucket: runtimeText(RAW_RUNTIME_CONFIG.storageBucket, 'school-website-assets'),
                school: { name: CANONICAL_SCHOOL_NAME, logoInitials: CANONICAL_SCHOOL_INITIALS, logoUrl: '', establishedText: configuredHeroTag, motto: configuredMotto },
                theme: { primary: '#3A7D44', primaryDark: '#2D6235', primaryLight: '#5B9A5F', accent: '#F0A04B', accentHover: '#D98A35', headerBackground: '#FFFFFF', footerBackground: '#263028' },
                hero: { tag: configuredHeroTag, title: configuredMotto.replace(/,\s*/g, ',\n'), subtitle: 'Welcome to ' + CANONICAL_SCHOOL_NAME + ', a vibrant learning community where curiosity thrives, character grows, and every learner is encouraged to reach their full potential.', primaryCtaText: 'Admissions Open', primaryCtaLink: '#admissions', secondaryCtaText: 'Virtual Tour', secondaryCtaLink: '#gallery', backgroundImageUrl: '', backgroundImages: [], slideIntervalSeconds: 5 },
                about: { title: 'About ' + CANONICAL_SCHOOL_NAME, subtitle: 'We are dedicated to fostering academic excellence, personal growth, strong character, and a lifelong love of learning.', cards: [ { icon: '🎯', title: 'Our Mission', text: 'To provide a holistic education that ignites intellectual curiosity, builds resilience, and prepares students to thrive with confidence and compassion.' }, { icon: '🌟', title: 'Our Vision', text: 'To be a beacon of progressive education where innovative teaching meets timeless values.' }, { icon: '🤝', title: 'Core Values', text: 'Respect, integrity, curiosity, resilience, and community guide everything we do inside the classroom and beyond.' } ] },
                principal: { name: 'The Principal', title: 'Principal’s Welcome', message: 'Welcome to our school community. We are committed to creating a caring, disciplined, and inspiring environment where every learner can grow academically and morally.', photoUrl: '', email: '', phone: '' },
                academics: { title: 'Our Curriculum', subtitle: 'A rich, balanced programme designed to spark curiosity and develop well-rounded, future-ready learners.', cards: [ { icon: '🔬', title: 'STEM', text: 'Hands-on Science, Technology, Engineering, and Mathematics with inquiry-based learning.' }, { icon: '📚', title: 'Humanities', text: 'Literature, History, Global Studies, and critical thinking for responsible citizenship.' }, { icon: '🎨', title: 'Creative Arts', text: 'Visual Arts, Music, Drama, and Design that encourage confidence and creative expression.' } ] },
                admissions: { title: 'Admissions', subtitle: 'Joining our school is the first step on an inspiring educational journey.', prospectusText: 'Download Prospectus', prospectusUrl: '#', prospectusFileName: '', prospectusFileType: '', prospectusUploadedAt: '', steps: [ { title: 'Submit an Enquiry', text: 'Fill out the form or contact us. We will send you the required admission information.' }, { title: 'Campus Visit and Tour', text: 'Visit the school, meet staff, and experience our learning environment.' }, { title: 'Application and Assessment', text: 'Complete the application form and any age-appropriate assessment.' }, { title: 'Offer and Enrolment', text: 'Successful applicants receive an offer and complete enrolment.' } ] },
                events: { title: 'Upcoming Events', subtitle: 'Stay connected with our vibrant school community.', fallback: [] },
                announcements: { title: 'News & Announcements', subtitle: 'Important notices, admission updates, and school community news.', fallback: [] },
                gallery: { title: 'Campus Gallery', subtitle: 'Explore school life through automatic album slideshows. Open any album for the full gallery experience.', fallback: [] },
                contact: { title: 'Get In Touch', subtitle: 'We would love to hear from you. Reach out with any questions.', address: CANONICAL_SCHOOL_NAME, phone: '', email: '', whatsapp: '', mapEmbedUrl: '' },
                footer: { description: configuredMotto + '.', bottomText: '© ' + CURRENT_YEAR + ' ' + CANONICAL_SCHOOL_NAME + '. All rights reserved.' },
                social: { facebook: '', twitter: '', instagram: '', youtube: '' },
                seo: { pageTitle: CANONICAL_SCHOOL_NAME + ' | ' + configuredMotto, description: CANONICAL_SCHOOL_NAME + ' is a learning community focused on academic excellence, character formation, and future-ready education.', keywords: CANONICAL_SCHOOL_NAME + ', school, admissions, academics, education', ogTitle: CANONICAL_SCHOOL_NAME, ogDescription: configuredMotto, ogImage: '' }
            };
            const THEME_PRESETS = {
                green: { primary: '#3A7D44', primaryDark: '#2D6235', primaryLight: '#5B9A5F', accent: '#F0A04B', accentHover: '#D98A35', headerBackground: '#FFFFFF', footerBackground: '#263028' },
                deepBlue: { primary: '#0B3D91', primaryDark: '#082B66', primaryLight: '#2F6BC2', accent: '#F4B400', accentHover: '#D99A00', headerBackground: '#FFFFFF', footerBackground: '#061A40' },
                navyGold: { primary: '#102A43', primaryDark: '#071A2D', primaryLight: '#2F4F6F', accent: '#C9A227', accentHover: '#AA861B', headerBackground: '#FFFFFF', footerBackground: '#071A2D' },
                redWhite: { primary: '#B71C1C', primaryDark: '#7F1010', primaryLight: '#D84343', accent: '#1F2937', accentHover: '#111827', headerBackground: '#FFFFFF', footerBackground: '#2B1111' },
                purpleModern: { primary: '#5B2C83', primaryDark: '#3F1D5E', primaryLight: '#7E57C2', accent: '#00A896', accentHover: '#008B7C', headerBackground: '#FFFFFF', footerBackground: '#27123A' }
            };
            const TRUSTED_RUNTIME_CONFIG = Object.freeze({
                configured: IS_RUNTIME_CONFIGURED,
                supabase: Object.freeze({ ...DEFAULT_CONFIG.supabase }),
                settingsKey: DEFAULT_CONFIG.settingsKey,
                storageBucket: DEFAULT_CONFIG.storageBucket,
                canonicalUrl
            });
            const BLOCKED_MERGE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
            let currentConfig = clone(DEFAULT_CONFIG);
            let supabaseClient = null;
            let adminSession = null;
            let editingEventId = null;
            let editingGalleryAlbumId = null;
            let editingGalleryImageId = null;
            let selectedGalleryAlbumId = null;
            let galleryAlbumsCache = [];
            let galleryImagesCache = [];
            let activeLightboxImages = [];
            let activeLightboxIndex = 0;
            let activeLightboxAlbumTitle = '';
            let activeLightboxIntervalSeconds = 5;
            let lightboxTimer = null;
            let lightboxResumeAfterVisibility = false;
            let lightboxTouchStartX = null;
            let galleryCardSlideshows = [];
            let galleryCardObserver = null;
            let editingNewsId = null;
            let enquiriesCache = [];
            let heroSlideTimer = null;
            let heroSlideIndex = 0;
            let adminAccessVerified = false;
            let pendingAccessCode = '';
            let settingsLoadStatus = 'not_loaded';
            let formReadyAt = Date.now() + 1200;

            const $ = (id) => document.getElementById(id);
            function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
            function isPlainObject(value) {
                if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
                const proto = Object.getPrototypeOf(value);
                return proto === Object.prototype || proto === null;
            }
            function deepMerge(target, source, depth = 0) {
                if (!isPlainObject(source) || depth > 12) return target;
                Object.keys(source).forEach(key => {
                    if (BLOCKED_MERGE_KEYS.has(key) || !Object.prototype.hasOwnProperty.call(target, key)) return;
                    if (isPlainObject(source[key])) {
                        if (!isPlainObject(target[key])) target[key] = {};
                        deepMerge(target[key], source[key], depth + 1);
                    } else if (Array.isArray(source[key])) {
                        target[key] = clone(source[key]).slice(0, 200);
                    } else if (['string', 'number', 'boolean'].includes(typeof source[key]) || source[key] === null) {
                        target[key] = source[key];
                    }
                });
                return target;
            }
            function applyTrustedRuntimeConfig(config) {
                config.supabase = clone(TRUSTED_RUNTIME_CONFIG.supabase);
                config.settingsKey = TRUSTED_RUNTIME_CONFIG.settingsKey;
                config.storageBucket = TRUSTED_RUNTIME_CONFIG.storageBucket;
                if (!config.school || typeof config.school !== 'object') config.school = {};
                config.school.name = CANONICAL_SCHOOL_NAME;
                config.school.logoInitials = CANONICAL_SCHOOL_INITIALS;
                return config;
            }
            function mergePublicConfig(source) {
                const safeSource = isPlainObject(source) ? clone(source) : {};
                delete safeSource.supabase;
                delete safeSource.settingsKey;
                delete safeSource.storageBucket;
                return applyTrustedRuntimeConfig(deepMerge(clone(DEFAULT_CONFIG), safeSource));
            }
            function getPersistableConfig() {
                const config = clone(currentConfig);
                delete config.supabase;
                delete config.settingsKey;
                delete config.storageBucket;
                config.school.name = CANONICAL_SCHOOL_NAME;
                config.school.logoInitials = CANONICAL_SCHOOL_INITIALS;
                return config;
            }
            function getPath(obj, path) { return path.split('.').reduce((acc, key) => acc && acc[key], obj); }
            function setPath(obj, path, value) {
                const parts = path.split('.');
                if (parts.some(key => BLOCKED_MERGE_KEYS.has(key))) return;
                let ref = obj;
                parts.slice(0, -1).forEach(key => { if (!ref[key] || typeof ref[key] !== 'object') ref[key] = {}; ref = ref[key]; });
                ref[parts[parts.length - 1]] = value;
            }
            function safeUrl(url) {
                const value = String(url || '').trim();
                if (!value || value.length > 2048) return '';
                try {
                    if (/^#[A-Za-z][A-Za-z0-9_-]*$/.test(value)) return value;
                    const parsed = new URL(value, window.location.href);
                    if (parsed.username || parsed.password) return '';
                    if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') return parsed.href;
                    if (parsed.protocol === 'https:') return parsed.href;
                    if (parsed.protocol === 'http:' && parsed.origin === window.location.origin) return parsed.href;
                    return '';
                } catch (e) { return ''; }
            }
            function safeImageUrl(url) {
                const safe = safeUrl(url);
                if (!safe) return '';
                try {
                    const parsed = new URL(safe, window.location.href);
                    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
                } catch (e) { return ''; }
            }
            function setMultilineText(element, value) {
                if (!element) return;
                element.replaceChildren();
                String(value || '').split(/\r?\n/).forEach((line, index) => {
                    if (index) element.appendChild(document.createElement('br'));
                    element.appendChild(document.createTextNode(line));
                });
            }
            function renderEmptyState(container, message) {
                if (!container) return;
                const note = document.createElement('p');
                note.className = 'empty-state';
                note.textContent = message;
                container.appendChild(note);
            }
            function decodeHtmlEntities(value) {
                const textarea = document.createElement('textarea');
                textarea.innerHTML = String(value || '');
                return textarea.value;
            }
            function extractUrlFromIframeOrText(value) {
                const raw = decodeHtmlEntities(String(value || '').trim());
                if (!raw) return '';
                const iframeSrcMatch = raw.match(/src\s*=\s*["']([^"']+)["']/i);
                return (iframeSrcMatch ? iframeSrcMatch[1] : raw).trim();
            }
            function normalizeGoogleMapsEmbedInput(value) {
                const candidate = extractUrlFromIframeOrText(value);
                if (!candidate) return '';
                const safe = safeUrl(candidate);
                if (!safe) return '';
                try {
                    const parsed = new URL(safe);
                    const host = parsed.hostname.toLowerCase();
                    const isGoogleHost = host === 'google.com' || host.endsWith('.google.com') || /(^|\.)google\.[a-z.]{2,}$/i.test(host);
                    const isShortMapLink = host === 'maps.app.goo.gl' || host === 'goo.gl';
                    if (!isGoogleHost && !isShortMapLink) return '';
                    if (isShortMapLink) return '';
                    parsed.protocol = 'https:';
                    parsed.hostname = 'www.google.com';
                    parsed.port = '';
                    if (parsed.pathname.startsWith('/maps/embed')) return parsed.href;
                    if (parsed.pathname.startsWith('/maps')) {
                        if (!parsed.searchParams.has('output')) parsed.searchParams.set('output', 'embed');
                        return parsed.href;
                    }
                    return '';
                } catch (e) {
                    return '';
                }
            }
            function formatDate(value) {
                if (!value) return '';
                const date = new Date(value + (String(value).length === 10 ? 'T00:00:00' : ''));
                if (Number.isNaN(date.getTime())) return value;
                return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            }
            function setText(id, value) { const el = $(id); if (el) el.textContent = value || ''; }
            function show(el) { if (el) el.classList.add('visible'); }
            function hide(el) { if (el) el.classList.remove('visible'); }
            function adminMessage(text, type = 'success') {
                const box = $('adminMessage');
                if (!box) return;
                box.textContent = text;
                box.className = 'admin-message visible ' + type;
                setTimeout(() => box.classList.remove('visible'), 5000);
            }
            function getRequestErrorMessage(error) {
                return error && typeof error.message === 'string' && error.message.trim() ? error.message.trim() : 'Network or server error.';
            }
            function getLocalIsoDate(date = new Date()) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return year + '-' + month + '-' + day;
            }
            function getExportSlug() {
                return getSiteSchoolName().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'school-website';
            }
            async function fetchWithTimeout(input, init = {}) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 20000);
                const upstreamSignal = init && init.signal;
                const abortFromUpstream = () => controller.abort();
                if (upstreamSignal) {
                    if (upstreamSignal.aborted) controller.abort();
                    else upstreamSignal.addEventListener('abort', abortFromUpstream, { once: true });
                }
                try {
                    return await window.fetch(input, { ...init, signal: controller.signal });
                } finally {
                    clearTimeout(timeoutId);
                    if (upstreamSignal) upstreamSignal.removeEventListener('abort', abortFromUpstream);
                }
            }
            function showSetupRequiredState() {
                const banner = $('setupRequiredBanner');
                if (banner) banner.hidden = IS_RUNTIME_CONFIGURED;
                document.body.classList.toggle('setup-required', !IS_RUNTIME_CONFIGURED);
                ['adminOpenBtn'].forEach(id => { const button = $(id); if (button) button.disabled = !IS_RUNTIME_CONFIGURED; });
                document.querySelectorAll('#admissionsForm button[type="submit"], #contactForm button[type="submit"]').forEach(button => { button.disabled = !IS_RUNTIME_CONFIGURED; });
            }
            async function runAdminRequest(operation, failureMessage) {
                try {
                    const result = await operation();
                    if (result && result.error) throw result.error;
                    return result || {};
                } catch (error) {
                    adminMessage(failureMessage + ': ' + getRequestErrorMessage(error), 'error');
                    return null;
                }
            }
            function setMeta(selector, attr, value) {
                let el = document.querySelector(selector);
                if (!el && selector.startsWith('meta[')) {
                    const nameMatch = selector.match(/meta\[name=\"([^\"]+)\"\]/);
                    const propertyMatch = selector.match(/meta\[property=\"([^\"]+)\"\]/);
                    if (nameMatch || propertyMatch) {
                        el = document.createElement('meta');
                        if (nameMatch) el.setAttribute('name', nameMatch[1]);
                        if (propertyMatch) el.setAttribute('property', propertyMatch[1]);
                        document.head.appendChild(el);
                    }
                }
                if (el) el.setAttribute(attr, value || '');
            }

            function safeThemeColor(value, fallback) {
                const candidate = String(value || '').trim();
                return /^#[0-9a-f]{6}$/i.test(candidate) ? candidate : fallback;
            }
            function relativeLuminance(hex) {
                const value = safeThemeColor(hex, '#000000').slice(1);
                const channels = [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16) / 255)
                    .map(channel => channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4));
                return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
            }
            function contrastRatio(first, second) {
                const a = relativeLuminance(first); const b = relativeLuminance(second);
                return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            }
            function readableForeground(background) {
                return contrastRatio(background, '#FFFFFF') >= contrastRatio(background, '#1F2937') ? '#FFFFFF' : '#1F2937';
            }
            function getComputedPrimaryColor() {
                return safeThemeColor(getComputedStyle(document.documentElement).getPropertyValue('--clr-primary').trim(), '#3A7D44');
            }
            function encodeSvgForDataUrl(svg) {
                return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
            }
            function getInitialsFaviconDataUrl() {
                const initials = String(currentConfig.school.logoInitials || currentConfig.school.name || 'S')
                    .replace(/[^A-Za-z0-9]/g, '')
                    .slice(0, 3)
                    .toUpperCase() || 'S';
                const primary = getComputedPrimaryColor();
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <rect width="64" height="64" rx="14" fill="${primary}"/>
                    <text x="32" y="41" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#ffffff">${initials}</text>
                </svg>`;
                return encodeSvgForDataUrl(svg);
            }
            function setOrCreateIconLink(id, rel, href, type) {
                let link = document.getElementById(id);
                if (!link) {
                    link = document.createElement('link');
                    link.id = id;
                    link.rel = rel;
                    document.head.appendChild(link);
                }
                if (type) {
                    link.type = type;
                } else {
                    link.removeAttribute('type');
                }
                link.href = href;
            }
            function updateBrowserTabLogo() {
                const configuredLogo = safeImageUrl(currentConfig.school.logoUrl || '');
                const faviconHref = configuredLogo || getInitialsFaviconDataUrl();
                setOrCreateIconLink('siteFavicon', 'icon', faviconHref, configuredLogo ? undefined : 'image/svg+xml');
                setOrCreateIconLink('siteShortcutIcon', 'shortcut icon', faviconHref);
                setOrCreateIconLink('siteAppleTouchIcon', 'apple-touch-icon', faviconHref);
            }
            function applyTheme() {
                const t = currentConfig.theme || DEFAULT_CONFIG.theme;
                const root = document.documentElement.style;
                const primary = safeThemeColor(t.primary, DEFAULT_CONFIG.theme.primary);
                const primaryDark = safeThemeColor(t.primaryDark, DEFAULT_CONFIG.theme.primaryDark);
                const primaryLight = safeThemeColor(t.primaryLight, DEFAULT_CONFIG.theme.primaryLight);
                const accent = safeThemeColor(t.accent, DEFAULT_CONFIG.theme.accent);
                const accentHover = safeThemeColor(t.accentHover, DEFAULT_CONFIG.theme.accentHover);
                root.setProperty('--clr-primary', primary);
                root.setProperty('--clr-primary-dark', primaryDark);
                root.setProperty('--clr-primary-light', primaryLight);
                root.setProperty('--clr-accent', accent);
                root.setProperty('--clr-accent-hover', accentHover);
                root.setProperty('--clr-header-bg', safeThemeColor(t.headerBackground, DEFAULT_CONFIG.theme.headerBackground));
                root.setProperty('--clr-footer-bg', safeThemeColor(t.footerBackground, DEFAULT_CONFIG.theme.footerBackground));
                root.setProperty('--clr-on-primary', readableForeground(primary));
                root.setProperty('--clr-on-primary-dark', readableForeground(primaryDark));
                root.setProperty('--clr-on-accent', readableForeground(accent));
                root.setProperty('--clr-on-accent-hover', readableForeground(accentHover));
                root.setProperty('--clr-accent-readable', contrastRatio(accent, '#FFFFFF') >= 4.5 ? accent : '#8A4B08');
            }
            function getHeroSlideImages() {
                const configuredSlides = Array.isArray(currentConfig.hero.backgroundImages) ? currentConfig.hero.backgroundImages : [];
                const slides = configuredSlides.map(item => typeof item === 'string' ? item : item && item.url).filter(Boolean);
                const single = currentConfig.hero.backgroundImageUrl;
                if (single && !slides.includes(single)) slides.unshift(single);
                return slides.map(url => safeImageUrl(url)).filter(Boolean);
            }
            function getHomepagePreviewImage() {
                const explicit = safeImageUrl(currentConfig.seo && currentConfig.seo.ogImage ? currentConfig.seo.ogImage : '');
                if (explicit && !explicit.startsWith('#')) return explicit;
                const slides = getHeroSlideImages();
                if (slides.length) return slides[0];
                const singleHero = safeImageUrl(currentConfig.hero && currentConfig.hero.backgroundImageUrl ? currentConfig.hero.backgroundImageUrl : '');
                if (singleHero && !singleHero.startsWith('#')) return singleHero;
                const logo = safeImageUrl(currentConfig.school && currentConfig.school.logoUrl ? currentConfig.school.logoUrl : '');
                return logo && !logo.startsWith('#') ? logo : '';
            }
            function cleanText(value) {
                return String(value || '').replace(/\s+/g, ' ').trim();
            }
            function toSafeSortOrder(value, fallback = 0) {
                const parsed = Number(value);
                if (!Number.isFinite(parsed)) return fallback;
                return Math.max(-2147483648, Math.min(2147483647, Math.trunc(parsed)));
            }
            function replaceTemplateSchoolNames(value, schoolName) {
                return String(value || '')
                    .replace(/School Website Master/gi, schoolName)
                    .replace(/Your School Name/gi, schoolName);
            }
            function getSiteSchoolName() {
                const name = currentConfig.school && currentConfig.school.name ? cleanText(currentConfig.school.name) : '';
                return CANONICAL_SCHOOL_NAME;
            }
            function getSiteMotto() {
                const motto = currentConfig.school && currentConfig.school.motto ? cleanText(currentConfig.school.motto) : '';
                return motto || configuredMotto;
            }
            function syncEstablishedText() {
                if (!currentConfig.school || typeof currentConfig.school !== 'object') currentConfig.school = {};
                if (!currentConfig.hero || typeof currentConfig.hero !== 'object') currentConfig.hero = {};
                const identityText = cleanText(currentConfig.school.establishedText || '');
                const heroText = cleanText(currentConfig.hero.tag || '');
                const effectiveText = identityText || heroText || configuredHeroTag;
                currentConfig.school.establishedText = effectiveText;
                currentConfig.hero.tag = effectiveText;
                return effectiveText;
            }
            function normalizeIdentityDependentText() {
                const schoolName = getSiteSchoolName();
                [
                    'hero.subtitle',
                    'about.title',
                    'contact.address',
                    'footer.bottomText'
                ].forEach(path => {
                    const value = getPath(currentConfig, path);
                    if (value) setPath(currentConfig, path, replaceTemplateSchoolNames(value, schoolName));
                });
            }
            function buildIdentitySeo() {
                normalizeIdentityDependentText();
                const schoolName = getSiteSchoolName();
                const motto = getSiteMotto();
                const heroSubtitle = currentConfig.hero && currentConfig.hero.subtitle ? cleanText(currentConfig.hero.subtitle) : '';
                const description = replaceTemplateSchoolNames(heroSubtitle || (schoolName + ' is a vibrant learning community focused on academic excellence, character formation, and future-ready education.'), schoolName);
                return {
                    pageTitle: motto ? schoolName + ' | ' + motto : schoolName,
                    description: description,
                    keywords: schoolName + ', school, admissions, academics, education',
                    ogTitle: schoolName,
                    ogDescription: motto || description
                };
            }
            function syncSocialPreviewDefaults() {
                if (!currentConfig.seo || typeof currentConfig.seo !== 'object') currentConfig.seo = {};
                const identitySeo = buildIdentitySeo();
                const preserveOrDefault = (value, fallback) => {
                    const normalized = cleanText(replaceTemplateSchoolNames(value || '', getSiteSchoolName()));
                    return normalized || fallback;
                };
                // Page title, description, and keywords remain editable. Only blank or
                // legacy-branded values are normalized. Open Graph identity fields are
                // intentionally tied to the canonical school name and current motto.
                currentConfig.seo.pageTitle = preserveOrDefault(currentConfig.seo.pageTitle, identitySeo.pageTitle);
                currentConfig.seo.description = preserveOrDefault(currentConfig.seo.description, identitySeo.description);
                currentConfig.seo.keywords = preserveOrDefault(currentConfig.seo.keywords, identitySeo.keywords);
                currentConfig.seo.ogTitle = identitySeo.ogTitle;
                currentConfig.seo.ogDescription = identitySeo.ogDescription;
                if (currentConfig.seo.ogImage) currentConfig.seo.ogImage = safeImageUrl(currentConfig.seo.ogImage) || '';
            }
            function refreshSeoInputs() {
                document.querySelectorAll('[data-config-path^="seo."]').forEach(input => {
                    const value = getPath(currentConfig, input.dataset.configPath);
                    input.value = value || '';
                });
            }
            function applyHeroBackground(url) {
                const hero = $('heroSection');
                if (!hero) return;
                if (url) {
                    hero.classList.add('has-image');
                    hero.style.backgroundImage = 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45)), url("' + String(url).replace(/"/g, '%22') + '")';
                } else {
                    hero.classList.remove('has-image');
                    hero.style.backgroundImage = '';
                }
            }
            function startHeroSlideshow() {
                if (heroSlideTimer) clearInterval(heroSlideTimer);
                const slides = getHeroSlideImages();
                if (!slides.length) { applyHeroBackground(''); return; }
                if (heroSlideIndex >= slides.length) heroSlideIndex = 0;
                applyHeroBackground(slides[heroSlideIndex]);
                if (slides.length > 1) {
                    const seconds = Math.min(60, Math.max(2, Number(currentConfig.hero.slideIntervalSeconds || 5) || 5));
                    heroSlideTimer = setInterval(() => {
                        const latestSlides = getHeroSlideImages();
                        if (!latestSlides.length) { applyHeroBackground(''); return; }
                        heroSlideIndex = (heroSlideIndex + 1) % latestSlides.length;
                        applyHeroBackground(latestSlides[heroSlideIndex]);
                    }, seconds * 1000);
                }
            }
            function renderSite(options = {}) {
                syncSocialPreviewDefaults();
                const establishedText = syncEstablishedText();
                applyTheme();
                const shareTitle = getSiteSchoolName();
                const shareDescription = currentConfig.seo.ogDescription || currentConfig.hero.subtitle || currentConfig.seo.description || '';
                const shareImage = getHomepagePreviewImage();
                const pageUrl = TRUSTED_RUNTIME_CONFIG.canonicalUrl || window.location.href.split('#')[0];
                const canonicalLink = document.querySelector('link[rel="canonical"]');
                if (canonicalLink) canonicalLink.href = pageUrl;
                document.title = currentConfig.seo.pageTitle || shareTitle;
                setMeta('meta[name="description"]', 'content', currentConfig.seo.description || shareDescription);
                setMeta('meta[name="keywords"]', 'content', currentConfig.seo.keywords);
                setMeta('meta[property="og:title"]', 'content', shareTitle);
                setMeta('meta[property="og:site_name"]', 'content', currentConfig.school.name || shareTitle);
                setMeta('meta[property="og:description"]', 'content', shareDescription);
                setMeta('meta[property="og:type"]', 'content', 'website');
                setMeta('meta[property="og:url"]', 'content', pageUrl);
                setMeta('meta[property="og:image"]', 'content', shareImage);
                setMeta('meta[property="og:image:secure_url"]', 'content', shareImage);
                setMeta('meta[property="og:image:alt"]', 'content', (currentConfig.school.name || shareTitle) + ' homepage image');
                setMeta('meta[name="twitter:card"]', 'content', shareImage ? 'summary_large_image' : 'summary');
                setMeta('meta[name="twitter:title"]', 'content', shareTitle);
                setMeta('meta[name="twitter:description"]', 'content', shareDescription);
                setMeta('meta[name="twitter:image"]', 'content', shareImage);
                updateBrowserTabLogo();
                setText('siteNameText', currentConfig.school.name);
                setText('siteLogoText', currentConfig.school.logoInitials || 'S');
                const logoImg = $('siteLogoImg');
                const logoText = $('siteLogoText');
                const safeLogoUrl = safeImageUrl(currentConfig.school.logoUrl);
                if (safeLogoUrl) { logoImg.src = safeLogoUrl; logoImg.style.display = 'block'; logoText.style.display = 'none'; } else { logoImg.removeAttribute('src'); logoImg.style.display = 'none'; logoText.style.display = 'inline-flex'; }
                startHeroSlideshow();
                setText('heroTag', establishedText);
                setMultilineText($('heroHeading'), currentConfig.hero.title || '');
                setText('heroSubtitle', currentConfig.hero.subtitle);
                $('heroPrimaryCta').textContent = currentConfig.hero.primaryCtaText || 'Learn More'; $('heroPrimaryCta').href = safeUrl(currentConfig.hero.primaryCtaLink) || '#admissions';
                $('heroSecondaryCta').textContent = currentConfig.hero.secondaryCtaText || 'Gallery'; $('heroSecondaryCta').href = safeUrl(currentConfig.hero.secondaryCtaLink) || '#gallery';
                setText('aboutHeading', currentConfig.about.title); setText('aboutSubtitle', currentConfig.about.subtitle); renderAboutCards(); renderPrincipal();
                setText('academicsHeading', currentConfig.academics.title); setText('academicsSubtitle', currentConfig.academics.subtitle); renderAcademics();
                setText('admissionsHeading', currentConfig.admissions.title); setText('admissionsSubtitle', currentConfig.admissions.subtitle); renderAdmissionsSteps();
                const prospectusUrl = safeImageUrl(currentConfig.admissions.prospectusUrl || '');
                $('prospectusBtn').textContent = currentConfig.admissions.prospectusText || 'Download Prospectus';
                $('prospectusBtn').href = prospectusUrl || '#admissions';
                if (prospectusUrl && !prospectusUrl.startsWith('#')) {
                    $('prospectusBtn').setAttribute('download', currentConfig.admissions.prospectusFileName || 'school-prospectus');
                    $('prospectusBtn').setAttribute('title', 'Download ' + (currentConfig.admissions.prospectusFileName || 'school prospectus'));
                } else {
                    $('prospectusBtn').removeAttribute('download');
                    $('prospectusBtn').setAttribute('title', 'Prospectus file has not been uploaded yet.');
                }
                setText('eventsHeading', currentConfig.events.title); setText('eventsSubtitle', currentConfig.events.subtitle);
                setText('newsHeading', currentConfig.announcements.title); setText('newsSubtitle', currentConfig.announcements.subtitle);
                setText('galleryHeading', currentConfig.gallery.title); setText('gallerySubtitle', currentConfig.gallery.subtitle);
                setText('contactHeading', currentConfig.contact.title); setText('contactSubtitle', currentConfig.contact.subtitle); renderContact();
                setText('footerSchoolName', currentConfig.school.name); setText('footerDescription', currentConfig.footer.description); setText('footerBottomText', replaceTemplateSchoolNames(currentConfig.footer.bottomText, getSiteSchoolName())); renderSocial();
                if (options.refreshAdmin !== false) { fillConfigInputs(); renderAdminArrayEditors(); renderProspectusStatus(); }
            }
            function renderAboutCards() {
                const grid = $('aboutCards'); grid.innerHTML = '';
                (currentConfig.about.cards || []).forEach(card => {
                    const item = document.createElement('article'); item.className = 'card';
                    const icon = document.createElement('div'); icon.className = 'card__icon'; icon.textContent = card.icon || '•';
                    const title = document.createElement('h3'); title.className = 'card__title'; title.textContent = card.title || '';
                    const text = document.createElement('p'); text.className = 'card__text'; text.textContent = card.text || '';
                    item.append(icon, title, text); grid.appendChild(item);
                });
            }
            function renderPrincipal() {
                const wrap = $('principalSection'); wrap.innerHTML = '';
                const media = safeImageUrl(currentConfig.principal.photoUrl) ? document.createElement('img') : document.createElement('div');
                const principalPhotoUrl = safeImageUrl(currentConfig.principal.photoUrl);
                if (principalPhotoUrl) { media.src = principalPhotoUrl; media.alt = currentConfig.principal.name || 'Principal'; media.className = 'principal__photo'; } else { media.className = 'principal__placeholder'; media.textContent = 'Principal Photo'; }
                const body = document.createElement('div'); const label = document.createElement('div'); label.className = 'principal__label'; label.textContent = currentConfig.principal.title || 'Principal’s Welcome';
                const h = document.createElement('h3'); h.textContent = currentConfig.principal.name || 'The Principal';
                const p = document.createElement('p'); p.textContent = currentConfig.principal.message || '';
                body.append(label, h, p);
                if (currentConfig.principal.email || currentConfig.principal.phone) {
                    const contact = document.createElement('p');
                    contact.className = 'principal__contact';
                    contact.textContent = [currentConfig.principal.email, currentConfig.principal.phone].filter(Boolean).join(' • ');
                    body.appendChild(contact);
                }
                wrap.append(media, body);
            }
            function renderAcademics() {
                const grid = $('academicsGrid'); grid.innerHTML = '';
                (currentConfig.academics.cards || []).forEach(card => {
                    const item = document.createElement('article'); item.className = 'acad-card';
                    const icon = document.createElement('div'); icon.className = 'acad-card__icon'; icon.textContent = card.icon || '•';
                    const title = document.createElement('h3'); title.className = 'acad-card__title'; title.textContent = card.title || '';
                    const text = document.createElement('p'); text.className = 'acad-card__text'; text.textContent = card.text || '';
                    item.append(icon, title, text); grid.appendChild(item);
                });
            }
            function renderAdmissionsSteps() {
                const list = $('admissionsSteps'); list.innerHTML = '';
                (currentConfig.admissions.steps || []).forEach(step => {
                    const li = document.createElement('li'); const strong = document.createElement('strong'); strong.textContent = step.title || '';
                    li.append(strong, document.createTextNode(step.text || '')); list.appendChild(li);
                });
            }
            function renderContact() {
                const wrap = $('contactInfo'); wrap.innerHTML = '';
                const items = [ ['📍', 'Address', currentConfig.contact.address], ['☎️', 'Phone', currentConfig.contact.phone], ['✉️', 'Email', currentConfig.contact.email], ['💬', 'WhatsApp', currentConfig.contact.whatsapp] ];
                items.filter(item => item[2]).forEach(item => {
                    const row = document.createElement('div'); row.className = 'contact-info__item';
                    const icon = document.createElement('span'); icon.className = 'contact-info__icon'; icon.textContent = item[0];
                    const body = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = item[1]; body.append(strong, document.createElement('br'), document.createTextNode(String(item[2])));
                    row.append(icon, body); wrap.appendChild(row);
                });
                const mapUrl = normalizeGoogleMapsEmbedInput(currentConfig.contact.mapEmbedUrl);
                if (mapUrl) {
                    const iframe = document.createElement('iframe');
                    iframe.className = 'map-frame';
                    iframe.loading = 'lazy';
                    iframe.allowFullscreen = true;
                    iframe.referrerPolicy = 'no-referrer-when-downgrade';
                    iframe.title = 'Map showing ' + getSiteSchoolName() + ' location';
                    iframe.src = mapUrl;
                    wrap.appendChild(iframe);
                } else {
                    const map = document.createElement('div');
                    map.className = 'map-placeholder';
                    map.textContent = currentConfig.contact.mapEmbedUrl ? 'The saved Google Maps value is not a valid embed URL. Paste the full iframe code from Google Maps, Share, Embed a map.' : 'Google Maps embed can be added from the School Admin editor.';
                    wrap.appendChild(map);
                }
            }
            function renderSocial() {
                const wrap = $('footerSocial'); wrap.innerHTML = '';
                const labels = { facebook: 'Facebook', twitter: 'X', instagram: 'Instagram', youtube: 'YouTube' };
                Object.keys(labels).forEach(key => {
                    const url = safeImageUrl(currentConfig.social[key]);
                    if (!url || url.startsWith('#')) return;
                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.textContent = labels[key];
                    wrap.appendChild(a);
                });
            }
            async function initSupabase() {
                if (supabaseClient) return supabaseClient;
                if (!IS_RUNTIME_CONFIGURED) return null;
                if (window.SCHOOL_WEBSITE_DEPENDENCIES_READY) {
                    try { await window.SCHOOL_WEBSITE_DEPENDENCIES_READY; } catch (error) { /* handled below */ }
                }
                const url = TRUSTED_RUNTIME_CONFIG.supabase.url;
                const key = TRUSTED_RUNTIME_CONFIG.supabase.anonKey;
                if (!window.supabase || typeof window.supabase.createClient !== 'function' || !url || !key || !/^https:\/\/[a-z0-9]{8,}\.supabase\.co$/i.test(url)) return null;
                try {
                    supabaseClient = window.supabase.createClient(url, key, {
                        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
                        global: {
                            fetch: fetchWithTimeout,
                            headers: { 'x-application-name': 'school-website-master/' + APP_VERSION }
                        }
                    });
                    supabaseClient.auth.onAuthStateChange((event, session) => {
                        if (event === 'SIGNED_OUT') {
                            adminSession = null;
                            adminAccessVerified = false;
                            pendingAccessCode = '';
                            showSignedOutAdminState();
                        }
                    });
                } catch (error) {
                    supabaseClient = null;
                    console.warn('Supabase initialization failed.', error);
                }
                return supabaseClient;
            }
            async function loadSettings() {
                if (!IS_RUNTIME_CONFIGURED) { settingsLoadStatus = 'unconfigured'; return false; }
                await initSupabase();
                if (!supabaseClient) {
                    settingsLoadStatus = 'unavailable';
                    return false;
                }
                try {
                    const { data, error } = await supabaseClient.from('school_website_settings').select('config_json').eq('site_key', currentConfig.settingsKey).maybeSingle();
                    if (error) throw error;
                    if (data && data.config_json) {
                        currentConfig = mergePublicConfig(data.config_json);
                        settingsLoadStatus = 'loaded';
                    } else {
                        currentConfig = applyTrustedRuntimeConfig(clone(DEFAULT_CONFIG));
                        settingsLoadStatus = 'missing';
                    }
                    syncSocialPreviewDefaults();
                    return true;
                } catch (e) {
                    currentConfig = applyTrustedRuntimeConfig(clone(DEFAULT_CONFIG));
                    settingsLoadStatus = 'error';
                    console.warn('Website settings could not be loaded; safe local defaults are being used.');
                    return false;
                }
            }
            async function saveSettings() {
                if (!IS_RUNTIME_CONFIGURED) { adminMessage('Run the master configuration tool before saving website settings.', 'error'); return; }
                if (!supabaseClient || !adminSession) { adminMessage('Please login as School Admin before saving.', 'error'); return; }
                if (['not_loaded', 'unavailable', 'error'].includes(settingsLoadStatus)) {
                    adminMessage('Live website settings were not loaded successfully. Use Refresh and confirm the current settings before saving, to avoid overwriting production data.', 'error');
                    return;
                }
                if (currentConfig.contact && currentConfig.contact.mapEmbedUrl) {
                    const normalizedMapUrl = normalizeGoogleMapsEmbedInput(currentConfig.contact.mapEmbedUrl);
                    if (!normalizedMapUrl) {
                        adminMessage('Google Maps value is not valid. Please paste the full iframe code from Google Maps: Share > Embed a map > Copy HTML.', 'error');
                        return;
                    }
                    currentConfig.contact.mapEmbedUrl = normalizedMapUrl;
                    const mapInput = document.querySelector('[data-config-path="contact.mapEmbedUrl"]');
                    if (mapInput) mapInput.value = normalizedMapUrl;
                }
                syncEstablishedText();
                syncSocialPreviewDefaults();
                currentConfig = applyTrustedRuntimeConfig(currentConfig);
                const persistableConfig = getPersistableConfig();
                const serializedConfig = JSON.stringify(persistableConfig);
                if (new TextEncoder().encode(serializedConfig).length > 500000) { adminMessage('Website settings are too large. Remove some slideshow or content entries before saving.', 'error'); return; }
                const payload = { site_key: TRUSTED_RUNTIME_CONFIG.settingsKey, config_json: persistableConfig, updated_at: new Date().toISOString(), updated_by: adminSession.user.id };
                try {
                    const { error } = await supabaseClient.from('school_website_settings').upsert(payload, { onConflict: 'site_key' });
                    if (error) throw error;
                    settingsLoadStatus = 'loaded';
                    renderSite();
                    adminMessage('Website settings saved successfully.');
                } catch (error) {
                    adminMessage('Settings could not be saved: ' + (error && error.message ? error.message : 'Network or server error.'), 'error');
                }
            }
            async function loadEventsPublic() {
                let records = currentConfig.events.fallback || [];
                let unavailable = !supabaseClient;
                if (supabaseClient) {
                    try {
                        const today = getLocalIsoDate();
                        const { data, error } = await supabaseClient.from('events').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).eq('is_active', true).gte('event_date', today).order('event_date', { ascending: true }).order('sort_order', { ascending: true });
                        if (error) throw error;
                        if (Array.isArray(data)) records = data.map(e => ({ title: e.title, date: e.event_date, description: e.description, image_url: e.image_url }));
                    } catch (error) { unavailable = true; console.warn('Events could not be loaded.'); }
                }
                renderEvents(records, unavailable);
                return !unavailable;
            }
            function renderEvents(records, unavailable = false) {
                const grid = $('eventsGrid'); grid.innerHTML = '';
                (records || []).forEach((event, index) => {
                    const card = document.createElement('article'); card.className = 'event-card';
                    const eventImageUrl = safeImageUrl(event.image_url);
                    if (eventImageUrl) { const img = document.createElement('img'); img.className = 'event-card__image'; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.src = eventImageUrl; img.alt = event.title || 'Event image'; card.appendChild(img); }
                    const d = new Date((event.date || event.event_date || '') + 'T00:00:00');
                    const badge = document.createElement('div'); badge.className = 'event-card__date-badge';
                    const badgeColor = index % 2 ? safeThemeColor(currentConfig.theme.accent, DEFAULT_CONFIG.theme.accent) : safeThemeColor(currentConfig.theme.primary, DEFAULT_CONFIG.theme.primary);
                    badge.style.background = badgeColor; badge.style.color = readableForeground(badgeColor);
                    const day = document.createElement('div'); day.className = 'event-card__day'; day.textContent = Number.isNaN(d.getTime()) ? '--' : String(d.getDate()).padStart(2, '0');
                    const month = document.createElement('div'); month.className = 'event-card__month'; month.textContent = Number.isNaN(d.getTime()) ? '' : d.toLocaleString(undefined, { month: 'short' });
                    badge.append(day, month);
                    const body = document.createElement('div'); body.className = 'event-card__body'; const title = document.createElement('h3'); title.className = 'event-card__title'; title.textContent = event.title || '';
                    const desc = document.createElement('p'); desc.className = 'event-card__desc'; desc.textContent = event.description || '';
                    body.append(title, desc); card.append(badge, body); grid.appendChild(card);
                });
                if (!(records || []).length) renderEmptyState(grid, unavailable ? 'Events are temporarily unavailable. Please try again later.' : 'No upcoming events have been published yet.');
            }
            function legacyGalleryRecordsToAlbums(records) {
                return (records || []).map((item, index) => {
                    const url = safeImageUrl(item.image_url || item.url);
                    return {
                        id: item.id || ('legacy-' + index),
                        title: item.title || ('Gallery Album ' + (index + 1)),
                        description: '',
                        cover_image_url: url,
                        cover_alt_text: item.alt_text || item.title || 'Gallery album cover',
                        is_active: item.is_active !== false,
                        sort_order: toSafeSortOrder(item.sort_order || index),
                        slideshow_interval_seconds: 5,
                        images: url ? [{ id: item.id || ('legacy-image-' + index), album_id: item.id || ('legacy-' + index), image_url: url, caption: item.title || '', alt_text: item.alt_text || item.title || 'Gallery image', is_active: item.is_active !== false, sort_order: toSafeSortOrder(item.sort_order || index) }] : []
                    };
                });
            }
            async function loadGalleryPublic() {
                let albums = legacyGalleryRecordsToAlbums(currentConfig.gallery.fallback || []);
                let unavailable = !supabaseClient;
                if (supabaseClient) {
                    try {
                        const albumResult = await supabaseClient.from('gallery_albums').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).eq('is_active', true).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
                        if (albumResult.error) throw albumResult.error;
                        const imageResult = await supabaseClient.from('gallery_images').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).eq('is_active', true).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
                        if (imageResult.error) throw imageResult.error;
                        const images = Array.isArray(imageResult.data) ? imageResult.data : [];
                        albums = (Array.isArray(albumResult.data) ? albumResult.data : []).map(album => ({ ...album, images: images.filter(image => image.album_id === album.id) }));
                        unavailable = false;
                    } catch (error) {
                        try {
                            const legacyResult = await supabaseClient.from('gallery').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).eq('is_active', true).order('sort_order', { ascending: true });
                            if (legacyResult.error) throw legacyResult.error;
                            albums = legacyGalleryRecordsToAlbums(legacyResult.data || []);
                            unavailable = false;
                            console.warn('Gallery album tables are not installed yet. Legacy gallery records were displayed. Run the v2.3.0 gallery migration before using Gallery Admin.');
                        } catch (legacyError) {
                            unavailable = true;
                            console.warn('Gallery albums could not be loaded.', error);
                        }
                    }
                }
                renderGalleryAlbums(albums, unavailable);
                return !unavailable;
            }
            function galleryAlbumImages(album) {
                const valid = (album && Array.isArray(album.images) ? album.images : []).map(image => ({
                    ...image,
                    image_url: safeImageUrl(image.image_url || image.url),
                    alt_text: cleanText(image.alt_text || image.caption || album.title || 'Gallery image'),
                    caption: cleanText(image.caption || '')
                })).filter(image => image.image_url);
                if (!valid.length) {
                    const cover = safeImageUrl(album && album.cover_image_url);
                    if (cover) valid.push({ id: 'cover-only-' + (album.id || ''), image_url: cover, alt_text: cleanText(album.cover_alt_text || album.title || 'Gallery album cover'), caption: cleanText(album.title || '') });
                }
                return valid;
            }
            function prefersReducedMotion() {
                return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
            }
            function galleryCardSlides(album, images) {
                const slides = [];
                const seen = new Set();
                const coverUrl = safeImageUrl(album && album.cover_image_url);
                if (coverUrl) {
                    slides.push({ image_url: coverUrl, alt_text: cleanText(album.cover_alt_text || album.title || 'Gallery album cover'), caption: cleanText(album.title || '') });
                    seen.add(coverUrl);
                }
                (images || []).forEach(image => {
                    const url = safeImageUrl(image.image_url);
                    if (!url || seen.has(url)) return;
                    slides.push(image);
                    seen.add(url);
                });
                return slides.length ? slides : images;
            }
            function stopGalleryCardTimer(state) {
                if (state && state.timer) clearTimeout(state.timer);
                if (state) state.timer = null;
            }
            function galleryCardsBlockedByModal() {
                return Boolean(($('lightbox') && $('lightbox').classList.contains('active')) || ($('adminModal') && $('adminModal').classList.contains('active')));
            }
            function canRunGalleryCardSlideshow(state) {
                return Boolean(state && document.body.contains(state.card) && state.slides.length > 1 && !state.userPaused && !state.hoverPaused && !state.focusPaused && state.inViewport && !document.hidden && !galleryCardsBlockedByModal());
            }
            function updateGalleryCardControl(state) {
                if (!state || !state.control) return;
                const title = state.albumTitle || 'gallery album';
                if (state.userPaused) {
                    state.control.textContent = '▶';
                    state.control.setAttribute('aria-label', 'Play automatic slideshow for ' + title);
                    state.control.title = 'Play automatic slideshow';
                    state.control.setAttribute('aria-pressed', 'true');
                } else {
                    state.control.textContent = 'Ⅱ';
                    state.control.setAttribute('aria-label', 'Pause automatic slideshow for ' + title);
                    state.control.title = 'Pause automatic slideshow';
                    state.control.setAttribute('aria-pressed', 'false');
                }
            }
            function scheduleGalleryCardSlideshow(state) {
                stopGalleryCardTimer(state);
                updateGalleryCardControl(state);
                if (!canRunGalleryCardSlideshow(state)) return;
                const delay = state.hasAdvanced ? state.intervalMs : state.intervalMs + state.initialOffsetMs;
                state.timer = setTimeout(() => {
                    state.timer = null;
                    advanceGalleryCardSlideshow(state);
                }, delay);
            }
            function advanceGalleryCardSlideshow(state) {
                if (!canRunGalleryCardSlideshow(state) || state.transitioning) { scheduleGalleryCardSlideshow(state); return; }
                const nextIndex = (state.index + 1) % state.slides.length;
                const nextSlide = state.slides[nextIndex];
                state.transitioning = true;
                const preloader = new Image();
                preloader.referrerPolicy = 'no-referrer';
                preloader.onload = () => {
                    if (!document.body.contains(state.card)) {
                        state.transitioning = false;
                        stopGalleryCardTimer(state);
                        return;
                    }
                    if (!canRunGalleryCardSlideshow(state)) {
                        state.transitioning = false;
                        scheduleGalleryCardSlideshow(state);
                        return;
                    }
                    state.inactiveImage.src = nextSlide.image_url;
                    state.inactiveImage.alt = nextSlide.alt_text || state.albumTitle || 'Gallery image';
                    requestAnimationFrame(() => {
                        state.inactiveImage.classList.add('is-active');
                        state.activeImage.classList.remove('is-active');
                        const previous = state.activeImage;
                        state.activeImage = state.inactiveImage;
                        state.inactiveImage = previous;
                        state.index = nextIndex;
                        state.hasAdvanced = true;
                        setTimeout(() => {
                            state.transitioning = false;
                            scheduleGalleryCardSlideshow(state);
                        }, 700);
                    });
                };
                preloader.onerror = () => {
                    state.transitioning = false;
                    state.hasAdvanced = true;
                    if (document.body.contains(state.card)) scheduleGalleryCardSlideshow(state);
                };
                preloader.src = nextSlide.image_url;
            }
            function syncGalleryCardSlideshows() {
                galleryCardSlideshows.forEach(scheduleGalleryCardSlideshow);
            }
            function stopGalleryCardSlideshows() {
                galleryCardSlideshows.forEach(stopGalleryCardTimer);
                galleryCardSlideshows = [];
                if (galleryCardObserver) galleryCardObserver.disconnect();
                galleryCardObserver = null;
            }
            function renderGalleryAlbums(albums, unavailable = false) {
                stopGalleryCardSlideshows();
                const grid = $('galleryGrid');
                grid.innerHTML = '';
                const safeAlbums = (albums || []).map(album => ({ album, images: galleryAlbumImages(album) })).filter(entry => entry.images.length);
                if ('IntersectionObserver' in window) {
                    galleryCardObserver = new IntersectionObserver(entries => {
                        entries.forEach(entry => {
                            const state = galleryCardSlideshows.find(item => item.card === entry.target);
                            if (!state) return;
                            state.inViewport = entry.isIntersecting && entry.intersectionRatio >= 0.15;
                            scheduleGalleryCardSlideshow(state);
                        });
                    }, { threshold: [0, 0.15, 0.5] });
                }
                safeAlbums.forEach(({ album, images }, albumIndex) => {
                    const slides = galleryCardSlides(album, images);
                    const card = document.createElement('article');
                    card.className = 'gallery-album-card';
                    const openLink = document.createElement('a');
                    openLink.className = 'gallery-album-card__open';
                    openLink.href = '#gallery';
                    openLink.setAttribute('aria-label', 'Open ' + (album.title || 'gallery album') + ', ' + images.length + ' photo' + (images.length === 1 ? '' : 's'));
                    const imageWrap = document.createElement('div'); imageWrap.className = 'gallery-album-card__image-wrap';
                    const firstSlide = slides[0];
                    const firstImg = document.createElement('img'); firstImg.className = 'gallery-album-card__slide is-active'; firstImg.loading = 'lazy'; firstImg.referrerPolicy = 'no-referrer'; firstImg.src = firstSlide.image_url; firstImg.alt = firstSlide.alt_text || album.title || 'Gallery album cover';
                    const secondImg = document.createElement('img'); secondImg.className = 'gallery-album-card__slide'; secondImg.loading = 'lazy'; secondImg.referrerPolicy = 'no-referrer'; secondImg.alt = '';
                    const count = document.createElement('span'); count.className = 'gallery-album-card__count'; count.textContent = images.length + ' photo' + (images.length === 1 ? '' : 's');
                    imageWrap.append(firstImg, secondImg, count);
                    const body = document.createElement('div'); body.className = 'gallery-album-card__body';
                    const title = document.createElement('h3'); title.textContent = album.title || 'Gallery Album';
                    body.appendChild(title);
                    if (album.description) { const desc = document.createElement('p'); desc.textContent = album.description; body.appendChild(desc); }
                    const action = document.createElement('span'); action.className = 'gallery-album-card__action'; action.textContent = images.length > 1 ? 'Open full slideshow' : 'View photo'; body.appendChild(action);
                    openLink.append(imageWrap, body);
                    card.appendChild(openLink);
                    const open = event => { if (event) event.preventDefault(); openGalleryAlbum({ ...album, images }); };
                    openLink.addEventListener('click', open);
                    grid.appendChild(card);
                    if (slides.length > 1) {
                        const control = document.createElement('button');
                        control.type = 'button';
                        control.className = 'gallery-album-card__autoplay';
                        card.appendChild(control);
                        const state = {
                            card,
                            control,
                            albumTitle: cleanText(album.title || 'Gallery Album'),
                            slides,
                            index: 0,
                            activeImage: firstImg,
                            inactiveImage: secondImg,
                            intervalMs: Math.min(60, Math.max(2, Number(album.slideshow_interval_seconds || 5) || 5)) * 1000,
                            initialOffsetMs: Math.min(1800, albumIndex * 350),
                            hasAdvanced: false,
                            transitioning: false,
                            timer: null,
                            inViewport: !galleryCardObserver,
                            hoverPaused: false,
                            focusPaused: false,
                            userPaused: prefersReducedMotion()
                        };
                        control.addEventListener('click', event => {
                            event.preventDefault();
                            event.stopPropagation();
                            state.userPaused = !state.userPaused;
                            scheduleGalleryCardSlideshow(state);
                        });
                        card.addEventListener('mouseenter', () => { state.hoverPaused = true; scheduleGalleryCardSlideshow(state); });
                        card.addEventListener('mouseleave', () => { state.hoverPaused = false; scheduleGalleryCardSlideshow(state); });
                        card.addEventListener('focusin', () => { state.focusPaused = true; scheduleGalleryCardSlideshow(state); });
                        card.addEventListener('focusout', event => {
                            if (card.contains(event.relatedTarget)) return;
                            state.focusPaused = false;
                            scheduleGalleryCardSlideshow(state);
                        });
                        galleryCardSlideshows.push(state);
                        updateGalleryCardControl(state);
                        if (galleryCardObserver) galleryCardObserver.observe(card);
                        else scheduleGalleryCardSlideshow(state);
                    }
                });
                if (!safeAlbums.length) renderEmptyState(grid, unavailable ? 'The gallery is temporarily unavailable. Please try again later.' : 'Gallery albums will appear here after they are published.');
            }
            async function loadNewsPublic() {
                let records = currentConfig.announcements.fallback || [];
                let unavailable = !supabaseClient;
                if (supabaseClient) {
                    try {
                        const { data, error } = await supabaseClient.from('announcements').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).eq('is_active', true).order('publish_date', { ascending: false }).order('sort_order', { ascending: true });
                        if (error) throw error;
                        if (Array.isArray(data)) records = data;
                    } catch (error) { unavailable = true; console.warn('Announcements could not be loaded.'); }
                }
                renderNews(records, unavailable);
                return !unavailable;
            }
            function renderNews(records, unavailable = false) {
                const grid = $('newsGrid'); grid.innerHTML = '';
                (records || []).forEach(item => {
                    const card = document.createElement('article'); card.className = 'news-card';
                    const newsImageUrl = safeImageUrl(item.image_url);
                    if (newsImageUrl) { const img = document.createElement('img'); img.className = 'news-card__image'; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.src = newsImageUrl; img.alt = item.title || 'Announcement image'; card.appendChild(img); }
                    const body = document.createElement('div'); body.className = 'news-card__body'; const date = document.createElement('div'); date.className = 'news-card__date'; date.textContent = formatDate(item.publish_date);
                    const title = document.createElement('h3'); title.className = 'news-card__title'; title.textContent = item.title || '';
                    const desc = document.createElement('p'); desc.className = 'news-card__desc'; desc.textContent = item.body || item.description || '';
                    body.append(date, title, desc); card.appendChild(body); grid.appendChild(card);
                });
                if (!(records || []).length) renderEmptyState(grid, unavailable ? 'Announcements are temporarily unavailable. Please try again later.' : 'No announcements have been published yet.');
            }
            async function submitEnquiry(formEl, type, successEl, errorEl) {
                hide(successEl);
                const defaultErrorMessage = type === 'admissions'
                    ? 'Unable to submit your enquiry. Please try again.'
                    : 'Unable to send your message. Please try again.';
                if (errorEl) errorEl.textContent = defaultErrorMessage;
                if (!IS_RUNTIME_CONFIGURED) { show(errorEl); return; } hide(errorEl);
                if (!formEl.checkValidity()) { formEl.reportValidity(); show(errorEl); return; }
                const data = new FormData(formEl);
                if (String(data.get('website') || '').trim() || Date.now() < formReadyAt) { show(errorEl); return; }
                const email = String(data.get('email') || '').trim().slice(0, 254);
                const payload = {
                    type,
                    email,
                    phone: String(data.get('phone') || '').trim().slice(0, 40) || null,
                    message: String(data.get('message') || '').trim().slice(0, 5000) || null,
                    name: String(data.get('name') || '').trim().slice(0, 160) || null,
                    parent_name: String(data.get('parent_name') || '').trim().slice(0, 160) || null,
                    student_name: String(data.get('student_name') || '').trim().slice(0, 160) || null,
                    subject: String(data.get('subject') || '').trim().slice(0, 240) || null,
                    status: 'new', is_read: false
                };
                const submitButton = formEl.querySelector('[type="submit"]');
                const originalText = submitButton ? submitButton.textContent : '';
                if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Submitting…'; }
                try {
                    await initSupabase();
                    if (!supabaseClient) throw new Error('Backend unavailable');
                    const { data: result, error } = await supabaseClient.rpc('submit_school_website_enquiry', {
                        p_type: payload.type,
                        p_email: payload.email,
                        p_phone: payload.phone,
                        p_message: payload.message,
                        p_name: payload.name,
                        p_parent_name: payload.parent_name,
                        p_student_name: payload.student_name,
                        p_subject: payload.subject
                    });
                    if (error) throw error;
                    if (!result || result.ok !== true) throw new Error((result && result.message) || 'Submission rejected');
                    formEl.reset();
                    formReadyAt = Date.now() + 1200;
                    show(successEl);
                } catch (e) {
                    const rawMessage = e && typeof e.message === 'string' ? e.message.trim() : '';
                    if (errorEl) {
                        if (/Backend unavailable|Failed to fetch|NetworkError|Load failed|AbortError/i.test(rawMessage)) {
                            errorEl.textContent = 'The enquiry service is temporarily unavailable. Please try again later or contact the school directly.';
                        } else if (rawMessage && rawMessage.length <= 240 && !/^Submission rejected$/i.test(rawMessage)) {
                            errorEl.textContent = rawMessage;
                        } else {
                            errorEl.textContent = defaultErrorMessage;
                        }
                    }
                    show(errorEl);
                } finally {
                    if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalText; }
                }
            }
            function fillConfigInputs() {
                document.querySelectorAll('[data-config-path]').forEach(input => {
                    const value = getPath(currentConfig, input.dataset.configPath);
                    if (input.type === 'color') input.value = value || '#000000'; else input.value = value || '';
                });
            }
            function bindConfigInputs() {
                document.querySelectorAll('[data-config-path]').forEach(input => {
                    input.addEventListener('input', () => {
                        const configPath = input.dataset.configPath;
                        setPath(currentConfig, configPath, input.value);
                        if (configPath === 'school.establishedText') {
                            setPath(currentConfig, 'hero.tag', input.value);
                        } else if (configPath === 'hero.tag') {
                            setPath(currentConfig, 'school.establishedText', input.value);
                        }
                        if (['school.name', 'school.motto', 'hero.subtitle', 'school.establishedText', 'hero.tag'].includes(configPath)) {
                            syncSocialPreviewDefaults();
                            refreshSeoInputs();
                        }
                        renderSite({ refreshAdmin: false });
                    });
                    if (input.dataset.configPath === 'contact.mapEmbedUrl') {
                        input.addEventListener('blur', () => {
                            const normalizedMapUrl = normalizeGoogleMapsEmbedInput(input.value);
                            if (normalizedMapUrl) {
                                input.value = normalizedMapUrl;
                                setPath(currentConfig, input.dataset.configPath, normalizedMapUrl);
                                renderSite();
                            }
                        });
                    }
                });
            }
            function renderAdminArrayEditors() {
                renderArrayEditor('aboutCardsAdmin', currentConfig.about.cards, 'about.cards', ['icon','title','text']);
                renderArrayEditor('academicsAdmin', currentConfig.academics.cards, 'academics.cards', ['icon','title','text']);
                renderArrayEditor('admissionsStepsAdmin', currentConfig.admissions.steps, 'admissions.steps', ['title','text']);
                renderHeroSlidesAdmin();
            }
            function renderArrayEditor(containerId, array, basePath, fields) {
                const container = $(containerId); if (!container) return; container.innerHTML = '';
                (array || []).forEach((item, index) => {
                    const card = document.createElement('div'); card.className = 'admin-list-item';
                    const grid = document.createElement('div'); grid.className = 'admin-grid';
                    fields.forEach(field => {
                        const wrap = document.createElement('div'); wrap.className = field === 'text' ? 'admin-field admin-field--full' : 'admin-field';
                        const inputId = containerId + '-' + index + '-' + field;
                        const label = document.createElement('label'); label.htmlFor = inputId; label.textContent = field.charAt(0).toUpperCase() + field.slice(1);
                        const input = field === 'text' ? document.createElement('textarea') : document.createElement('input'); input.id = inputId; if (field === 'text') input.rows = 3; input.value = item[field] || '';
                        input.addEventListener('input', () => { item[field] = input.value; renderSite({ refreshAdmin: false }); });
                        wrap.append(label, input); grid.appendChild(wrap);
                    });
                    const actions = document.createElement('div'); actions.className = 'admin-actions'; const remove = document.createElement('button'); remove.className = 'btn btn--danger btn--sm'; remove.type = 'button'; remove.textContent = 'Remove'; remove.addEventListener('click', () => { array.splice(index, 1); renderSite(); }); actions.appendChild(remove); card.append(grid, actions); container.appendChild(card);
                });
            }
            function renderProspectusStatus() {
                const status = $('prospectusUploadStatus');
                if (!status) return;
                const fileName = currentConfig.admissions.prospectusFileName || '';
                const uploadedAt = currentConfig.admissions.prospectusUploadedAt || '';
                const url = safeImageUrl(currentConfig.admissions.prospectusUrl || '');
                if (fileName && url && !url.startsWith('#')) {
                    status.textContent = 'Current public prospectus: ' + fileName + (uploadedAt ? ' | Uploaded: ' + uploadedAt : '') + '. Public visitors can download it from the Admissions section.';
                } else {
                    status.textContent = 'No active prospectus file has been uploaded yet. Upload a PDF or DOCX to activate the public Download Prospectus button.';
                }
            }
            function renderHeroSlidesAdmin() {
                const wrap = $('heroSlidesAdmin');
                if (!wrap) return;
                if (!Array.isArray(currentConfig.hero.backgroundImages)) currentConfig.hero.backgroundImages = [];
                wrap.innerHTML = '';
                if (!currentConfig.hero.backgroundImages.length) {
                    const note = document.createElement('p');
                    note.className = 'admin-note';
                    note.textContent = 'No slideshow images added yet. Upload multiple slide images or add the single hero background URL.';
                    wrap.appendChild(note);
                    return;
                }
                currentConfig.hero.backgroundImages.forEach((item, index) => {
                    const url = typeof item === 'string' ? item : item.url;
                    const row = document.createElement('div'); row.className = 'media-list-item';
                    const imageUrl = safeImageUrl(url);
                    const img = imageUrl ? document.createElement('img') : document.createElement('div');
                    if (imageUrl) { img.src = imageUrl; img.alt = 'Hero slide ' + (index + 1); }
                    else { img.className = 'media-list-placeholder'; img.textContent = 'Invalid image URL'; }
                    const info = document.createElement('div'); const label = document.createElement('strong'); label.textContent = 'Slide ' + (index + 1); const urlText = document.createElement('div'); urlText.className = 'media-list-url'; urlText.textContent = url || ''; info.append(label, urlText);
                    const actions = document.createElement('div'); actions.className = 'admin-actions';
                    const up = document.createElement('button'); up.className = 'btn btn--secondary btn--sm'; up.type = 'button'; up.textContent = 'Up'; up.disabled = index === 0; up.addEventListener('click', () => { const arr = currentConfig.hero.backgroundImages; [arr[index-1], arr[index]] = [arr[index], arr[index-1]]; renderSite(); });
                    const down = document.createElement('button'); down.className = 'btn btn--secondary btn--sm'; down.type = 'button'; down.textContent = 'Down'; down.disabled = index === currentConfig.hero.backgroundImages.length - 1; down.addEventListener('click', () => { const arr = currentConfig.hero.backgroundImages; [arr[index+1], arr[index]] = [arr[index], arr[index+1]]; renderSite(); });
                    const remove = document.createElement('button'); remove.className = 'btn btn--danger btn--sm'; remove.type = 'button'; remove.textContent = 'Remove'; remove.addEventListener('click', () => { currentConfig.hero.backgroundImages.splice(index, 1); renderSite(); });
                    actions.append(up, down, remove); row.append(img, info, actions); wrap.appendChild(row);
                });
            }
            function addSingleHeroUrlToSlideshow() {
                const url = safeUrl(currentConfig.hero.backgroundImageUrl || '');
                if (!url) { adminMessage('Enter or upload a single hero image URL first.', 'error'); return; }
                if (!Array.isArray(currentConfig.hero.backgroundImages)) currentConfig.hero.backgroundImages = [];
                if (!currentConfig.hero.backgroundImages.some(item => (typeof item === 'string' ? item : item.url) === url)) {
                    currentConfig.hero.backgroundImages.push({ url });
                }
                renderSite();
                adminMessage('Hero image added to slideshow. Click Save Website Settings to keep it.');
            }
            async function readFilePrefix(file, length = 16) {
                try { return new Uint8Array(await file.slice(0, length).arrayBuffer()); }
                catch (error) { return new Uint8Array(); }
            }
            function bytesMatch(bytes, expected, offset = 0) {
                return expected.every((value, index) => bytes[offset + index] === value);
            }
            async function isAllowedImageFile(file) {
                if (!file || file.size <= 0 || file.size > 10 * 1024 * 1024) return false;
                const type = String(file.type || '').toLowerCase();
                const name = String(file.name || '');
                const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
                const allowedExtensions = /\.(jpe?g|png|webp|gif)$/i;
                if (!allowedTypes.has(type) || !allowedExtensions.test(name)) return false;
                const bytes = await readFilePrefix(file, 16);
                if (type === 'image/jpeg') return bytesMatch(bytes, [0xFF, 0xD8, 0xFF]);
                if (type === 'image/png') return bytesMatch(bytes, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
                if (type === 'image/gif') return bytesMatch(bytes, [0x47, 0x49, 0x46, 0x38]) && (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61;
                if (type === 'image/webp') return bytesMatch(bytes, [0x52, 0x49, 0x46, 0x46]) && bytesMatch(bytes, [0x57, 0x45, 0x42, 0x50], 8);
                return false;
            }
            function createUploadPath(file, folder = 'uploads') {
                const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
                const cleanName = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'image';
                const token = window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2, 10);
                return folder + '/' + new Date().getFullYear() + '/' + token + '-' + cleanName + '.' + ext;
            }
            function extractManagedStoragePath(publicUrl) {
                try {
                    const parsed = new URL(String(publicUrl || ''));
                    if (parsed.origin !== new URL(TRUSTED_RUNTIME_CONFIG.supabase.url).origin) return '';
                    const marker = '/storage/v1/object/public/' + encodeURIComponent(currentConfig.storageBucket) + '/';
                    const rawMarker = '/storage/v1/object/public/' + currentConfig.storageBucket + '/';
                    const markerIndex = parsed.pathname.indexOf(marker) >= 0 ? parsed.pathname.indexOf(marker) + marker.length : parsed.pathname.indexOf(rawMarker) >= 0 ? parsed.pathname.indexOf(rawMarker) + rawMarker.length : -1;
                    if (markerIndex < 0) return '';
                    const path = decodeURIComponent(parsed.pathname.slice(markerIndex));
                    if (!/^(uploads|prospectus)\//.test(path) || path.includes('..')) return '';
                    return path;
                } catch (error) { return ''; }
            }
            async function removeManagedStorageAssets(urls) {
                if (!supabaseClient || !adminSession) return;
                const paths = [...new Set((Array.isArray(urls) ? urls : [urls]).map(extractManagedStoragePath).filter(Boolean))];
                if (!paths.length) return;
                try {
                    const { error } = await supabaseClient.storage.from(currentConfig.storageBucket).remove(paths);
                    if (error) console.warn('Orphaned storage files could not be removed.', error);
                } catch (error) { console.warn('Storage cleanup failed.', error); }
            }
            async function uploadMultipleFiles(fileInputId) {
                if (!supabaseClient || !adminSession) { adminMessage('Please login before uploading images.', 'error'); return []; }
                const input = $(fileInputId);
                const selectedFiles = input && input.files ? Array.from(input.files) : [];
                if (selectedFiles.length > 20) adminMessage('Only the first 20 selected images will be uploaded in one batch.', 'error');
                const files = selectedFiles.slice(0, 20);
                if (!files.length) { adminMessage('Select one or more image files first.', 'error'); return []; }
                const urls = [];
                for (const file of files) {
                    if (!(await isAllowedImageFile(file))) { adminMessage('Skipped ' + file.name + ': use a valid JPG, PNG, WEBP, or GIF file up to 10MB.', 'error'); continue; }
                    const path = createUploadPath(file);
                    const uploadResult = await runAdminRequest(
                        () => supabaseClient.storage.from(currentConfig.storageBucket).upload(path, file, { cacheControl: '3600', upsert: false }),
                        'Upload failed for ' + file.name
                    );
                    if (!uploadResult) continue;
                    const { data } = supabaseClient.storage.from(currentConfig.storageBucket).getPublicUrl(path);
                    const publicUrl = data && safeImageUrl(data.publicUrl);
                    if (publicUrl) urls.push(publicUrl);
                    else { await removeManagedStorageAssets([TRUSTED_RUNTIME_CONFIG.supabase.url + '/storage/v1/object/public/' + currentConfig.storageBucket + '/' + path]); adminMessage('Upload completed for ' + file.name + ', but no safe public URL was returned. The orphaned file was removed.', 'error'); }
                }
                input.value = '';
                return urls;
            }
            async function uploadHeroSlides() {
                const urls = await uploadMultipleFiles('heroSlidesUpload');
                if (!urls.length) return;
                if (!Array.isArray(currentConfig.hero.backgroundImages)) currentConfig.hero.backgroundImages = [];
                urls.forEach(url => currentConfig.hero.backgroundImages.push({ url }));
                if (!currentConfig.seo.ogImage && urls[0]) currentConfig.seo.ogImage = urls[0];
                renderSite();
                adminMessage(urls.length + ' homepage slideshow image(s) uploaded. Click Save Website Settings to keep them.');
            }
            async function uploadMultipleGalleryImages() {
                if (!supabaseClient || !adminSession) { adminMessage('Login required.', 'error'); return; }
                if (!selectedGalleryAlbumId) { adminMessage('Select an album with Manage Images before uploading multiple images.', 'error'); return; }
                const album = galleryAlbumsCache.find(item => item.id === selectedGalleryAlbumId);
                if (!album) { adminMessage('The selected gallery album no longer exists. Refresh Gallery and try again.', 'error'); return; }
                const selectedImages = galleryImagesCache.filter(image => image.album_id === selectedGalleryAlbumId);
                const currentMax = selectedImages.length ? Math.max(...selectedImages.map(image => toSafeSortOrder(image.sort_order, 0))) : -1;
                const urls = await uploadMultipleFiles('galleryMultipleUpload');
                if (!urls.length) return;
                const startOrder = currentMax > 2147483647 - urls.length ? 0 : currentMax + 1;
                const records = urls.map((url, index) => ({
                    site_key: TRUSTED_RUNTIME_CONFIG.settingsKey,
                    album_id: selectedGalleryAlbumId,
                    caption: album.title + ' ' + (selectedImages.length + index + 1),
                    alt_text: album.title + ' image ' + (selectedImages.length + index + 1),
                    image_url: url,
                    is_active: true,
                    sort_order: toSafeSortOrder(startOrder + index)
                }));
                const saveResult = await runAdminRequest(() => supabaseClient.from('gallery_images').insert(records), 'Gallery album images could not be saved');
                if (!saveResult) { await removeManagedStorageAssets(urls); return; }
                if (!safeImageUrl(album.cover_image_url) && urls[0]) {
                    await runAdminRequest(() => supabaseClient.from('gallery_albums').update({ cover_image_url: urls[0], cover_alt_text: album.title + ' cover image' }).eq('id', album.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Album cover could not be assigned');
                }
                adminMessage(urls.length + ' image(s) uploaded into ' + album.title + '.');
                await loadGalleryAdmin();
                await loadGalleryPublic();
            }

            async function uploadAsset(fileInputId, targetPathOrInputId) {
                if (!supabaseClient || !adminSession) { adminMessage('Please login before uploading images.', 'error'); return ''; }
                const input = $(fileInputId); const file = input && input.files && input.files[0];
                if (!file) { adminMessage('Select an image file first.', 'error'); return ''; }
                if (!(await isAllowedImageFile(file))) { adminMessage('Use a valid JPG, PNG, WEBP, or GIF image up to 10MB.', 'error'); return ''; }
                const path = createUploadPath(file);
                const uploadResult = await runAdminRequest(
                    () => supabaseClient.storage.from(currentConfig.storageBucket).upload(path, file, { cacheControl: '3600', upsert: false }),
                    'Upload failed'
                );
                if (!uploadResult) return '';
                const { data } = supabaseClient.storage.from(currentConfig.storageBucket).getPublicUrl(path);
                const url = data && safeImageUrl(data.publicUrl);
                if (!url) { await removeManagedStorageAssets([TRUSTED_RUNTIME_CONFIG.supabase.url + '/storage/v1/object/public/' + currentConfig.storageBucket + '/' + path]); adminMessage('Upload completed, but a safe public URL was not returned. The orphaned file was removed.', 'error'); return ''; }
                if (targetPathOrInputId && targetPathOrInputId.includes('.')) {
                    setPath(currentConfig, targetPathOrInputId, url);
                    if (targetPathOrInputId === 'hero.backgroundImageUrl' && (!currentConfig.seo.ogImage || currentConfig.seo.ogImage === '#')) currentConfig.seo.ogImage = url;
                    renderSite();
                }
                else if (targetPathOrInputId) { $(targetPathOrInputId).value = url; }
                adminMessage('Image uploaded successfully.'); input.value = ''; return url;
            }
            async function isAllowedProspectusFile(file) {
                if (!file || file.size <= 0) return false;
                const name = String(file.name || '').toLowerCase();
                const type = String(file.type || '').toLowerCase();
                const extension = name.endsWith('.pdf') ? 'pdf' : name.endsWith('.docx') ? 'docx' : '';
                if (!extension) return false;
                const typeMatches = !type ||
                    (extension === 'pdf' && type === 'application/pdf') ||
                    (extension === 'docx' && type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                if (!typeMatches) return false;
                const bytes = await readFilePrefix(file, 8);
                if (extension === 'pdf') return bytesMatch(bytes, [0x25, 0x50, 0x44, 0x46, 0x2D]);
                return bytesMatch(bytes, [0x50, 0x4B, 0x03, 0x04]);
            }
            async function uploadProspectusFile() {
                if (!supabaseClient || !adminSession) { adminMessage('Please login before uploading a prospectus.', 'error'); return ''; }
                const input = $('prospectusUpload');
                const file = input && input.files && input.files[0];
                if (!file) { adminMessage('Select a PDF or DOCX prospectus first.', 'error'); return ''; }
                if (!(await isAllowedProspectusFile(file))) { adminMessage('Only valid PDF or DOCX prospectus files are allowed.', 'error'); return ''; }
                const maxBytes = 20 * 1024 * 1024;
                if (file.size > maxBytes) { adminMessage('The prospectus file is too large. Maximum size is 20MB.', 'error'); return ''; }
                const ext = file.name.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf';
                const cleanName = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'school-prospectus';
                const path = 'prospectus/' + new Date().getFullYear() + '/' + Date.now() + '-' + cleanName + '.' + ext;
                const uploadResult = await runAdminRequest(
                    () => supabaseClient.storage.from(currentConfig.storageBucket).upload(path, file, { cacheControl: '3600', upsert: false, contentType: ext === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
                    'Prospectus upload failed'
                );
                if (!uploadResult) return '';
                const { data } = supabaseClient.storage.from(currentConfig.storageBucket).getPublicUrl(path);
                const publicUrl = data && safeImageUrl(data.publicUrl);
                if (!publicUrl) { await removeManagedStorageAssets([TRUSTED_RUNTIME_CONFIG.supabase.url + '/storage/v1/object/public/' + currentConfig.storageBucket + '/' + path]); adminMessage('Prospectus uploaded, but a safe public URL could not be generated. The orphaned file was removed.', 'error'); return ''; }
                currentConfig.admissions.prospectusUrl = publicUrl;
                currentConfig.admissions.prospectusFileName = file.name;
                currentConfig.admissions.prospectusFileType = ext.toUpperCase();
                currentConfig.admissions.prospectusUploadedAt = new Date().toISOString().slice(0, 10);
                input.value = '';
                renderSite();
                adminMessage('Prospectus uploaded successfully. Click Save Website Settings to publish the download link.');
                return publicUrl;
            }
            function isValidNewAccessCode(code) {
                const value = String(code || '').trim();
                return /^[!-~]{12,64}$/.test(value) && /[A-Za-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
            }
            function showAdminCodeChange(message) {
                $('adminCodeChangeBox').classList.add('active');
                if (message) adminMessage(message, 'error');
            }
            function showSignedOutAdminState(statusText) {
                if (!$('adminLoginBox')) return;
                $('adminLoginBox').style.display = 'block';
                $('adminShell').classList.remove('active');
                $('adminSignOutBtn').classList.add('hidden');
                $('adminRefreshBtn').classList.add('hidden');
                if (adminAccessVerified) {
                    $('adminAccessGate').classList.add('hidden');
                    $('adminLoginCard').classList.remove('hidden');
                    $('adminStatus').textContent = statusText || 'Access code accepted. Sign in to manage this website.';
                } else {
                    $('adminAccessGate').classList.remove('hidden');
                    $('adminLoginCard').classList.add('hidden');
                    $('adminStatus').textContent = statusText || 'Enter the private admin access code first.';
                }
            }
            function revealAdminLogin() {
                adminAccessVerified = true;
                pendingAccessCode = '';
                if ($('adminGateCode')) $('adminGateCode').value = '';
                $('adminAccessGate').classList.add('hidden');
                $('adminLoginCard').classList.remove('hidden');
                $('adminStatus').textContent = 'Access code accepted. Sign in to manage this website.';
                checkExistingSession();
            }
            function normalizeRpcObject(data) {
                if (data && typeof data === 'object' && !Array.isArray(data)) return data;
                if (Array.isArray(data) && data.length === 1 && data[0] && typeof data[0] === 'object') return data[0];
                if (typeof data === 'string') {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed && typeof parsed === 'object') return parsed;
                    } catch (e) { /* Keep the safe fallback below. */ }
                }
                return { ok: false, message: 'The admin access service returned an unexpected response.' };
            }
            async function verifyAccessCodeWithServer(code) {
                if (!IS_RUNTIME_CONFIGURED) return { ok: false, message: 'This master package has not been configured for a Supabase project.' };
                await initSupabase();
                if (!supabaseClient) return { ok: false, message: 'The secure access-code service is unavailable. Website build v' + APP_VERSION + '.' };
                try {
                    const { data, error } = await supabaseClient.rpc('verify_school_website_access_code', { p_site_key: TRUSTED_RUNTIME_CONFIG.settingsKey, p_code: code });
                    if (error) {
                        console.error('Admin access-code RPC failed:', error);
                        const detail = String(error.code || '') + ' ' + String(error.message || '') + ' ' + String(error.details || '') + ' ' + String(error.hint || '');
                        if (/PGRST202|Could not find the function|42883|crypt\(/i.test(detail)) {
                            return { ok: false, message: 'The admin RPC is not available to the website. Run the configured 00_MASTER_PRODUCTION_SCHEMA.sql in the Supabase project used by this release.' };
                        }
                        if (/Failed to fetch|NetworkError|Load failed|CORS/i.test(detail)) {
                            return { ok: false, message: 'The browser could not reach the configured Supabase project. Check the network, project URL, and Content Security Policy.' };
                        }
                        return { ok: false, message: 'Supabase rejected the admin RPC (' + (error.code || 'unknown code') + '). Check the browser console for the full error. Website build v' + APP_VERSION + '.' };
                    }
                    return normalizeRpcObject(data);
                } catch (e) {
                    console.error('Admin access-code request failed:', e);
                    return { ok: false, message: 'The browser request failed before Supabase returned a response. Website build v' + APP_VERSION + '.' };
                }
            }
            async function changeAccessCodeWithServer(currentCode, newCode) {
                if (!IS_RUNTIME_CONFIGURED) return { ok: false, message: 'This master package has not been configured.' };
                await initSupabase();
                if (!supabaseClient) return { ok: false, message: 'The secure access-code service is unavailable.' };
                try {
                    const { data, error } = await supabaseClient.rpc('change_school_website_access_code', { p_site_key: TRUSTED_RUNTIME_CONFIG.settingsKey, p_current_code: currentCode, p_new_code: newCode });
                    if (error) return { ok: false, message: error.message || 'Access code update failed.' };
                    return data || { ok: false, message: 'Access code update failed.' };
                } catch (e) { return { ok: false, message: 'Access code update failed.' }; }
            }
            async function verifyAdminAccessCode() {
                const code = $('adminGateCode').value.trim();
                if (!code) { adminMessage('Enter the admin access code first.', 'error'); return; }
                pendingAccessCode = code;
                const serverResult = await verifyAccessCodeWithServer(code);
                if (serverResult && serverResult.ok) {
                    if (serverResult.must_change) { showAdminCodeChange('Temporary access code accepted. Create a new private access code before login.'); return; }
                    revealAdminLogin();
                    return;
                }
                adminMessage((serverResult && serverResult.message) || 'Invalid admin access code.', 'error');
            }
            async function changeAdminAccessCode() {
                const newCode = $('adminNewCode').value.trim();
                const confirmCode = $('adminConfirmCode').value.trim();
                if (!pendingAccessCode) pendingAccessCode = $('adminGateCode').value.trim();
                if (!isValidNewAccessCode(newCode)) { adminMessage('Use 12 to 64 printable characters with a letter, number, and symbol.', 'error'); return; }
                if (newCode !== confirmCode) { adminMessage('The new access code and confirmation do not match.', 'error'); return; }
                const serverResult = await changeAccessCodeWithServer(pendingAccessCode, newCode);
                if (!serverResult || !serverResult.ok) { adminMessage('Access code could not be changed: ' + ((serverResult && serverResult.message) || 'Unknown error'), 'error'); return; }
                $('adminGateCode').value = '';
                $('adminNewCode').value = '';
                $('adminConfirmCode').value = '';
                $('adminCodeChangeBox').classList.remove('active');
                adminMessage('New access code saved securely. You can now sign in.', 'success');
                revealAdminLogin();
            }
            async function adminLogin() {
                if (!supabaseClient) { adminMessage('Supabase is not configured correctly.', 'error'); return; }
                const email = $('adminEmail').value.trim(); const password = $('adminPassword').value;
                if (!email || !password) { adminMessage('Enter both the admin email and password.', 'error'); return; }
                try {
                    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    if (!data || !data.session) throw new Error('No authenticated session was returned.');
                    adminSession = data.session;
                    const allowed = await verifyAdmin();
                    if (!allowed) { await supabaseClient.auth.signOut(); adminSession = null; adminMessage('This user is not authorized as a website admin.', 'error'); return; }
                    showAdminShell(email);
                } catch (error) {
                    adminSession = null;
                    adminMessage('Login failed: ' + (error && error.message ? error.message : 'Network or server error.'), 'error');
                }
            }
            async function verifyAdmin() {
                if (!adminSession || !supabaseClient) return false;
                try {
                    const { data, error } = await supabaseClient.rpc('is_school_website_admin');
                    return !error && data === true;
                } catch (e) { return false; }
            }
            function showAdminShell(email) {
                if ($('adminPassword')) $('adminPassword').value = ''; $('adminLoginBox').style.display = 'none'; $('adminShell').classList.add('active'); $('adminSignOutBtn').classList.remove('hidden'); $('adminRefreshBtn').classList.remove('hidden'); $('adminStatus').textContent = 'Logged in as ' + email;
                fillConfigInputs(); renderAdminArrayEditors(); renderProspectusStatus(); loadEventsAdmin(); loadGalleryAdmin(); loadNewsAdmin();
            }
            async function adminSignOut() {
                if (supabaseClient) {
                    const result = await runAdminRequest(() => supabaseClient.auth.signOut(), 'Sign-out request failed');
                    if (!result) return;
                }
                adminSession = null;
                adminAccessVerified = false;
                pendingAccessCode = '';
                if ($('adminGateCode')) $('adminGateCode').value = '';
                showSignedOutAdminState();
            }
            async function checkExistingSession() {
                if (!supabaseClient) return;
                try {
                    const { data, error } = await supabaseClient.auth.getSession();
                    if (error) throw error;
                    if (data && data.session) {
                        adminSession = data.session;
                        if (await verifyAdmin()) {
                            showAdminShell(adminSession.user.email);
                        } else {
                            await supabaseClient.auth.signOut();
                            adminSession = null;
                            showSignedOutAdminState('This signed-in account is not authorized as a website admin.');
                            adminMessage('This user is not authorized as a website admin.', 'error');
                        }
                    }
                } catch (error) { adminSession = null; showSignedOutAdminState(); }
            }
            async function saveEvent() {
                if (!supabaseClient || !adminSession) { adminMessage('Login required.', 'error'); return; }
                const record = { site_key: TRUSTED_RUNTIME_CONFIG.settingsKey, title: $('eventTitle').value.trim(), event_date: $('eventDate').value, description: $('eventDescription').value.trim(), image_url: $('eventImageUrl').value.trim() || null, is_active: $('eventActive').value === 'true', sort_order: toSafeSortOrder($('eventSortOrder').value) };
                if (!record.title || !record.event_date) { adminMessage('Event title and date are required.', 'error'); return; }
                const saveResult = await runAdminRequest(
                    () => editingEventId ? supabaseClient.from('events').update(record).eq('id', editingEventId).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey) : supabaseClient.from('events').insert([record]),
                    'Event save failed'
                );
                if (!saveResult) return;
                clearEventForm(); adminMessage('Event saved.'); await loadEventsAdmin(); await loadEventsPublic();
            }
            function clearEventForm(){ editingEventId=null; $('saveEventBtn').textContent='Add Event'; ['eventTitle','eventDate','eventDescription','eventImageUrl'].forEach(id=>$(id).value=''); $('eventActive').value='true'; $('eventSortOrder').value='0'; }
            async function loadEventsAdmin() {
                if (!supabaseClient || !adminSession) return;
                const result = await runAdminRequest(() => supabaseClient.from('events').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).order('event_date', { ascending: false }), 'Events could not be loaded');
                if (!result) return;
                renderRecordList('eventsAdminList', result.data, null, (item) => editEvent(item), async (item) => { if (await deleteRecord('events', item.id, item.image_url)) { await loadEventsAdmin(); await loadEventsPublic(); } });
            }
            function editEvent(item){ editingEventId=item.id; $('eventTitle').value=item.title||''; $('eventDate').value=item.event_date||''; $('eventDescription').value=item.description||''; $('eventImageUrl').value=item.image_url||''; $('eventActive').value=String(!!item.is_active); $('eventSortOrder').value=item.sort_order||0; $('saveEventBtn').textContent='Update Event'; }
            function gallerySchemaErrorMessage(error, fallback) {
                const message = String(error && error.message || '').toLowerCase();
                if (message.includes('gallery_albums') || message.includes('gallery_images') || message.includes('schema cache')) return 'Gallery Albums v2.3.0 is not installed in Supabase. Run supabase/03_UPGRADE_GALLERY_ALBUMS.sql, then refresh.';
                return fallback;
            }
            async function saveGalleryAlbum() {
                if (!supabaseClient || !adminSession) { adminMessage('Login required.', 'error'); return; }
                const record = {
                    site_key: TRUSTED_RUNTIME_CONFIG.settingsKey,
                    title: $('galleryAlbumTitle').value.trim(),
                    description: $('galleryAlbumDescription').value.trim() || null,
                    cover_image_url: $('galleryAlbumCoverUrl').value.trim() || null,
                    cover_alt_text: $('galleryAlbumCoverAlt').value.trim() || null,
                    is_active: $('galleryAlbumActive').value === 'true',
                    sort_order: toSafeSortOrder($('galleryAlbumSortOrder').value),
                    slideshow_interval_seconds: Math.min(60, Math.max(2, Number($('galleryAlbumInterval').value || 5) || 5))
                };
                if (!record.title) { adminMessage('Album title is required.', 'error'); return; }
                if (record.cover_image_url && !safeImageUrl(record.cover_image_url)) { adminMessage('Enter a valid HTTPS cover image URL or upload a cover image.', 'error'); return; }
                const oldAlbum = editingGalleryAlbumId ? galleryAlbumsCache.find(item => item.id === editingGalleryAlbumId) : null;
                const saveResult = await runAdminRequest(
                    () => editingGalleryAlbumId ? supabaseClient.from('gallery_albums').update(record).eq('id', editingGalleryAlbumId).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey) : supabaseClient.from('gallery_albums').insert([record]),
                    'Gallery album save failed'
                );
                if (!saveResult) return;
                if (oldAlbum && oldAlbum.cover_image_url && oldAlbum.cover_image_url !== record.cover_image_url && !galleryImagesCache.some(image => image.image_url === oldAlbum.cover_image_url)) await removeManagedStorageAssets([oldAlbum.cover_image_url]);
                clearGalleryAlbumForm();
                adminMessage('Gallery album saved. Use Manage Images to add photos. Albums with multiple active images rotate automatically on the public gallery.');
                await loadGalleryAdmin();
                await loadGalleryPublic();
            }
            function clearGalleryAlbumForm() {
                editingGalleryAlbumId = null;
                $('saveGalleryAlbumBtn').textContent = 'Create Album';
                ['galleryAlbumTitle','galleryAlbumDescription','galleryAlbumCoverUrl','galleryAlbumCoverAlt'].forEach(id => $(id).value = '');
                $('galleryAlbumActive').value = 'true';
                $('galleryAlbumSortOrder').value = '0';
                $('galleryAlbumInterval').value = '5';
            }
            async function loadGalleryAdmin() {
                if (!supabaseClient || !adminSession) return;
                let albumResult;
                let imageResult;
                try {
                    albumResult = await supabaseClient.from('gallery_albums').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
                    if (albumResult.error) throw albumResult.error;
                    imageResult = await supabaseClient.from('gallery_images').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
                    if (imageResult.error) throw imageResult.error;
                } catch (error) {
                    galleryAlbumsCache = [];
                    galleryImagesCache = [];
                    renderGalleryAlbumAdminList();
                    closeGalleryImageManager();
                    adminMessage(gallerySchemaErrorMessage(error, 'Gallery albums could not be loaded.'), 'error');
                    return;
                }
                galleryAlbumsCache = Array.isArray(albumResult.data) ? albumResult.data : [];
                galleryImagesCache = Array.isArray(imageResult.data) ? imageResult.data : [];
                renderGalleryAlbumAdminList();
                if (selectedGalleryAlbumId && galleryAlbumsCache.some(item => item.id === selectedGalleryAlbumId)) renderGalleryImageManager();
                else if (selectedGalleryAlbumId) closeGalleryImageManager();
            }
            function createAdminActionButton(text, className, handler) {
                const button = document.createElement('button'); button.type = 'button'; button.className = className; button.textContent = text; button.addEventListener('click', handler); return button;
            }
            function renderGalleryAlbumAdminList() {
                const container = $('galleryAlbumsAdminList');
                container.innerHTML = '';
                if (!galleryAlbumsCache.length) { const note = document.createElement('p'); note.className = 'admin-note'; note.textContent = 'No gallery albums have been created yet.'; container.appendChild(note); return; }
                galleryAlbumsCache.forEach(album => {
                    const images = galleryImagesCache.filter(image => image.album_id === album.id);
                    const row = document.createElement('div'); row.className = 'admin-list-item gallery-admin-row';
                    const previewUrl = safeImageUrl(album.cover_image_url) || (images[0] && safeImageUrl(images[0].image_url));
                    const preview = previewUrl ? document.createElement('img') : document.createElement('div'); preview.className = previewUrl ? 'gallery-admin-thumb' : 'media-list-placeholder';
                    if (previewUrl) { preview.src = previewUrl; preview.alt = album.cover_alt_text || album.title || 'Album cover'; } else preview.textContent = 'No cover';
                    const info = document.createElement('div'); info.className = 'gallery-admin-info';
                    const title = document.createElement('strong'); title.textContent = album.title || 'Untitled Album';
                    const meta = document.createElement('div'); meta.className = 'admin-note'; meta.textContent = images.length + ' image' + (images.length === 1 ? '' : 's') + ' • ' + (album.is_active ? 'Active' : 'Inactive') + ' • Order ' + toSafeSortOrder(album.sort_order);
                    info.append(title, meta);
                    if (album.description) { const desc = document.createElement('div'); desc.textContent = album.description; info.appendChild(desc); }
                    const actions = document.createElement('div'); actions.className = 'admin-actions';
                    actions.append(
                        createAdminActionButton('Manage Images', 'btn btn--primary btn--sm', () => selectGalleryAlbum(album.id)),
                        createAdminActionButton('Edit Album', 'btn btn--secondary btn--sm', () => editGalleryAlbum(album)),
                        createAdminActionButton('Delete Album', 'btn btn--danger btn--sm', () => deleteGalleryAlbum(album))
                    );
                    row.append(preview, info, actions); container.appendChild(row);
                });
            }
            function editGalleryAlbum(album) {
                editingGalleryAlbumId = album.id;
                $('galleryAlbumTitle').value = album.title || '';
                $('galleryAlbumDescription').value = album.description || '';
                $('galleryAlbumCoverUrl').value = album.cover_image_url || '';
                $('galleryAlbumCoverAlt').value = album.cover_alt_text || '';
                $('galleryAlbumActive').value = String(!!album.is_active);
                $('galleryAlbumSortOrder').value = album.sort_order || 0;
                $('galleryAlbumInterval').value = album.slideshow_interval_seconds || 5;
                $('saveGalleryAlbumBtn').textContent = 'Update Album';
                $('galleryAlbumTitle').focus();
            }
            function selectGalleryAlbum(albumId) {
                if (!galleryAlbumsCache.some(album => album.id === albumId)) { adminMessage('Album not found. Refresh Gallery and try again.', 'error'); return; }
                selectedGalleryAlbumId = albumId;
                editingGalleryImageId = null;
                clearGalleryImageForm();
                renderGalleryImageManager();
                $('galleryImageManager').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            function closeGalleryImageManager() {
                selectedGalleryAlbumId = null;
                editingGalleryImageId = null;
                if ($('galleryImageManager')) $('galleryImageManager').classList.add('hidden');
                if ($('galleryImagesAdminList')) $('galleryImagesAdminList').innerHTML = '';
            }
            function renderGalleryImageManager() {
                const album = galleryAlbumsCache.find(item => item.id === selectedGalleryAlbumId);
                if (!album) { closeGalleryImageManager(); return; }
                $('galleryImageManager').classList.remove('hidden');
                $('selectedGalleryAlbumName').textContent = album.title;
                const images = galleryImagesCache.filter(image => image.album_id === album.id);
                $('selectedGalleryAlbumSummary').textContent = images.length + ' image' + (images.length === 1 ? '' : 's') + ' in this album. The public album card cycles through these images automatically and also opens them in a full slideshow.';
                renderGalleryImageAdminList(album, images);
            }
            function renderGalleryImageAdminList(album, images) {
                const container = $('galleryImagesAdminList'); container.innerHTML = '';
                if (!images.length) { const note = document.createElement('p'); note.className = 'admin-note'; note.textContent = 'No images in this album yet. Upload one or several images above.'; container.appendChild(note); return; }
                images.forEach((image, index) => {
                    const row = document.createElement('div'); row.className = 'admin-list-item gallery-admin-row';
                    const url = safeImageUrl(image.image_url);
                    const preview = url ? document.createElement('img') : document.createElement('div'); preview.className = url ? 'gallery-admin-thumb' : 'media-list-placeholder';
                    if (url) { preview.src = url; preview.alt = image.alt_text || image.caption || 'Gallery image'; } else preview.textContent = 'Invalid image';
                    const info = document.createElement('div'); info.className = 'gallery-admin-info';
                    const title = document.createElement('strong'); title.textContent = image.caption || ('Image ' + (index + 1));
                    const meta = document.createElement('div'); meta.className = 'admin-note'; meta.textContent = (image.is_active ? 'Active' : 'Inactive') + ' • Order ' + toSafeSortOrder(image.sort_order) + (album.cover_image_url === image.image_url ? ' • Album cover' : '');
                    info.append(title, meta);
                    const actions = document.createElement('div'); actions.className = 'admin-actions';
                    const up = createAdminActionButton('Up', 'btn btn--secondary btn--sm', () => moveGalleryImage(image.id, -1)); up.disabled = index === 0;
                    const down = createAdminActionButton('Down', 'btn btn--secondary btn--sm', () => moveGalleryImage(image.id, 1)); down.disabled = index === images.length - 1;
                    actions.append(
                        createAdminActionButton('Edit', 'btn btn--secondary btn--sm', () => editGalleryImage(image)),
                        createAdminActionButton(album.cover_image_url === image.image_url ? 'Current Cover' : 'Set Cover', 'btn btn--secondary btn--sm', () => setGalleryAlbumCover(image)),
                        up, down,
                        createAdminActionButton('Delete', 'btn btn--danger btn--sm', () => deleteGalleryImage(image))
                    );
                    row.append(preview, info, actions); container.appendChild(row);
                });
            }
            async function saveGalleryImage() {
                if (!supabaseClient || !adminSession) { adminMessage('Login required.', 'error'); return; }
                if (!selectedGalleryAlbumId) { adminMessage('Select an album before adding an image.', 'error'); return; }
                const record = {
                    site_key: TRUSTED_RUNTIME_CONFIG.settingsKey,
                    album_id: selectedGalleryAlbumId,
                    caption: $('galleryImageCaption').value.trim() || null,
                    alt_text: $('galleryImageAlt').value.trim() || null,
                    image_url: $('galleryImageUrl').value.trim(),
                    is_active: $('galleryImageActive').value === 'true',
                    sort_order: toSafeSortOrder($('galleryImageSortOrder').value)
                };
                if (!safeImageUrl(record.image_url)) { adminMessage('A valid HTTPS image URL is required.', 'error'); return; }
                const oldImage = editingGalleryImageId ? galleryImagesCache.find(item => item.id === editingGalleryImageId) : null;
                const saveResult = await runAdminRequest(
                    () => editingGalleryImageId ? supabaseClient.from('gallery_images').update(record).eq('id', editingGalleryImageId).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey) : supabaseClient.from('gallery_images').insert([record]),
                    'Gallery image save failed'
                );
                if (!saveResult) return;
                const album = galleryAlbumsCache.find(item => item.id === selectedGalleryAlbumId);
                const imageUrlChanged = !!(oldImage && oldImage.image_url !== record.image_url);
                const editedImageWasCover = !!(album && oldImage && album.cover_image_url === oldImage.image_url);
                if (album && editedImageWasCover && !record.is_active) {
                    const nextCover = galleryImagesCache.find(item => item.album_id === album.id && item.id !== editingGalleryImageId && item.is_active && safeImageUrl(item.image_url));
                    await runAdminRequest(() => supabaseClient.from('gallery_albums').update({ cover_image_url: nextCover ? nextCover.image_url : null, cover_alt_text: nextCover ? (nextCover.alt_text || nextCover.caption || album.title) : null }).eq('id', album.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Album cover could not be reassigned');
                } else if (album && record.is_active && (editedImageWasCover || !safeImageUrl(album.cover_image_url))) {
                    await runAdminRequest(() => supabaseClient.from('gallery_albums').update({ cover_image_url: record.image_url, cover_alt_text: record.alt_text || record.caption || album.title }).eq('id', album.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Album cover could not be assigned');
                }
                if (imageUrlChanged) await removeManagedStorageAssets([oldImage.image_url]);
                clearGalleryImageForm(); adminMessage('Gallery image saved in the selected album.'); await loadGalleryAdmin(); await loadGalleryPublic();
            }
            function clearGalleryImageForm() {
                editingGalleryImageId = null;
                if ($('saveGalleryImageBtn')) $('saveGalleryImageBtn').textContent = 'Add Image to Album';
                ['galleryImageCaption','galleryImageAlt','galleryImageUrl'].forEach(id => { if ($(id)) $(id).value = ''; });
                if ($('galleryImageActive')) $('galleryImageActive').value = 'true';
                if ($('galleryImageSortOrder')) {
                    const images = galleryImagesCache.filter(image => image.album_id === selectedGalleryAlbumId);
                    const maxOrder = images.length ? Math.max(...images.map(image => toSafeSortOrder(image.sort_order, 0))) : -1;
                    $('galleryImageSortOrder').value = String(maxOrder >= 2147483647 ? 0 : maxOrder + 1);
                }
            }
            function editGalleryImage(image) {
                editingGalleryImageId = image.id;
                $('galleryImageCaption').value = image.caption || '';
                $('galleryImageAlt').value = image.alt_text || '';
                $('galleryImageUrl').value = image.image_url || '';
                $('galleryImageActive').value = String(!!image.is_active);
                $('galleryImageSortOrder').value = image.sort_order || 0;
                $('saveGalleryImageBtn').textContent = 'Update Album Image';
                $('galleryImageCaption').focus();
            }
            async function setGalleryAlbumCover(image) {
                const album = galleryAlbumsCache.find(item => item.id === image.album_id);
                if (!album) return;
                if (!image.is_active) { adminMessage('Activate this image before using it as the public album cover.', 'error'); return; }
                const result = await runAdminRequest(() => supabaseClient.from('gallery_albums').update({ cover_image_url: image.image_url, cover_alt_text: image.alt_text || image.caption || album.title }).eq('id', album.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Album cover could not be updated');
                if (!result) return;
                adminMessage('Album cover updated.'); await loadGalleryAdmin(); await loadGalleryPublic();
            }
            async function moveGalleryImage(imageId, direction) {
                const images = galleryImagesCache.filter(image => image.album_id === selectedGalleryAlbumId);
                const index = images.findIndex(image => image.id === imageId);
                const targetIndex = index + direction;
                if (index < 0 || targetIndex < 0 || targetIndex >= images.length) return;
                const current = images[index]; const target = images[targetIndex];
                let currentOrder = toSafeSortOrder(current.sort_order, index); let targetOrder = toSafeSortOrder(target.sort_order, targetIndex);
                if (currentOrder === targetOrder) { currentOrder = index; targetOrder = targetIndex; }
                const first = await runAdminRequest(() => supabaseClient.from('gallery_images').update({ sort_order: targetOrder }).eq('id', current.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Image order could not be updated');
                if (!first) return;
                const second = await runAdminRequest(() => supabaseClient.from('gallery_images').update({ sort_order: currentOrder }).eq('id', target.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Image order could not be updated');
                if (!second) return;
                await loadGalleryAdmin(); await loadGalleryPublic();
            }
            async function deleteGalleryImage(image) {
                if (!confirm('Delete this image from the album?')) return;
                const album = galleryAlbumsCache.find(item => item.id === image.album_id);
                const result = await runAdminRequest(() => supabaseClient.from('gallery_images').delete().eq('id', image.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Gallery image could not be deleted');
                if (!result) return;
                const remaining = galleryImagesCache.filter(item => item.album_id === image.album_id && item.id !== image.id);
                if (album && album.cover_image_url === image.image_url) {
                    const next = remaining.find(item => item.is_active && safeImageUrl(item.image_url)) || remaining.find(item => safeImageUrl(item.image_url));
                    await runAdminRequest(() => supabaseClient.from('gallery_albums').update({ cover_image_url: next ? next.image_url : null, cover_alt_text: next ? (next.alt_text || next.caption || album.title) : null }).eq('id', album.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Album cover could not be refreshed');
                }
                await removeManagedStorageAssets([image.image_url]);
                clearGalleryImageForm(); adminMessage('Gallery image deleted.'); await loadGalleryAdmin(); await loadGalleryPublic();
            }
            async function deleteGalleryAlbum(album) {
                const images = galleryImagesCache.filter(image => image.album_id === album.id);
                if (!confirm('Delete the album "' + album.title + '" and all ' + images.length + ' image(s) inside it?')) return;
                const result = await runAdminRequest(() => supabaseClient.from('gallery_albums').delete().eq('id', album.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Gallery album could not be deleted');
                if (!result) return;
                await removeManagedStorageAssets([album.cover_image_url, ...images.map(image => image.image_url)]);
                if (selectedGalleryAlbumId === album.id) closeGalleryImageManager();
                adminMessage('Gallery album and its images were deleted.'); await loadGalleryAdmin(); await loadGalleryPublic();
            }
            async function saveNews() {
                if (!supabaseClient || !adminSession) { adminMessage('Login required.', 'error'); return; }
                const record = { site_key: TRUSTED_RUNTIME_CONFIG.settingsKey, title: $('newsTitleInput').value.trim(), publish_date: $('newsDateInput').value || getLocalIsoDate(), body: $('newsBodyInput').value.trim(), image_url: $('newsImageInput').value.trim() || null, is_active: $('newsActiveInput').value === 'true', sort_order: toSafeSortOrder($('newsSortInput').value) };
                if (!record.title || !record.body) { adminMessage('News title and body are required.', 'error'); return; }
                const saveResult = await runAdminRequest(
                    () => editingNewsId ? supabaseClient.from('announcements').update(record).eq('id', editingNewsId).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey) : supabaseClient.from('announcements').insert([record]),
                    'Announcement save failed'
                );
                if (!saveResult) return;
                clearNewsForm(); adminMessage('Announcement saved.'); await loadNewsAdmin(); await loadNewsPublic();
            }
            function clearNewsForm(){ editingNewsId=null; $('saveNewsBtn').textContent='Add Announcement'; ['newsTitleInput','newsDateInput','newsBodyInput','newsImageInput'].forEach(id=>$(id).value=''); $('newsActiveInput').value='true'; $('newsSortInput').value='0'; }
            async function loadNewsAdmin() {
                if (!supabaseClient || !adminSession) return;
                const result = await runAdminRequest(() => supabaseClient.from('announcements').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).order('publish_date', { ascending: false }), 'Announcements could not be loaded');
                if (!result) return;
                renderRecordList('newsAdminList', result.data, null, (item) => editNews(item), async (item) => { if (await deleteRecord('announcements', item.id, item.image_url)) { await loadNewsAdmin(); await loadNewsPublic(); } });
            }
            function editNews(item){ editingNewsId=item.id; $('newsTitleInput').value=item.title||''; $('newsDateInput').value=item.publish_date||''; $('newsBodyInput').value=item.body||''; $('newsImageInput').value=item.image_url||''; $('newsActiveInput').value=String(!!item.is_active); $('newsSortInput').value=item.sort_order||0; $('saveNewsBtn').textContent='Update Announcement'; }
            async function deleteRecord(table, id, assetUrl = '') {
                if (!confirm('Delete this record?')) return false;
                const result = await runAdminRequest(() => supabaseClient.from(table).delete().eq('id', id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Delete failed');
                if (!result) return false;
                await removeManagedStorageAssets(assetUrl);
                adminMessage('Record deleted.');
                return true;
            }
            function renderRecordList(containerId, data, error, editFn, deleteFn) {
                const wrap = $(containerId); wrap.innerHTML = '';
                if (error) { wrap.textContent = error.message; return; }
                if (!data || !data.length) { wrap.textContent = 'No records found.'; return; }
                const table = document.createElement('table'); table.className = 'record-table'; table.innerHTML = '<thead><tr><th>Title</th><th>Date / Order</th><th>Status</th><th>Actions</th></tr></thead>';
                const tbody = document.createElement('tbody');
                data.forEach(item => { const tr = document.createElement('tr');
                    const title = document.createElement('td'); title.textContent = item.title || item.subject || item.email || 'Untitled';
                    const date = document.createElement('td'); date.textContent = item.event_date || item.publish_date || (item.sort_order ?? '');
                    const status = document.createElement('td'); status.innerHTML = '<span class="badge">' + (item.is_active === false ? 'Inactive' : 'Active') + '</span>';
                    const actions = document.createElement('td'); const edit = document.createElement('button'); edit.className='btn btn--secondary btn--sm'; edit.textContent='Edit'; edit.type='button'; edit.addEventListener('click',()=>editFn(item)); const del=document.createElement('button'); del.className='btn btn--danger btn--sm'; del.type='button'; del.textContent='Delete'; del.addEventListener('click',()=>deleteFn(item)); actions.append(edit, document.createTextNode(' '), del); tr.append(title,date,status,actions); tbody.appendChild(tr); });
                table.appendChild(tbody); wrap.appendChild(table);
            }
            function getEnquirySearchText(item) {
                return [item.email, item.phone, item.message, item.subject, item.name, item.parent_name, item.student_name]
                    .filter(Boolean)
                    .join(' ');
            }
            function extractFirstEmailFromText(text) {
                const match = String(text || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
                return match ? match[0] : '';
            }
            function extractFirstPhoneFromText(text) {
                const matches = String(text || '').match(/(?:\+?\d[\d\s().-]{7,}\d)/g) || [];
                for (const raw of matches) {
                    const digits = raw.replace(/\D/g, '');
                    if (digits.length >= 8 && digits.length <= 15) return raw.trim();
                }
                return '';
            }
            function normalizePhoneForLink(phone) {
                const cleaned = String(phone || '').trim().replace(/[^\d+]/g, '');
                if (!cleaned) return '';
                return cleaned.startsWith('+') ? '+' + cleaned.slice(1).replace(/\+/g, '') : cleaned.replace(/\+/g, '');
            }
            function getEnquiryReplyContacts(item) {
                const searchText = getEnquirySearchText(item);
                const email = String(item.email || '').trim() || extractFirstEmailFromText(searchText);
                const rawPhone = String(item.phone || '').trim() || extractFirstPhoneFromText(searchText);
                const phone = normalizePhoneForLink(rawPhone);
                return { email, rawPhone, phone };
            }
            function createReplyLink(label, href, variant = 'secondary') {
                const link = document.createElement('a');
                link.className = 'btn btn--' + variant + ' btn--sm';
                link.href = href;
                link.textContent = label;
                return link;
            }
            function buildReplyEmailHref(item, email) {
                const subjectSource = item.subject || item.type || 'School enquiry';
                const subject = /^re:/i.test(subjectSource) ? subjectSource : 'Re: ' + subjectSource;
                const greetingName = item.name || item.parent_name || 'Parent/Guardian';
                const body = 'Hello ' + greetingName + ',\n\nThank you for contacting us.\n\n';
                return 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            }
            async function markEnquiryResponded(item) {
                if (!supabaseClient || !item || !item.id) return;
                await runAdminRequest(
                    () => supabaseClient.from('enquiries').update({ is_read: true, status: 'responded', responded_at: new Date().toISOString() }).eq('id', item.id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey),
                    'Enquiry status could not be updated'
                );
            }
            async function loadEnquiries() {
                if (!supabaseClient || !adminSession) { adminMessage('Login required.', 'error'); return; }
                const filter = $('enquiryFilter').value; let query = supabaseClient.from('enquiries').select('*').eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey).order('created_at', { ascending: false });
                if (filter === 'admissions' || filter === 'contact') query = query.eq('type', filter);
                if (filter === 'unread') query = query.eq('is_read', false);
                if (filter === 'responded') query = query.eq('status', 'responded');
                const result = await runAdminRequest(() => query, 'Could not load enquiries');
                if (!result) return;
                enquiriesCache = result.data || []; renderEnquiries(enquiriesCache);
            }
            async function updateEnquiryStatus(id, payload) {
                const result = await runAdminRequest(() => supabaseClient.from('enquiries').update(payload).eq('id', id).eq('site_key', TRUSTED_RUNTIME_CONFIG.settingsKey), 'Enquiry status update failed');
                if (result) await loadEnquiries();
            }
            function renderEnquiries(data) {
                const wrap = $('enquiriesAdminList'); wrap.innerHTML = '';
                if (!data.length) { wrap.textContent = 'No enquiries found.'; return; }
                const table = document.createElement('table'); table.className = 'record-table';
                const head = document.createElement('thead'); head.innerHTML = '<tr><th>Type</th><th>Sender</th><th>Message</th><th>Status</th><th>Reply / Actions</th></tr>'; table.appendChild(head);
                const tbody = document.createElement('tbody');
                data.forEach(item => {
                    const replyContacts = getEnquiryReplyContacts(item);
                    const tr = document.createElement('tr');
                    const type = document.createElement('td'); type.textContent = item.type || '';
                    const sender = document.createElement('td');
                    const senderMain = document.createElement('strong');
                    senderMain.textContent = [item.name, item.parent_name].filter(Boolean).join(' • ') || 'Sender';
                    sender.appendChild(senderMain);
                    if (item.student_name) {
                        const student = document.createElement('span'); student.className = 'enquiry-contact-detail'; student.textContent = 'Student: ' + item.student_name; sender.appendChild(student);
                    }
                    if (replyContacts.email) {
                        const emailLine = document.createElement('span'); emailLine.className = 'enquiry-contact-detail'; emailLine.textContent = 'Email: ' + replyContacts.email; sender.appendChild(emailLine);
                    }
                    if (replyContacts.rawPhone || replyContacts.phone) {
                        const phoneLine = document.createElement('span'); phoneLine.className = 'enquiry-contact-detail'; phoneLine.textContent = 'Phone: ' + (replyContacts.rawPhone || replyContacts.phone); sender.appendChild(phoneLine);
                    }
                    const msg = document.createElement('td'); msg.textContent = [item.subject, item.message].filter(Boolean).join(' | ');
                    const status = document.createElement('td');
                    const statusBadge = document.createElement('span'); statusBadge.className = 'badge'; statusBadge.textContent = item.status || (item.is_read ? 'read' : 'new'); status.appendChild(statusBadge);
                    const actions = document.createElement('td');
                    const group = document.createElement('div'); group.className = 'enquiry-action-group';
                    if (replyContacts.email) {
                        const emailReply = createReplyLink('Reply Email', buildReplyEmailHref(item, replyContacts.email), 'primary');
                        emailReply.addEventListener('click', () => markEnquiryResponded(item));
                        group.appendChild(emailReply);
                    }
                    if (replyContacts.phone) {
                        const callReply = createReplyLink('Call Phone', 'tel:' + replyContacts.phone, 'secondary');
                        callReply.addEventListener('click', () => markEnquiryResponded(item));
                        const smsReply = createReplyLink('Send SMS', 'sms:' + replyContacts.phone + '?body=' + encodeURIComponent('Hello, thank you for contacting us.'), 'secondary');
                        smsReply.addEventListener('click', () => markEnquiryResponded(item));
                        group.append(callReply, smsReply);
                    }
                    if (!replyContacts.email && !replyContacts.phone) {
                        const none = document.createElement('span'); none.className = 'enquiry-no-contact'; none.textContent = 'No reply email or phone found'; group.appendChild(none);
                    }
                    const read = document.createElement('button'); read.className='btn btn--secondary btn--sm'; read.type='button'; read.textContent='Mark Read'; read.addEventListener('click', ()=>updateEnquiryStatus(item.id, {is_read:true,status:'read'}));
                    const resp = document.createElement('button'); resp.className='btn btn--secondary btn--sm'; resp.type='button'; resp.textContent='Responded'; resp.addEventListener('click', ()=>updateEnquiryStatus(item.id, {is_read:true,status:'responded',responded_at:new Date().toISOString()}));
                    const del = document.createElement('button'); del.className='btn btn--danger btn--sm'; del.type='button'; del.textContent='Delete'; del.addEventListener('click', async()=>{ if (await deleteRecord('enquiries', item.id)) await loadEnquiries(); });
                    group.append(read, resp, del);
                    actions.appendChild(group);
                    tr.append(type,sender,msg,status,actions); tbody.appendChild(tr);
                });
                table.appendChild(tbody); wrap.appendChild(table);
            }
            function exportCSV() {
                if (!enquiriesCache.length) { adminMessage('Load enquiries first.', 'error'); return; }
                const cols = ['created_at','type','name','parent_name','student_name','email','phone','subject','message','status','is_read'];
                const csvCell = value => {
                    let text = String(value ?? '');
                    if (/^[\s\u0000-\u001F]*[=+@-]/.test(text)) text = "'" + text;
                    return '"' + text.replace(/"/g, '""') + '"';
                };
                const lines = [cols.join(',')].concat(enquiriesCache.map(row => cols.map(c => csvCell(row[c])).join(',')));
                downloadText(getExportSlug() + '-enquiries.csv', '\uFEFF' + lines.join('\r\n'), 'text/csv;charset=utf-8');
            }
            function downloadText(filename, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); }
            function exportConfig() { downloadText(getExportSlug() + '-website-settings.json', JSON.stringify(getPersistableConfig(), null, 2), 'application/json'); }
            function importConfig() {
                const file = $('importConfigFile').files[0];
                if (!file) { adminMessage('Select a JSON backup first.', 'error'); return; }
                if (file.size > 500000) { adminMessage('Settings backup is too large. Maximum size is 500KB.', 'error'); return; }
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const parsed = JSON.parse(String(reader.result || ''));
                        if (!isPlainObject(parsed)) throw new Error('Invalid root object');
                        currentConfig = mergePublicConfig(parsed);
                        renderSite();
                        adminMessage('Settings imported safely. Click Save Website Settings to store them in Supabase.');
                    } catch(e) { adminMessage('Invalid or unsafe JSON settings file.', 'error'); }
                };
                reader.readAsText(file);
            }
            function resetConfig() { if (!confirm('Restore the configured school website default settings?')) return; currentConfig = applyTrustedRuntimeConfig(clone(DEFAULT_CONFIG)); renderSite(); adminMessage('Default template restored. Click Save Website Settings to store it.'); }
            function openGalleryAlbum(album) {
                const images = galleryAlbumImages(album);
                if (!images.length) return;
                stopLightboxSlideshow();
                activeLightboxImages = images;
                activeLightboxIndex = 0;
                activeLightboxAlbumTitle = cleanText(album.title || 'Gallery Album');
                activeLightboxIntervalSeconds = Math.min(60, Math.max(2, Number(album.slideshow_interval_seconds || 5) || 5));
                renderLightboxSlide();
                $('lightbox').classList.add('active');
                $('lightbox').setAttribute('aria-hidden','false');
                document.body.style.overflow = 'hidden';
                syncGalleryCardSlideshows();
                if (activeLightboxImages.length > 1 && !prefersReducedMotion()) startLightboxSlideshow();
                setTimeout(() => $('lightboxClose').focus(), 0);
            }
            function openLightbox(src, alt) {
                openGalleryAlbum({ title: alt || 'Image preview', slideshow_interval_seconds: 5, images: [{ image_url: src, alt_text: alt || 'Image preview', caption: '' }] });
            }
            function renderLightboxSlide() {
                if (!activeLightboxImages.length) return;
                activeLightboxIndex = (activeLightboxIndex + activeLightboxImages.length) % activeLightboxImages.length;
                const image = activeLightboxImages[activeLightboxIndex];
                $('lightboxImg').src = image.image_url;
                $('lightboxImg').alt = image.alt_text || activeLightboxAlbumTitle;
                $('lightboxTitle').textContent = activeLightboxAlbumTitle;
                $('lightboxCaption').textContent = image.caption || image.alt_text || '';
                $('lightboxCounter').textContent = (activeLightboxIndex + 1) + ' of ' + activeLightboxImages.length;
                $('lightboxPrev').classList.toggle('hidden', activeLightboxImages.length < 2);
                $('lightboxNext').classList.toggle('hidden', activeLightboxImages.length < 2);
                $('lightboxPlayPause').classList.toggle('hidden', activeLightboxImages.length < 2);
                const thumbs = $('lightboxThumbnails'); thumbs.innerHTML = '';
                activeLightboxImages.forEach((item, index) => {
                    const button = document.createElement('button'); button.type = 'button'; button.className = 'lightbox__thumbnail' + (index === activeLightboxIndex ? ' active' : ''); button.setAttribute('aria-label', 'Show image ' + (index + 1));
                    const thumb = document.createElement('img'); thumb.src = item.image_url; thumb.alt = ''; thumb.referrerPolicy = 'no-referrer'; button.appendChild(thumb); button.addEventListener('click', () => { activeLightboxIndex = index; renderLightboxSlide(); }); thumbs.appendChild(button);
                });
            }
            function showLightboxImage(offset) { if (activeLightboxImages.length < 2) return; activeLightboxIndex = (activeLightboxIndex + offset + activeLightboxImages.length) % activeLightboxImages.length; renderLightboxSlide(); }
            function stopLightboxSlideshow() { if (lightboxTimer) clearInterval(lightboxTimer); lightboxTimer = null; if ($('lightboxPlayPause')) $('lightboxPlayPause').textContent = 'Play slideshow'; }
            function startLightboxSlideshow() {
                if (activeLightboxImages.length < 2 || lightboxTimer) return;
                lightboxTimer = setInterval(() => showLightboxImage(1), activeLightboxIntervalSeconds * 1000);
                $('lightboxPlayPause').textContent = 'Pause slideshow';
            }
            function toggleLightboxSlideshow() {
                if (lightboxTimer) { lightboxResumeAfterVisibility = false; stopLightboxSlideshow(); return; }
                lightboxResumeAfterVisibility = false;
                startLightboxSlideshow();
            }
            function closeLightbox() {
                lightboxResumeAfterVisibility = false;
                stopLightboxSlideshow();
                $('lightbox').classList.remove('active');
                $('lightbox').setAttribute('aria-hidden','true');
                document.body.style.overflow = '';
                $('lightboxImg').src = '';
                $('lightboxThumbnails').innerHTML = '';
                activeLightboxImages = [];
                activeLightboxIndex = 0;
                syncGalleryCardSlideshows();
            }
            function openAdmin() {
                if (!IS_RUNTIME_CONFIGURED) { alert('Run setup/Configure-SchoolWebsite.ps1 before using School Admin.'); return; }
                $('adminModal').classList.add('active');
                $('adminModal').setAttribute('aria-hidden','false');
                syncGalleryCardSlideshows();
                document.body.style.overflow = 'hidden';
                if (adminAccessVerified) {
                    checkExistingSession();
                    setTimeout(() => { const target = adminSession ? $('adminRefreshBtn') : $('adminEmail'); if (target) target.focus(); }, 0);
                } else {
                    $('adminAccessGate').classList.remove('hidden');
                    $('adminLoginCard').classList.add('hidden');
                    $('adminStatus').textContent = 'Enter the private admin access code first.';
                    setTimeout(() => { if ($('adminGateCode')) $('adminGateCode').focus(); }, 0);
                }
            }
            function closeAdmin() {
                $('adminModal').classList.remove('active');
                $('adminModal').setAttribute('aria-hidden','true');
                syncGalleryCardSlideshows();
                document.body.style.overflow = '';
                if ($('adminPassword')) $('adminPassword').value = '';
                if ($('adminGateCode')) $('adminGateCode').value = '';
                if ($('adminNewCode')) $('adminNewCode').value = '';
                if ($('adminConfirmCode')) $('adminConfirmCode').value = '';
                if ($('adminCodeChangeBox')) $('adminCodeChangeBox').classList.remove('active');
                if (!adminAccessVerified) pendingAccessCode = '';
                if ($('adminOpenBtn')) $('adminOpenBtn').focus();
            }
            function bindEvents() {
                document.addEventListener('visibilitychange', () => {
                    syncGalleryCardSlideshows();
                    if (document.hidden && lightboxTimer) {
                        lightboxResumeAfterVisibility = true;
                        stopLightboxSlideshow();
                    } else if (!document.hidden && lightboxResumeAfterVisibility && $('lightbox').classList.contains('active')) {
                        lightboxResumeAfterVisibility = false;
                        startLightboxSlideshow();
                    }
                });
                window.addEventListener('pagehide', stopGalleryCardSlideshows);
                $('hamburger').addEventListener('click', () => { const open = $('hamburger').classList.toggle('active'); $('mobileNav').classList.toggle('active', open); $('hamburger').setAttribute('aria-expanded', String(open)); });
                document.querySelectorAll('.mobile-nav__link').forEach(link => link.addEventListener('click', () => { $('hamburger').classList.remove('active'); $('mobileNav').classList.remove('active'); $('hamburger').setAttribute('aria-expanded', 'false'); }));
                window.addEventListener('scroll', () => { $('header').classList.toggle('header--scrolled', window.scrollY > 10); $('backToTop').classList.toggle('visible', window.scrollY > 300); }, { passive: true });
                $('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
                $('lightboxClose').addEventListener('click', closeLightbox); $('lightbox').addEventListener('click', e => { if (e.target === $('lightbox')) closeLightbox(); });
                $('lightboxPrev').addEventListener('click', () => showLightboxImage(-1)); $('lightboxNext').addEventListener('click', () => showLightboxImage(1)); $('lightboxPlayPause').addEventListener('click', toggleLightboxSlideshow);
                $('lightboxStage').addEventListener('touchstart', event => { lightboxTouchStartX = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : null; }, { passive: true });
                $('lightboxStage').addEventListener('touchend', event => { if (lightboxTouchStartX == null || !event.changedTouches || !event.changedTouches[0]) return; const delta = event.changedTouches[0].clientX - lightboxTouchStartX; lightboxTouchStartX = null; if (Math.abs(delta) > 45) showLightboxImage(delta > 0 ? -1 : 1); }, { passive: true });
                $('prospectusBtn').addEventListener('click', e => {
                    const url = safeImageUrl(currentConfig.admissions.prospectusUrl || '');
                    if (!url || url.startsWith('#')) {
                        e.preventDefault();
                        alert('The prospectus file is not available yet. Please contact the school office or send an admissions enquiry.');
                    }
                });
                $('admissionsForm').addEventListener('submit', e => { e.preventDefault(); submitEnquiry(e.target, 'admissions', $('admissionsSuccess'), $('admissionsError')); });
                $('contactForm').addEventListener('submit', e => { e.preventDefault(); submitEnquiry(e.target, 'contact', $('contactSuccess'), $('contactError')); });
                $('adminOpenBtn').addEventListener('click', openAdmin); $('adminCloseBtn').addEventListener('click', closeAdmin); $('adminModal').addEventListener('click', e => { if (e.target === $('adminModal')) closeAdmin(); });
                $('verifyAccessCodeBtn').addEventListener('click', verifyAdminAccessCode);
                $('changeAccessCodeBtn').addEventListener('click', changeAdminAccessCode);
                $('adminGateCode').addEventListener('keydown', e => { if (e.key === 'Enter') verifyAdminAccessCode(); });
                $('adminNewCode').addEventListener('keydown', e => { if (e.key === 'Enter') changeAdminAccessCode(); });
                $('adminConfirmCode').addEventListener('keydown', e => { if (e.key === 'Enter') changeAdminAccessCode(); });
                $('adminLoginBtn').addEventListener('click', adminLogin);
                ['adminEmail', 'adminPassword'].forEach(id => $(id).addEventListener('keydown', e => { if (e.key === 'Enter') adminLogin(); }));
                $('adminSignOutBtn').addEventListener('click', adminSignOut);
                $('adminRefreshBtn').addEventListener('click', async () => {
                    const settingsOk = await loadSettings();
                    renderSite();
                    const eventsOk = await loadEventsPublic();
                    const galleryOk = await loadGalleryPublic();
                    const newsOk = await loadNewsPublic();
                    if (settingsOk && eventsOk && galleryOk && newsOk) adminMessage('Website content refreshed.');
                    else adminMessage('Refresh was incomplete. Check the Supabase connection and production schema before saving changes.', 'error');
                });
                document.querySelectorAll('.admin-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active')); tab.classList.add('active'); $(tab.dataset.panel).classList.add('active'); }));
                bindConfigInputs();
                document.querySelectorAll('[id^="saveConfigBtn"]').forEach(btn => btn.addEventListener('click', saveSettings));
                document.querySelectorAll('[data-upload-target]').forEach(btn => btn.addEventListener('click', () => uploadAsset(btn.dataset.fileInput, btn.dataset.uploadTarget)));
                $('applyPresetBtn').addEventListener('click', () => { currentConfig.theme = clone(THEME_PRESETS[$('themePresetSelect').value] || THEME_PRESETS.green); renderSite(); }); $('addHeroImageUrlBtn').addEventListener('click', addSingleHeroUrlToSlideshow); $('heroSlidesUploadBtn').addEventListener('click', uploadHeroSlides);
                $('addAcademicBtn').addEventListener('click', () => { currentConfig.academics.cards.push({ icon:'📘', title:'New Programme', text:'Programme description.' }); renderSite(); });
                $('addStepBtn').addEventListener('click', () => { currentConfig.admissions.steps.push({ title:'New Step', text:'Step description.' }); renderSite(); });
                $('prospectusUploadBtn').addEventListener('click', uploadProspectusFile);
                $('eventUploadBtn').addEventListener('click', () => uploadAsset('eventUpload', 'eventImageUrl')); $('saveEventBtn').addEventListener('click', saveEvent); $('clearEventBtn').addEventListener('click', clearEventForm); $('loadEventsAdminBtn').addEventListener('click', loadEventsAdmin);
                $('galleryAlbumCoverUploadBtn').addEventListener('click', () => uploadAsset('galleryAlbumCoverUpload', 'galleryAlbumCoverUrl'));
                $('saveGalleryAlbumBtn').addEventListener('click', saveGalleryAlbum); $('clearGalleryAlbumBtn').addEventListener('click', clearGalleryAlbumForm); $('loadGalleryAdminBtn').addEventListener('click', loadGalleryAdmin);
                $('galleryImageUploadBtn').addEventListener('click', () => uploadAsset('galleryImageUpload', 'galleryImageUrl')); $('galleryMultipleUploadBtn').addEventListener('click', uploadMultipleGalleryImages); $('saveGalleryImageBtn').addEventListener('click', saveGalleryImage); $('clearGalleryImageBtn').addEventListener('click', clearGalleryImageForm); $('closeGalleryAlbumBtn').addEventListener('click', closeGalleryImageManager);
                $('newsUploadBtn').addEventListener('click', () => uploadAsset('newsUpload', 'newsImageInput')); $('saveNewsBtn').addEventListener('click', saveNews); $('clearNewsBtn').addEventListener('click', clearNewsForm); $('loadNewsAdminBtn').addEventListener('click', loadNewsAdmin);
                $('loadEnquiriesBtn').addEventListener('click', loadEnquiries); $('exportEnquiriesBtn').addEventListener('click', exportCSV);
                $('exportConfigBtn').addEventListener('click', exportConfig); $('importConfigBtn').addEventListener('click', importConfig); $('resetConfigBtn').addEventListener('click', resetConfig);
                document.addEventListener('keydown', e => {
                    if ($('lightbox').classList.contains('active')) {
                        if (e.key === 'ArrowLeft') { e.preventDefault(); showLightboxImage(-1); }
                        if (e.key === 'ArrowRight') { e.preventDefault(); showLightboxImage(1); }
                    }
                    if (e.key === 'Escape') { if ($('lightbox').classList.contains('active')) closeLightbox(); if ($('adminModal').classList.contains('active')) closeAdmin(); }
                });
            }
            async function init() {
                bindEvents();
                showSetupRequiredState();
                currentConfig = applyTrustedRuntimeConfig(clone(DEFAULT_CONFIG));
                renderSite();
                if (IS_RUNTIME_CONFIGURED && window.SCHOOL_WEBSITE_DEPENDENCIES_READY) {
                    try { await window.SCHOOL_WEBSITE_DEPENDENCIES_READY; } catch (error) { /* safe degraded mode */ }
                }
                await loadSettings();
                renderSite();
                await loadEventsPublic();
                await loadGalleryPublic();
                await loadNewsPublic();
                if (window.location.hash === '#admin' && IS_RUNTIME_CONFIGURED) openAdmin();
            }
            window.addEventListener('error', event => console.warn('Website component error:', event.message || event.error || 'unknown error'));
            window.addEventListener('unhandledrejection', event => console.warn('Website request error:', event.reason || 'unknown rejection'));
            init().catch(error => {
                console.warn('Website initialization failed:', error);
                currentConfig = applyTrustedRuntimeConfig(clone(DEFAULT_CONFIG));
                showSetupRequiredState();
                renderSite();
            });
        })();

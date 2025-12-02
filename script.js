/**
 * Brand as an Agent - 学术分享课程交互脚本
 * 江南大学设计学院
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Lucide 图标
    lucide.createIcons();

    // 导航栏滚动效果
    initNavbarScroll();

    // 阅读进度条
    initReadingProgress();

    // 返回顶部按钮
    initBackToTop();

    // 平滑滚动
    initSmoothScroll();

    // 时间线动画
    initTimelineAnimation();

    // 案例卡片交互
    initCaseCards();

    // 图表动画
    initChartAnimations();

    // 表格高亮
    initTableHighlight();

    // 章节导航高亮
    initChapterNavHighlight();
});

/**
 * 导航栏滚动效果
 */
function initNavbarScroll() {
    const nav = document.querySelector('.main-nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

/**
 * 阅读进度条
 */
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');

    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 时间线动画 - 滚动时渐入效果
 */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // 添加动画类样式
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item.animate-in {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 案例卡片交互
 */
function initCaseCards() {
    const caseStudies = document.querySelectorAll('.case-study');

    caseStudies.forEach(caseStudy => {
        const header = caseStudy.querySelector('.case-header');

        // 添加滚动动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(caseStudy);
    });

    // 添加案例可见性样式
    const style = document.createElement('style');
    style.textContent = `
        .case-study {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .case-study.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * 图表动画
 */
function initChartAnimations() {
    // 恐怖谷曲线动画
    const valleySvg = document.querySelector('.valley-svg');

    if (valleySvg) {
        const path = valleySvg.querySelector('path');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        path.style.transition = 'stroke-dashoffset 2s ease';
                        path.style.strokeDashoffset = '0';
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(valleySvg);
        }
    }

    // 数字计数动画
    const animateNumbers = document.querySelectorAll('.effect-stat, .accuracy-number');

    animateNumbers.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(el);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(el);
    });
}

/**
 * 数字动画
 */
function animateNumber(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);

    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(/\d+/, '');
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeProgress);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = text;
        }
    }

    requestAnimationFrame(update);
}

/**
 * 表格行高亮
 */
function initTableHighlight() {
    const tables = document.querySelectorAll('.comparison-table');

    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(49, 130, 206, 0.05)';
            });

            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    });
}

/**
 * 章节导航高亮
 */
function initChapterNavHighlight() {
    const chapters = document.querySelectorAll('.chapter-section');
    const tocCards = document.querySelectorAll('.toc-card');

    if (chapters.length === 0 || tocCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                tocCards.forEach(card => {
                    const href = card.getAttribute('href');
                    if (href === `#${id}`) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    chapters.forEach(chapter => {
        observer.observe(chapter);
    });

    // 添加活动状态样式
    const style = document.createElement('style');
    style.textContent = `
        .toc-card.active {
            border-color: var(--primary);
            background-color: rgba(26, 54, 93, 0.05);
        }
        .toc-card.active .toc-number {
            color: var(--primary);
        }
    `;
    document.head.appendChild(style);
}

/**
 * 特性卡片悬停效果
 */
function initFeatureCardEffects() {
    const cards = document.querySelectorAll('.feature-card, .implication-card, .component-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * 图片占位符交互
 */
function initImagePlaceholders() {
    const placeholders = document.querySelectorAll('.image-placeholder');

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // 可以在这里添加上传图片或预览图片的逻辑
            console.log('Image placeholder clicked');
        });
    });
}

/**
 * 技术架构图动画
 */
function initArchitectureAnimation() {
    const archComponents = document.querySelectorAll('.arch-component');

    if (archComponents.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    archComponents.forEach(component => {
        component.style.opacity = '0';
        component.style.transform = 'translateY(20px)';
        component.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(component);
    });

    const style = document.createElement('style');
    style.textContent = `
        .arch-component.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 对比卡片动画
 */
function initComparisonAnimation() {
    const comparisons = document.querySelectorAll('.economy-comparison, .psi-comparison, .bi-comparison, .b2a-evolution');

    comparisons.forEach(comparison => {
        const cards = comparison.querySelectorAll('.economy-card, .psi-card, .bi-card, .b2a-stage');

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0)';
                    }, index * 150);
                });
            }
        }, { threshold: 0.2 });

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        observer.observe(comparison);
    });
}

/**
 * 滚动揭示动画
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.theory-block, .case-point, .risk-case, .manipulation-item, .glossary-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 键盘导航支持
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // 按下 Home 键返回顶部
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 按下 End 键滚动到底部
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * 打印样式优化
 */
function initPrintStyles() {
    window.addEventListener('beforeprint', () => {
        // 展开所有可折叠内容
        document.querySelectorAll('.collapsed').forEach(el => {
            el.classList.remove('collapsed');
        });

        // 显示所有动画隐藏的元素
        document.querySelectorAll('[style*="opacity: 0"]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    });
}

/**
 * 性能优化：延迟加载图片
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// 初始化额外的交互
document.addEventListener('DOMContentLoaded', function() {
    initFeatureCardEffects();
    initImagePlaceholders();
    initArchitectureAnimation();
    initComparisonAnimation();
    initScrollReveal();
    initKeyboardNavigation();
    initPrintStyles();
    initLazyLoading();
    initLightbox();
});

/**
 * Lightbox 图片放大查看功能
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // 获取所有需要放大的图片（排除头像等小图）
    const contentImages = document.querySelectorAll(
        '.case-image img, .case-images-stack img, .case-comic img, ' +
        '.detail-image img, .intro-image img, .theory-origin img:not(.scholar-portrait img)'
    );

    // 给每张图片添加点击事件和样式
    contentImages.forEach(img => {
        img.classList.add('clickable-image');
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });

    // 打开 Lightbox
    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt || '';
        lightbox.classList.add('active');
        // 使用 requestAnimationFrame 确保过渡动画生效
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                lightbox.classList.add('show');
            });
        });
        document.body.style.overflow = 'hidden';
        // 重新渲染 Lucide 图标
        lucide.createIcons();
    }

    // 关闭 Lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.classList.remove('active');
            lightboxImage.src = '';
            document.body.style.overflow = '';
        }, 250);
    }

    // 点击关闭按钮
    lightboxClose.addEventListener('click', closeLightbox);

    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// 窗口大小调整时重新计算
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        lucide.createIcons();
    }, 250);
});

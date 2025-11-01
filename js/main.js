// 主要 JavaScript 功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单移动端切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // 切换汉堡菜单动画
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });

        // 点击导航链接后关闭菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    }

    // 平滑滚动到顶部
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.boxShadow = '';
            }
        }
    });

    // 加载首页数据
    loadHomeData();

    // 联系表单处理
    handleContactForm();

    // FAQ 功能
    handleFAQ();

    // 搜索功能
    initializeSearch();
});

// 加载首页数据
async function loadHomeData() {
    // 加载最新项目
    const featuredProjects = document.getElementById('featured-projects');
    if (featuredProjects) {
        try {
            const response = await fetch('data/projects.json');
            const projects = await response.json();
            const featured = projects.filter(p => p.featured).slice(0, 3);

            featuredProjects.innerHTML = featured.map(project => `
                <div class="project-card" onclick="window.location.href='projects.html'">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="display:none; padding: 2rem; text-align: center; color: var(--color-muted);">
                            项目图片
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载项目数据失败:', error);
            featuredProjects.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">加载项目数据时出错</p>';
        }
    }

    // 加载最新博客
    const recentPosts = document.getElementById('recent-posts');
    if (recentPosts) {
        try {
            const response = await fetch('data/blog-posts.json');
            const posts = await response.json();
            const recent = posts.filter(p => p.featured).slice(0, 3);

            recentPosts.innerHTML = recent.map(post => `
                <article class="blog-card" onclick="window.location.href='blog.html'">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <span class="blog-date">${formatDate(post.date)}</span>
                        <div class="blog-tags">
                            ${post.tags.slice(0, 2).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </article>
            `).join('');
        } catch (error) {
            console.error('加载博客数据失败:', error);
            recentPosts.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">加载博客数据时出错</p>';
        }
    }

    // 加载技能标签
    const skillsTags = document.getElementById('skills-tags');
    if (skillsTags) {
        const skills = [
            'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js',
            'Python', 'HTML5', 'CSS3', 'Git', 'Docker',
            'AWS', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API'
        ];

        skillsTags.innerHTML = skills.map(skill => `
            <span class="skill-tag">${skill}</span>
        `).join('');
    }
}

// 处理联系表单
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // 简单的表单验证
            if (!data.name || !data.email || !data.subject || !data.message) {
                showMessage('请填写所有必填字段', 'error');
                return;
            }

            if (!validateEmail(data.email)) {
                showMessage('请输入有效的邮箱地址', 'error');
                return;
            }

            // 模拟表单提交
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showMessage('消息已发送！我会尽快回复您。', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// 显示表单消息
function showMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// 邮箱验证
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 处理 FAQ
function handleFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        if (question && answer && toggle) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // 关闭所有其他 FAQ 项
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                        otherItem.querySelector('.faq-toggle').textContent = '+';
                    }
                });

                // 切换当前项
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    toggle.textContent = '+';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.textContent = '−';
                }
            });
        }
    });
}

// 初始化搜索功能
function initializeSearch() {
    // 项目搜索
    const projectSearch = document.getElementById('project-search');
    if (projectSearch) {
        projectSearch.addEventListener('input', debounce(function(e) {
            filterProjects(e.target.value);
        }, 300));
    }

    // 博客搜索
    const blogSearch = document.getElementById('blog-search');
    if (blogSearch) {
        blogSearch.addEventListener('input', debounce(function(e) {
            filterBlogPosts(e.target.value);
        }, 300));
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
}

// 项目筛选功能
function filterProjects(searchTerm) {
    // 这个函数将在 projects.js 中实现
    console.log('搜索项目:', searchTerm);
}

// 博客筛选功能
function filterBlogPosts(searchTerm) {
    // 这个函数将在 blog.js 中实现
    console.log('搜索博客:', searchTerm);
}

// 页面加载动画
window.addEventListener('load', function() {
    // 添加渐入动画
    const elements = document.querySelectorAll('.project-card, .blog-card, .skill-tag');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 导出函数供其他文件使用
window.SimplyTOC = {
    formatDate,
    debounce,
    showMessage
};
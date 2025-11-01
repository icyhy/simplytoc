// 博客页面专用 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    initializeCategoryFilter();
    initializeTagFilter();
    initializePagination();
    loadRecentPostsSidebar();
});

let allPosts = [];
let currentCategory = 'all';
let currentTag = '';
let currentPage = 1;
const postsPerPage = 6;

// 加载博客文章
async function loadBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    try {
        const response = await fetch('data/blog-posts.json');
        allPosts = await response.json();
        displayPosts();
    } catch (error) {
        console.error('加载博客文章失败:', error);
        container.innerHTML = '<p style="text-align: center;">加载博客数据时出错</p>';
    }
}

// 显示博客文章
function displayPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    let filteredPosts = filterPosts();

    // 计算分页
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    if (paginatedPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center;">没有找到匹配的文章</p>';
        updatePagination(filteredPosts.length);
        return;
    }

    container.innerHTML = paginatedPosts.map(post => `
        <article class="blog-post" data-category="${post.category}" data-tags="${post.tags.join(',')}">
            <div class="blog-post-header">
                <h2 class="blog-post-title">
                    <a href="#" onclick="showPostDetail(${post.id}); return false;">${post.title}</a>
                </h2>
                <div class="blog-post-meta">
                    <span class="blog-date">${SimplyTOC.formatDate(post.date)}</span>
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-read-time">${post.readTime} 分钟阅读</span>
                </div>
            </div>

            <div class="blog-post-excerpt">
                <p>${post.excerpt}</p>
            </div>

            <div class="blog-post-footer">
                <div class="blog-tags">
                    ${post.tags.map(tag => `
                        <a href="#" class="blog-tag" onclick="filterByTag('${tag}'); return false;">${tag}</a>
                    `).join('')}
                </div>
                <a href="#" class="read-more-link" onclick="showPostDetail(${post.id}); return false;">
                    阅读更多 →
                </a>
            </div>
        </article>
    `).join('');

    // 添加渐入动画
    const posts = container.querySelectorAll('.blog-post');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 100);
    });

    updatePagination(filteredPosts.length);
}

// 筛选文章
function filterPosts() {
    let filtered = allPosts;

    // 按分类筛选
    if (currentCategory !== 'all') {
        filtered = filtered.filter(post => post.category === currentCategory);
    }

    // 按标签筛选
    if (currentTag) {
        filtered = filtered.filter(post => post.tags.includes(currentTag));
    }

    // 按搜索关键词筛选
    const searchInput = document.getElementById('blog-search');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            post.category.toLowerCase().includes(searchTerm)
        );
    }

    return filtered;
}

// 初始化分类筛选
function initializeCategoryFilter() {
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有激活状态
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            currentCategory = this.dataset.category;
            currentTag = ''; // 重置标签筛选
            currentPage = 1; // 重置到第一页
            displayPosts();
        });
    });
}

// 初始化标签筛选
function initializeTagFilter() {
    const tagLinks = document.querySelectorAll('.tag-link');
    tagLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterByTag(this.dataset.tag);
        });
    });
}

// 按标签筛选
function filterByTag(tag) {
    currentTag = tag;
    currentCategory = 'all'; // 重置分类筛选
    currentPage = 1; // 重置到第一页

    // 更新分类链接状态
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');

    displayPosts();

    // 滚动到文章区域
    document.querySelector('.blog-main').scrollIntoView({ behavior: 'smooth' });
}

// 初始化分页
function initializePagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPosts();
                document.querySelector('.blog-main').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const filteredPosts = filterPosts();
            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayPosts();
                document.querySelector('.blog-main').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 搜索功能
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', SimplyTOC.debounce(function() {
            currentPage = 1; // 重置到第一页
            displayPosts();
        }, 300));
    }
}

// 更新分页控件
function updatePagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const paginationNumbers = document.querySelector('.pagination-numbers');

    // 更新上一页/下一页按钮状态
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // 更新页码
    if (paginationNumbers) {
        let pageNumbers = '';
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages) {
            // 显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
        } else {
            // 智能显示页码
            if (currentPage <= 2) {
                for (let i = 1; i <= 3; i++) {
                    pageNumbers += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
                }
            } else if (currentPage >= totalPages - 1) {
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pageNumbers += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
                }
            } else {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
                }
            }
        }

        paginationNumbers.innerHTML = pageNumbers;
    }
}

// 跳转到指定页码
function goToPage(page) {
    currentPage = page;
    displayPosts();
    document.querySelector('.blog-main').scrollIntoView({ behavior: 'smooth' });
}

// 加载侧边栏最新文章
async function loadRecentPostsSidebar() {
    const container = document.getElementById('recent-posts-sidebar');
    if (!container) return;

    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();
        const recent = posts.slice(0, 5);

        container.innerHTML = recent.map(post => `
            <li>
                <a href="#" onclick="showPostDetail(${post.id}); return false;" class="recent-post-link">
                    <span class="recent-post-title">${post.title}</span>
                    <span class="recent-post-date">${SimplyTOC.formatDate(post.date)}</span>
                </a>
            </li>
        `).join('');
    } catch (error) {
        console.error('加载最新文章失败:', error);
        container.innerHTML = '<li>加载失败</li>';
    }
}

// 显示文章详情（模拟）
function showPostDetail(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    // 这里可以实现文章详情页面或者弹窗
    // 目前只是显示一个简单的提示
    SimplyTOC.showMessage(`正在加载文章: ${post.title}`, 'info');

    // 在实际应用中，这里可能会跳转到文章详情页
    // window.location.href = `blog-post.html?id=${postId}`;
}

// 添加博客页面样式
const blogStyles = `
<style>
/* 博客布局 */
.blog-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--spacing-xl);
    align-items: start;
}

/* 侧边栏 */
.blog-sidebar {
    position: sticky;
    top: 100px;
}

.sidebar-section {
    margin-bottom: var(--spacing-xl);
}

.sidebar-section h3 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-primary);
    font-size: 1.125rem;
}

/* 分类列表 */
.category-list {
    list-style: none;
}

.category-link {
    display: block;
    padding: var(--spacing-xs) 0;
    color: var(--color-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
    border-left: 2px solid transparent;
    padding-left: var(--spacing-sm);
}

.category-link:hover,
.category-link.active {
    color: var(--color-accent);
    border-left-color: var(--color-accent);
}

/* 标签云 */
.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
}

.tag-link {
    background-color: var(--color-light);
    color: var(--color-secondary);
    padding: 4px 8px;
    border-radius: var(--border-radius-sm);
    font-size: 0.8rem;
    text-decoration: none;
    transition: all var(--transition-fast);
}

.tag-link:hover {
    background-color: var(--color-accent);
    color: var(--color-white);
}

/* 最新文章 */
.recent-posts {
    list-style: none;
}

.recent-post-link {
    display: block;
    padding: var(--spacing-xs) 0;
    color: var(--color-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.recent-post-link:hover {
    color: var(--color-accent);
}

.recent-post-title {
    display: block;
    font-weight: var(--font-weight-medium);
    margin-bottom: 2px;
}

.recent-post-date {
    display: block;
    font-size: 0.8rem;
    color: var(--color-muted);
}

/* 博客文章 */
.blog-post {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-border);
    transition: all var(--transition-normal);
}

.blog-post:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.blog-post-header {
    margin-bottom: var(--spacing-md);
}

.blog-post-title {
    margin: 0 0 var(--spacing-xs) 0;
}

.blog-post-title a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.blog-post-title a:hover {
    color: var(--color-accent);
}

.blog-post-meta {
    display: flex;
    gap: var(--spacing-md);
    font-size: 0.9rem;
    color: var(--color-muted);
    flex-wrap: wrap;
}

.blog-post-excerpt {
    margin-bottom: var(--spacing-md);
    line-height: 1.6;
}

.blog-post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.read-more-link {
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.read-more-link:hover {
    color: var(--color-accent-hover);
}

/* 分页 */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-xl);
}

.pagination-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-primary);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--color-primary);
    color: var(--color-white);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-numbers {
    display: flex;
    gap: 4px;
}

.pagination-number {
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-primary);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.pagination-number:hover {
    background-color: var(--color-light);
}

.pagination-number.active {
    background-color: var(--color-primary);
    color: var(--color-white);
    border-color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 1023px) {
    .blog-layout {
        grid-template-columns: 250px 1fr;
        gap: var(--spacing-lg);
    }
}

@media (max-width: 767px) {
    .blog-layout {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
    }

    .blog-sidebar {
        position: static;
        order: 2;
    }

    .blog-main {
        order: 1;
    }

    .blog-post-meta {
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .blog-post-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
`;

// 将样式添加到页面
document.head.insertAdjacentHTML('beforeend', blogStyles);
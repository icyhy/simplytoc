// 项目页面专用 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initializeFilters();
    initializeProjectModal();
});

let allProjects = [];
let currentFilter = 'all';
let currentSearch = '';

// 加载所有项目
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const response = await fetch('data/projects.json');
        allProjects = await response.json();
        displayProjects(allProjects);
    } catch (error) {
        console.error('加载项目失败:', error);
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">加载项目数据时出错</p>';
    }
}

// 显示项目
function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">没有找到匹配的项目</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}" onclick="showProjectDetail(${project.id})">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display:none; padding: 2rem; text-align: center; color: var(--color-muted);">
                    项目图片
                </div>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-category">${project.category}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-meta">
                    <span class="project-date">${SimplyTOC.formatDate(project.date)}</span>
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" onclick="event.stopPropagation()" target="_blank" class="project-link">GitHub</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" onclick="event.stopPropagation()" target="_blank" class="project-link">演示</a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // 添加渐入动画
    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 初始化筛选器
function initializeFilters() {
    // 分类筛选
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除所有激活状态
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            currentFilter = this.dataset.filter;
            applyFilters();
        });
    });

    // 搜索功能
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', SimplyTOC.debounce(function(e) {
            currentSearch = e.target.value.toLowerCase();
            applyFilters();
        }, 300));
    }
}

// 应用筛选器
function applyFilters() {
    let filteredProjects = allProjects;

    // 应用分类筛选
    if (currentFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.category === currentFilter);
    }

    // 应用搜索筛选
    if (currentSearch) {
        filteredProjects = filteredProjects.filter(project =>
            project.title.toLowerCase().includes(currentSearch) ||
            project.description.toLowerCase().includes(currentSearch) ||
            project.tags.some(tag => tag.toLowerCase().includes(currentSearch)) ||
            project.category.toLowerCase().includes(currentSearch)
        );
    }

    displayProjects(filteredProjects);
}

// 初始化项目详情弹窗
function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (modal && closeBtn) {
        // 关闭弹窗
        closeBtn.addEventListener('click', closeModal);

        // 点击背景关闭弹窗
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC 键关闭弹窗
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

// 显示项目详情
function showProjectDetail(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const detailContent = document.getElementById('project-detail');

    if (modal && detailContent) {
        detailContent.innerHTML = `
            <div class="project-detail">
                <div class="project-detail-header">
                    <h2>${project.title}</h2>
                    <span class="project-category">${project.category}</span>
                </div>

                <div class="project-detail-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display:none; padding: 3rem; text-align: center; color: var(--color-muted); background: var(--color-light);">
                        项目图片
                    </div>
                </div>

                <div class="project-detail-content">
                    <p class="project-detail-description">${project.description}</p>

                    <div class="project-detail-tags">
                        <h3>技术栈</h3>
                        <div class="tags-container">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>

                    <div class="project-detail-links">
                        <h3>项目链接</h3>
                        <div class="links-container">
                            ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary">查看源码</a>` : ''}
                            ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary">在线演示</a>` : ''}
                        </div>
                    </div>

                    <div class="project-detail-meta">
                        <p><strong>发布时间:</strong> ${SimplyTOC.formatDate(project.date)}</p>
                        ${project.featured ? '<p><strong>特色项目</strong> ⭐</p>' : ''}
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 加载更多功能
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 这里可以实现分页加载逻辑
            this.textContent = '已加载全部项目';
            this.disabled = true;
        });
    }
});

// 添加项目详情弹窗样式
const projectModalStyles = `
<style>
.modal {
    display: none;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background-color: var(--color-white);
    margin: 2% auto;
    padding: 0;
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideIn 0.3s ease;
}

.modal-close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: var(--color-muted);
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
    background: var(--color-white);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.modal-close:hover {
    color: var(--color-primary);
    background-color: var(--color-light);
}

.project-detail {
    padding: var(--spacing-xl);
}

.project-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.project-detail-header h2 {
    margin: 0;
    color: var(--color-primary);
}

.project-detail-image {
    margin-bottom: var(--spacing-lg);
    text-align: center;
}

.project-detail-image img {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-md);
}

.project-detail-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--color-secondary);
    margin-bottom: var(--spacing-lg);
}

.project-detail-tags,
.project-detail-links {
    margin-bottom: var(--spacing-lg);
}

.project-detail-tags h3,
.project-detail-links h3 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-primary);
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
}

.links-container {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

.project-detail-meta {
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
    color: var(--color-secondary);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 767px) {
    .modal-content {
        margin: 0;
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .project-detail {
        padding: var(--spacing-md);
    }

    .project-detail-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .modal-close {
        right: var(--spacing-sm);
        top: var(--spacing-sm);
    }
}
</style>
`;

// 将样式添加到页面
document.head.insertAdjacentHTML('beforeend', projectModalStyles);
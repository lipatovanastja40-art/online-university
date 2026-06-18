class CourseCatalog {
    constructor() {
        this.courseList = document.getElementById('courseList');
        this.searchInput = document.getElementById('searchInput');
        this.paginationContainer = document.getElementById('pagination');
        this.resultsCounter = document.getElementById('resultsCounter');
        this.shownCount = document.getElementById('shownCount');
        this.totalCount = document.getElementById('totalCount');
        
        this.allCourses = Array.from(document.querySelectorAll('.course-card'));
        this.filteredCourses = [...this.allCourses];
        this.currentPage = 1;
        this.itemsPerPage = 3;
        this.currentSort = 'default';
        this.searchQuery = '';
        
        this.init();
    }
    
    init() {
        this.updateTotalCount();
        
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.currentPage = 1;
            this.filterAndRender();
        });
        
        document.querySelectorAll('.btn-sort').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSort = btn.dataset.sort;
                this.currentPage = 1;
                this.filterAndRender();
            });
        });
        
        this.paginationContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-btn');
            if (!btn || btn.disabled) return;
            
            const page = btn.dataset.page;
            if (page === 'prev') {
                if (this.currentPage > 1) this.currentPage--;
            } else if (page === 'next') {
                const totalPages = this.getTotalPages();
                if (this.currentPage < totalPages) this.currentPage++;
            } else {
                this.currentPage = parseInt(page);
            }
            this.render();
        });
        
        this.filterAndRender();
    }
    
    filterAndRender() {
        this.filteredCourses = this.allCourses.filter(course => {
            const title = course.dataset.title.toLowerCase();
            return title.includes(this.searchQuery);
        });
        
        this.sortCourses();
        
        this.updateTotalCount();
        
        this.render();
    }
    
    sortCourses() {
        if (this.currentSort === 'default') {
            this.filteredCourses.sort((a, b) => {
                return parseInt(a.dataset.id) - parseInt(b.dataset.id);
            });
        } else if (this.currentSort === 'title') {
            this.filteredCourses.sort((a, b) => {
                return a.dataset.title.localeCompare(b.dataset.title);
            });
        } else if (this.currentSort === 'price') {
            this.filteredCourses.sort((a, b) => {
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            });
        } else if (this.currentSort === 'rating') {
            this.filteredCourses.sort((a, b) => {
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            });
        }
    }
    
    getTotalPages() {
        return Math.ceil(this.filteredCourses.length / this.itemsPerPage) || 1;
    }
    
    render() {
        const totalPages = this.getTotalPages();
        
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.filteredCourses.slice(start, end);
        
        this.allCourses.forEach(course => {
            course.style.display = 'none';
        });
        
        pageItems.forEach(course => {
            course.style.display = 'block';
        });
        
        this.updateCounter(start, end);
        
        this.renderPagination(totalPages);
    }
    
    renderPagination(totalPages) {
        const prevBtn = this.paginationContainer.querySelector('[data-page="prev"]');
        const nextBtn = this.paginationContainer.querySelector('[data-page="next"]');
        
        this.paginationContainer.querySelectorAll('.page-btn:not([data-page="prev"]):not([data-page="next"])')
            .forEach(btn => btn.remove());
        

        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn${i === this.currentPage ? ' active' : ''}`;
            btn.dataset.page = i;
            btn.textContent = i;
            this.paginationContainer.insertBefore(btn, nextBtn);
        }
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
    }
    
    updateTotalCount() {
        this.totalCount.textContent = this.filteredCourses.length;
    }
    
    updateCounter(start, end) {
        const total = this.filteredCourses.length;
        const shown = Math.min(end, total) - start;
        this.shownCount.textContent = total > 0 ? shown : 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CourseCatalog();
});
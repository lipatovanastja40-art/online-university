// course-detail.js - Логика для детальной страницы курса

class CourseDetail {
    constructor() {
        // Галерея
        this.mainImage = document.getElementById('mainImageSrc');
        this.thumbnails = document.querySelectorAll('.thumbnail');
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalClose = document.getElementById('modalClose');
        
        // Отзывы
        this.reviewsList = document.getElementById('reviewsList');
        this.reviewForm = document.getElementById('reviewForm');
        this.reviewAuthor = document.getElementById('reviewAuthor');
        this.reviewText = document.getElementById('reviewText');
        this.reviewRatingValue = document.getElementById('reviewRatingValue');
        this.stars = document.querySelectorAll('.star');
        this.reviewsCount = document.getElementById('reviewsCount');
        this.totalReviews = document.getElementById('totalReviews');
        
        // ID курса (для localStorage)
        this.courseId = 'python-beginner';
        
        // Инициализация
        this.init();
    }
    
    init() {
        // 1. Галерея - клик по миниатюрам
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                this.changeMainImage(thumb);
            });
        });
        
        // 2. Галерея - клик по главному изображению для увеличения
        this.mainImage.addEventListener('click', () => {
            this.openModal(this.mainImage.src);
        });
        
        // 3. Модальное окно
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // 4. Звездный рейтинг
        this.stars.forEach(star => {
            star.addEventListener('click', () => {
                this.setRating(parseInt(star.dataset.value));
            });
            
            star.addEventListener('mouseenter', () => {
                this.highlightStars(parseInt(star.dataset.value));
            });
            
            star.addEventListener('mouseleave', () => {
                this.resetStars();
            });
        });
        
        // 5. Форма отзыва
        this.reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addReview();
        });
        
        // 6. Загрузка сохраненных отзывов
        this.loadReviews();
    }
    
    // === ГАЛЕРЕЯ ===
    
    changeMainImage(thumb) {
        // Обновляем главное изображение
        const fullImageUrl = thumb.dataset.full || thumb.src;
        this.mainImage.src = fullImageUrl;
        this.mainImage.alt = thumb.alt;
        
        // Обновляем активный класс
        this.thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    }
    
    // === МОДАЛЬНОЕ ОКНО ===
    
    openModal(imageSrc) {
        this.modalImage.src = imageSrc;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // === ЗВЕЗДНЫЙ РЕЙТИНГ ===
    
    setRating(value) {
        this.reviewRatingValue.value = value;
        this.highlightStars(value);
    }
    
    highlightStars(value) {
        this.stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= value) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }
    
    resetStars() {
        const currentValue = parseInt(this.reviewRatingValue.value);
        this.highlightStars(currentValue);
    }
    
    // === ОТЗЫВЫ ===
    
    addReview() {
        const author = this.reviewAuthor.value.trim();
        const text = this.reviewText.value.trim();
        const rating = parseInt(this.reviewRatingValue.value);
        
        if (!author || !text) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        // Создаем новый отзыв
        const review = {
            id: Date.now(),
            author: author,
            text: text,
            rating: rating,
            date: new Date().toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            avatar: this.generateAvatar(author)
        };
        
        // Добавляем в список
        this.addReviewToList(review);
        
        // Сохраняем в localStorage
        this.saveReview(review);
        
        // Обновляем счетчик
        this.updateReviewCount();
        
        // Очищаем форму
        this.reviewAuthor.value = '';
        this.reviewText.value = '';
        this.setRating(5);
        
        // Показываем уведомление
        this.showNotification('Отзыв успешно добавлен!');
    }
    
    addReviewToList(review) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.dataset.reviewId = review.id;
        reviewElement.style.animation = 'fadeInUp 0.5s ease';
        
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="avatar" style="background: ${review.avatar.color};">
                    ${review.avatar.initials}
                </div>
                <div>
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <span class="review-rating">${stars}</span>
            </div>
            <p class="review-text">${review.text}</p>
        `;
        
        // Вставляем в начало списка
        this.reviewsList.insertBefore(reviewElement, this.reviewsList.firstChild);
    }
    
    generateAvatar(name) {
        const initials = name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        
        const colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
            '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
        ];
        const colorIndex = name.length % colors.length;
        
        return {
            initials: initials,
            color: colors[colorIndex]
        };
    }
    
    // === LOCALSTORAGE ===
    
    saveReview(review) {
        const key = `reviews_${this.courseId}`;
        let reviews = JSON.parse(localStorage.getItem(key)) || [];
        reviews.unshift(review);
        localStorage.setItem(key, JSON.stringify(reviews));
    }
    
    loadReviews() {
        const key = `reviews_${this.courseId}`;
        const savedReviews = JSON.parse(localStorage.getItem(key)) || [];
        
        // Добавляем сохраненные отзывы (кроме уже существующих статических)
        savedReviews.forEach(review => {
            // Проверяем, не добавлен ли уже этот отзыв
            const exists = document.querySelector(`[data-review-id="${review.id}"]`);
            if (!exists) {
                this.addReviewToList(review);
            }
        });
        
        this.updateReviewCount();
    }
    
    updateReviewCount() {
        const allReviews = this.reviewsList.querySelectorAll('.review-item');
        const count = allReviews.length;
        this.reviewsCount.textContent = count;
        this.totalReviews.textContent = `${count} отзывов`;
    }
    
    // === УВЕДОМЛЕНИЯ ===
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new CourseDetail();
});
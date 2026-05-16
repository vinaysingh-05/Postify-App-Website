// Mouse follow glow effect
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
});

// Navbar blur on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FAQ Toggle
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');
    const item = button.parentElement;

    document.querySelectorAll('.faq-content').forEach(el => {
        if (el !== content) {
            el.classList.add('hidden');
            el.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
            el.parentElement.classList.remove('faq-open');
        }
    });

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
        item.classList.add('faq-open');
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
        item.classList.remove('faq-open');
    }
}

// Modals Logic
const overlay = document.getElementById('modal-overlay');
const modals = document.querySelectorAll('.modal-content');

function openModal(id) {
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        document.getElementById(id).classList.remove('hidden');
        setTimeout(() => {
            document.getElementById(id).classList.remove('scale-95');
        }, 10);
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.classList.add('opacity-0');
    modals.forEach(modal => {
        modal.classList.add('scale-95');
    });
    setTimeout(() => {
        overlay.classList.add('hidden');
        modals.forEach(modal => modal.classList.add('hidden'));
        document.body.style.overflow = 'auto';
    }, 300);
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

// Simulated Download Button
function simulateDownload(btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-spinner animate-spin" style="font-size:1.25rem"></i> Preparing Secure Download...';
    btn.style.background = '#00d9ff';
    btn.style.color = '#000';

    setTimeout(() => {
        showToast("Download started securely.");
        btn.innerHTML = '<i class="ph ph-check" style="font-size:1.25rem"></i> Downloaded';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    }, 2000);
}

// Real-time Feedback Logic
let currentRating = 5;
const hearts = document.querySelectorAll('#rating-hearts i');

function setRating(rating) {
    currentRating = rating;
    hearts.forEach((heart, index) => {
        if (index < rating) {
            heart.style.color = '#00d9ff';
        } else {
            heart.style.color = '#475569';
        }
    });
}

// Initialize rating
setRating(5);

function submitFeedback(e) {
    e.preventDefault();
    const name = document.getElementById('fb-name').value;
    const message = document.getElementById('fb-message').value;
    const feedTrack = document.getElementById('live-feed-track');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (!name || !message) return;

    let heartsHtml = '';
    for (let i = 0; i < currentRating; i++) heartsHtml += '<i class="ph-fill ph-heart"></i>';

    const initial = name.charAt(0).toUpperCase();

    const newFeedback = document.createElement('div');
    newFeedback.className = 'feedback-card flex-shrink-0 relative';
    newFeedback.style.cssText = 'width:340px; padding:2rem; opacity:0; transform:scale(0.95); transition: all 0.5s ease;';
    newFeedback.innerHTML = `
        <div class="feedback-quote-mark">"</div>
        <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(to right,#00d9ff,#38bdf8);"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;position:relative;z-index:10;">
            <div style="display:flex;align-items:center;gap:1rem;">
                <div style="width:3rem;height:3rem;border-radius:50%;background:linear-gradient(135deg,#00d9ff,#38bdf8);display:flex;align-items:center;justify-content:center;font-weight:700;color:#000;font-size:1.125rem;box-shadow:0 0 15px rgba(0,217,255,0.5);">${initial}</div>
                <div>
                    <span style="font-weight:700;color:#fff;display:block;font-size:1.125rem;">${name}</span>
                    <span style="font-size:0.75rem;color:#00d9ff;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Just now</span>
                </div>
            </div>
            <div style="display:flex;color:#00d9ff;font-size:0.875rem;filter:drop-shadow(0 0 8px rgba(0,217,255,0.8));">${heartsHtml}</div>
        </div>
        <p style="font-size:1rem;color:#cbd5e1;line-height:1.625;position:relative;z-index:10;font-weight:300;">"${message}"</p>
    `;

    feedTrack.insertBefore(newFeedback, feedTrack.firstChild);

    setTimeout(() => {
        newFeedback.style.opacity = '1';
        newFeedback.style.transform = 'scale(1)';
    }, 50);

    feedTrack.style.animationPlayState = 'paused';
    setTimeout(() => feedTrack.style.animationPlayState = 'running', 2000);

    const origText = submitBtn.innerText;
    submitBtn.innerText = 'Vibe Shared!';
    submitBtn.style.background = '#4ade80';

    e.target.reset();
    setRating(5);

    setTimeout(() => {
        submitBtn.innerText = origText;
        submitBtn.style.background = '';
    }, 2000);

    if (feedTrack.children.length > 10) {
        feedTrack.lastChild.remove();
    }
}

// Custom Toast Notification System
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'glass-panel';
    toast.style.cssText = `
        position:fixed; bottom:1.25rem; right:1.25rem;
        border:1px solid rgba(0,217,255,0.5);
        padding:0.75rem 1.5rem; border-radius:0.75rem;
        box-shadow:0 0 30px rgba(138,190,224,0.2);
        display:flex; align-items:center; gap:0.75rem;
        z-index:9999; transform:translateY(2.5rem); opacity:0;
        transition:all 0.3s ease;
    `;
    toast.innerHTML = `<i class="ph-fill ph-check-circle" style="color:#00d9ff;font-size:1.25rem;"></i> <span style="font-size:0.875rem;font-weight:500;color:#fff;">${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(2.5rem)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Screenshot gallery row generation
window.addEventListener('DOMContentLoaded', () => {
    const galleryRow = document.getElementById('gallery-row');
    if (galleryRow) {
        const images1 = [
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1470071131384-001b85755b36?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506744626753-1fa44df14d28?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop"
        ];
        const row1 = [...images1, ...images1];
        row1.forEach(src => {
            const div = document.createElement('div');
            div.style.cssText = 'width:320px;height:500px;border-radius:2rem;padding:0.5rem;flex-shrink:0;overflow:hidden;transition:transform 0.5s ease;';
            div.classList.add('glass-panel', 'gallery-card');
            div.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:1.5rem;filter:brightness(0.75);transition:all 0.5s ease;" alt="App Screen" onmouseover="this.style.filter='brightness(1)'" onmouseout="this.style.filter='brightness(0.75)'">`;
            galleryRow.appendChild(div);
        });
    }
});

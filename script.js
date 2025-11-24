// Theme Management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme (default to dark to match design)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Typing Animation
const typingText = document.getElementById('typingText');
const typingWords = [
    { en: 'Frontend Engineer', ar: 'مهندس واجهات أمامية' },
    { en: 'Network Engineer', ar: 'مهندس شبكات' },
    { en: 'Full Stack Developer', ar: 'مطور Full Stack' },
    { en: 'Web Developer', ar: 'مطور ويب' }
];

let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingTimeout = null;

function typeText() {
    if (!typingText) return;
    
    const currentLang = localStorage.getItem('language') || 'en';
    const currentWord = typingWords[currentWordIndex][currentLang];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && currentCharIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % typingWords.length;
        typeSpeed = 500;
    }

    typingTimeout = setTimeout(typeText, typeSpeed);
}

// Start typing animation
if (typingText) {
    typeText();
}

// Function to restart typing animation
function restartTyping() {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    currentWordIndex = 0;
    currentCharIndex = 0;
    isDeleting = false;
    if (typingText) {
        typingText.textContent = '';
        typeText();
    }
}

// Navigation Active State
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Language Management
const langToggle = document.getElementById('langToggle');
const langText = document.getElementById('langText');
currentLang = localStorage.getItem('language') || 'en';

// Initialize language
setLanguage(currentLang);

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(currentLang);
    localStorage.setItem('language', currentLang);
    // Restart typing animation with new language
    restartTyping();
});

function setLanguage(lang) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    langText.textContent = lang === 'ar' ? 'AR' : 'EN';
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update form placeholders
    updateFormPlaceholders();
}

// Update form placeholders based on language
function updateFormPlaceholders() {
    const inputs = document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]');
    inputs.forEach(input => {
        const attr = `data-placeholder-${currentLang}`;
        const placeholder = input.getAttribute(attr);
        if (placeholder) {
            input.setAttribute('placeholder', placeholder);
        }
    });
}

// PDF Download Functionality
const pdfDownload = document.getElementById('pdfDownload');

pdfDownload.addEventListener('click', () => {
    // Show loading state
    pdfDownload.disabled = true;
    pdfDownload.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-en="Generating..." data-ar="جارٍ التوليد...">Generating...</span>';
    
    // Get current language
    const isArabic = currentLang === 'ar';
    
    // Create a professional CV-style container
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-content';
    pdfContainer.style.width = '210mm';
    pdfContainer.style.minHeight = '297mm';
    pdfContainer.style.padding = '15mm';
    pdfContainer.style.background = '#ffffff';
    pdfContainer.style.color = '#000000';
    pdfContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
    pdfContainer.style.fontSize = '11pt';
    pdfContainer.style.lineHeight = '1.6';
    
    // Professional Header
    const header = document.createElement('div');
    header.style.marginBottom = '25px';
    header.style.paddingBottom = '20px';
    header.style.borderBottom = '3px solid #6366f1';
    header.style.textAlign = 'center';
    
    const name = document.querySelector('.name').textContent;
    const title = document.querySelector('.title').textContent;
    const contactInfo = document.querySelector('.contact-info');
    
    header.innerHTML = `
        <h1 style="font-size: 28pt; color: #6366f1; margin: 0 0 8px 0; font-weight: bold;">${name}</h1>
        <h2 style="font-size: 14pt; color: #4a4a4a; margin: 0 0 15px 0; font-weight: normal;">${title}</h2>
        <div style="font-size: 10pt; color: #666; line-height: 1.8;">
            ${Array.from(contactInfo.querySelectorAll('p')).map(p => {
                const text = p.textContent.trim();
                return `<span style="margin: 0 10px;">${text}</span>`;
            }).join(' | ')}
        </div>
    `;
    pdfContainer.appendChild(header);
    
    // About Section
    const aboutSection = document.querySelector('#about .section-content p');
    if (aboutSection) {
        const aboutDiv = document.createElement('div');
        aboutDiv.style.marginBottom = '20px';
        aboutDiv.innerHTML = `
            <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${isArabic ? 'نبذة عني' : 'About Me'}
            </h3>
            <p style="text-align: justify; margin: 0;">${aboutSection.textContent}</p>
        `;
        pdfContainer.appendChild(aboutDiv);
    }
    
    // Projects Section
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
        const projectsDiv = document.createElement('div');
        projectsDiv.style.marginBottom = '20px';
        projectsDiv.style.pageBreakInside = 'avoid';
        let projectsHTML = `
            <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${isArabic ? 'المشاريع' : 'Projects'}
            </h3>
        `;
        projectsSection.querySelectorAll('.project-card').forEach((card, index) => {
            const title = card.querySelector('h3').textContent.replace(/^\w+\s/, '');
            const desc = card.querySelector('p').textContent;
            const link = card.querySelector('.project-link');
            const url = link && link.href ? link.href : (link && link.textContent.includes('Private') ? 'Private System' : '');
            projectsHTML += `
                <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-left: 4px solid #6366f1;">
                    <h4 style="font-size: 12pt; color: #333; margin: 0 0 5px 0; font-weight: bold;">${title}</h4>
                    <p style="font-size: 10pt; color: #666; margin: 0 0 5px 0;">${desc}</p>
                    ${url ? `<p style="font-size: 9pt; color: #6366f1; margin: 0;">${url}</p>` : ''}
                </div>
            `;
        });
        projectsDiv.innerHTML = projectsHTML;
        pdfContainer.appendChild(projectsDiv);
    }
    
    // Education Section
    const educationSection = document.querySelector('#education');
    if (educationSection) {
        const eduDiv = document.createElement('div');
        eduDiv.style.marginBottom = '20px';
        const eduItem = educationSection.querySelector('.education-item');
        if (eduItem) {
            const uni = eduItem.querySelector('h3').textContent;
            const status = eduItem.querySelector('p').textContent;
            eduDiv.innerHTML = `
                <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                    ${isArabic ? 'التعليم' : 'Education'}
                </h3>
                <div style="padding: 10px; background: #f9f9f9;">
                    <h4 style="font-size: 12pt; margin: 0 0 5px 0; font-weight: bold;">${uni}</h4>
                    <p style="font-size: 10pt; color: #666; margin: 0;">${status}</p>
                </div>
            `;
        }
        pdfContainer.appendChild(eduDiv);
    }
    
    // Achievements Section
    const achievementsSection = document.querySelector('#achievements');
    if (achievementsSection) {
        const achDiv = document.createElement('div');
        achDiv.style.marginBottom = '20px';
        let achHTML = `
            <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${isArabic ? 'الإنجازات' : 'Achievements'}
            </h3>
        `;
        achievementsSection.querySelectorAll('.achievement-item').forEach(item => {
            const title = item.querySelector('h3').textContent;
            const desc = item.querySelector('p').textContent;
            achHTML += `
                <div style="margin-bottom: 12px; padding: 10px; background: #f9f9f9; border-left: 4px solid #6366f1;">
                    <h4 style="font-size: 11pt; margin: 0 0 5px 0; font-weight: bold;">${title}</h4>
                    <p style="font-size: 10pt; color: #666; margin: 0;">${desc}</p>
                </div>
            `;
        });
        achDiv.innerHTML = achHTML;
        pdfContainer.appendChild(achDiv);
    }
    
    // Skills Section
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillsDiv = document.createElement('div');
        skillsDiv.style.marginBottom = '20px';
        skillsDiv.style.pageBreakInside = 'avoid';
        let skillsHTML = `
            <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${isArabic ? 'المهارات التقنية' : 'Technical Skills'}
            </h3>
        `;
        
        // Programming Languages
        const langItems = skillsSection.querySelectorAll('.skills-category:first-of-type .skill-item');
        if (langItems.length > 0) {
            skillsHTML += `<h4 style="font-size: 11pt; margin: 15px 0 10px 0; font-weight: bold;">${isArabic ? 'لغات البرمجة' : 'Programming Languages'}</h4>`;
            langItems.forEach(item => {
                const name = item.querySelector('span').textContent;
                const percent = item.querySelector('.skill-percent').textContent;
                skillsHTML += `
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                            <span style="font-size: 10pt; font-weight: 600;">${name}</span>
                            <span style="font-size: 10pt; color: #6366f1;">${percent}</span>
                        </div>
                        <div style="height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: #6366f1; width: ${percent};"></div>
                        </div>
                    </div>
                `;
            });
        }
        
        // Frameworks
        const frameworks = skillsSection.querySelectorAll('.skills-category:nth-of-type(2) .skill-tag');
        if (frameworks.length > 0) {
            skillsHTML += `<h4 style="font-size: 11pt; margin: 15px 0 10px 0; font-weight: bold;">${isArabic ? 'الأطر والمكتبات' : 'Frameworks & Libraries'}</h4>`;
            skillsHTML += `<p style="font-size: 10pt; margin: 0;">${Array.from(frameworks).map(f => f.textContent.trim()).join(', ')}</p>`;
        }
        
        // Databases
        const databases = skillsSection.querySelectorAll('.skills-category:nth-of-type(3) .skill-tag');
        if (databases.length > 0) {
            skillsHTML += `<h4 style="font-size: 11pt; margin: 15px 0 10px 0; font-weight: bold;">${isArabic ? 'قواعد البيانات' : 'Databases'}</h4>`;
            skillsHTML += `<p style="font-size: 10pt; margin: 0;">${Array.from(databases).map(d => d.textContent.trim()).join(', ')}</p>`;
        }
        
        skillsDiv.innerHTML = skillsHTML;
        pdfContainer.appendChild(skillsDiv);
    }
    
    // Network Knowledge
    const networkSection = document.querySelector('#networks');
    if (networkSection) {
        const networkDiv = document.createElement('div');
        networkDiv.style.marginBottom = '20px';
        networkDiv.style.pageBreakInside = 'avoid';
        let networkHTML = `
            <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${isArabic ? 'معرفة هندسة الشبكات' : 'Network Engineering Knowledge'}
            </h3>
        `;
        networkSection.querySelectorAll('.network-card').forEach(card => {
            const type = card.querySelector('h3').textContent;
            const name = card.querySelector('.network-name').textContent;
            const desc = card.querySelector('.network-desc').textContent;
            const range = card.querySelector('.network-range').textContent;
            networkHTML += `
                <div style="margin-bottom: 15px; padding: 12px; background: #f9f9f9; border-left: 4px solid #6366f1;">
                    <h4 style="font-size: 11pt; margin: 0 0 5px 0; font-weight: bold;">${type} - ${name}</h4>
                    <p style="font-size: 10pt; color: #666; margin: 0 0 5px 0;">${desc}</p>
                    <p style="font-size: 9pt; color: #6366f1; margin: 0; font-weight: 600;">${range}</p>
                </div>
            `;
        });
        networkDiv.innerHTML = networkHTML;
        pdfContainer.appendChild(networkDiv);
    }
    
    // Languages
    const languagesSection = document.querySelector('#languages');
    if (languagesSection) {
        const langDiv = document.createElement('div');
        langDiv.style.marginBottom = '20px';
        let langHTML = `
            <h3 style="font-size: 14pt; color: #6366f1; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${isArabic ? 'اللغات' : 'Languages'}
            </h3>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        `;
        languagesSection.querySelectorAll('.language-item').forEach(item => {
            const lang = item.querySelector('h3').textContent;
            const level = item.querySelector('p').textContent;
            langHTML += `
                <div style="padding: 10px; background: #f9f9f9; border-left: 4px solid #6366f1; min-width: 150px;">
                    <h4 style="font-size: 11pt; margin: 0 0 5px 0; font-weight: bold;">${lang}</h4>
                    <p style="font-size: 10pt; color: #666; margin: 0;">${level}</p>
                </div>
            `;
        });
        langHTML += '</div>';
        langDiv.innerHTML = langHTML;
        pdfContainer.appendChild(langDiv);
    }
    
    // Hide original content and show PDF container
    const originalBody = document.body.style.visibility;
    const originalContent = document.querySelector('.main-content').style.visibility;
    document.body.style.visibility = 'hidden';
    
    // Append to body temporarily
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.appendChild(pdfContainer);
    document.body.appendChild(tempDiv);
    
    // Configure PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `Ahmed_Elsayed_Professional_Profile.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 794, // A4 width in pixels at 96 DPI
            windowHeight: 1123 // A4 height in pixels at 96 DPI
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Generate PDF
    html2pdf().set(opt).from(pdfContainer).save().then(() => {
        // Clean up
        document.body.removeChild(tempDiv);
        document.body.style.visibility = originalBody;
        
        // Reset button
        pdfDownload.disabled = false;
        pdfDownload.innerHTML = '<i class="fas fa-download"></i> <span data-en="Download PDF" data-ar="تحميل PDF">Download PDF</span>';
        setLanguage(currentLang); // Refresh language text
    }).catch(err => {
        console.error('PDF generation error:', err);
        pdfDownload.disabled = false;
        pdfDownload.innerHTML = '<i class="fas fa-download"></i> <span data-en="Download PDF" data-ar="تحميل PDF">Download PDF</span>';
        setLanguage(currentLang);
        alert('Error generating PDF. Please try again.');
    });
});

// Smooth scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Add loading animation for images
const profileImage = document.getElementById('profileImage');
if (profileImage) {
    profileImage.addEventListener('load', function() {
        this.style.opacity = '0';
        this.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 100);
    });
}

// Add hover effects to cards
document.querySelectorAll('.glass-effect').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize animations on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Video Thumbnail Click Handler
document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
    const videoId = thumbnail.getAttribute('data-video-id');
    const watchBtn = thumbnail.querySelector('.watch-video-btn');
    
    thumbnail.addEventListener('click', () => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    });
    
    if (watchBtn) {
        watchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        });
    }
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        const formMessage = document.getElementById('formMessage');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        
        // Use FormSubmit.co or similar service
        try {
            const response = await fetch('https://formsubmit.co/ajax/eng.ahmed.elsayed.saber@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.textContent = currentLang === 'ar' 
                    ? 'تم إرسال رسالتك بنجاح!' 
                    : 'Your message has been sent successfully!';
                contactForm.reset();
                
                // Reset labels
                contactForm.querySelectorAll('input, textarea').forEach(input => {
                    input.classList.remove('has-value');
                });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = currentLang === 'ar' 
                ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' 
                : 'An error occurred. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}


// Add click animation to buttons
document.querySelectorAll('button, a').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


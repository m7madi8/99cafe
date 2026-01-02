// Minimal i18n map for visible labels. Extend as needed.
const i18n = {
  en: {
    hero: "It's more than a number",
    tryLuck: "Try your luck!",
    spin: "Spin the wheel",
    haveCode: "I have a code",
    menu: "menu",
    serviceChip: "10% service charge applies",
    serviceTooltip: "A 10% service charge will be added to your bill",
    drinks: "Drinks",
    food: "Food",
    desserts: "Desserts",
    hookah: "Hookah",
    loading: "Loading",
    surpriseTitle: "Your Surprise Drink",
    tryAnother: "Try another",
    gotoDrinks: "Go to Drinks",
    prizes: {
      TRY_AGAIN: "Better luck next time",
      BARISTA_CHOICE: "Barista's Mandatory Challenge",
      OFF10: "10% off next order",
      FREE_UPGRADE: "Free size upgrade",
      FREE_DRINK: "Free drink of your choice"
    },
    // Wheel modal & code modal
    codeHeader: "99cafe says",
    codePrompt: "Enter secret to retry:",
    codePlaceholder: "Enter secret",
    codeConfirm: "Confirm",
    wheelPlayed: "You already played today. Come back tomorrow!",
    wheelCongrats: "Congratulations! ??",
    wheelWinDate: "Win date:",
    wheelCopy: "Copy",
    wheelCopied: "Copied",
    wheelCopyFailed: "Copy failed",
    wheelShowStaff: "Show this to the service staff.",
    wheelLoseTitle: "Better luck next time!",
    wheelLoseBody: "Try again tomorrow.",
    freeDrinkCongratsTitle: "?? Congrats! Thursday Special Prize",
    freeDrinkCongratsBody: "You won a free drink of your choice during the special time! ??",
    validTodayOnly: "Valid today only",
    valid3DaysUntil: (date) => `Valid for 3 days until ${date}`,
    secretAccepted: "Secret accepted. You can spin again now!",
    unlimitedEnabled: "Unlimited mode enabled for this device. You can spin anytime.",
    invalidCode: "Invalid code.",
    pleaseEnterSecret: "Please enter the secret.",
  }
};

// Category switching functionality
const categoryTabs = document.querySelectorAll('.category-tab');
const categoryContents = document.querySelectorAll('.category-content');

function updateCategoryTabIcons() {
    categoryTabs.forEach(tab => {
        const img = tab.querySelector('img[data-default-icon][data-active-icon]');
        if (!img) return;
        const defaultSrc = img.getAttribute('data-default-icon');
        const activeSrc = img.getAttribute('data-active-icon');
        const isActive = tab.classList.contains('active');
        img.src = isActive ? activeSrc : defaultSrc;
        if (img.hasAttribute('data-white-when-active')) {
            if (isActive) {
                img.classList.add('tab-icon-white');
            } else {
                img.classList.remove('tab-icon-white');
            }
        }
    });
}

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetCategory = tab.getAttribute('data-category');
        
        // Ripple visual
        const rect = tab.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';
        ripple.style.left = rect.width / 2 + 'px';
        ripple.style.top = rect.height / 2 + 'px';
        tab.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);

        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        categoryTabs.forEach(t => {
            t.classList.remove('bg-cafe-red', 'text-cafe-white');
            t.classList.add('bg-cafe-gray', 'text-cafe-black');
        });
        
        // Add active class to clicked tab
        tab.classList.add('active');
        tab.classList.remove('bg-cafe-gray', 'text-cafe-black');
        tab.classList.add('bg-cafe-red', 'text-cafe-white');
        updateCategoryTabIcons();
        
        // Hide all category contents
        categoryContents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('show');
        });
        
        // Show target category content with fade
        const target = document.getElementById(targetCategory);
        target.classList.remove('hidden');
        requestAnimationFrame(() => target.classList.add('show'));
    });
});
// Initialize icons on first load
updateCategoryTabIcons();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Surprise Drink feature
(function surpriseDrink() {
    const logo = document.getElementById('heroLogo');
    const tryLuckBtn = document.getElementById('tryLuckBtn');
    const modal = document.getElementById('surpriseModal');
    const closeBtn = document.getElementById('closeSurprise');
    const anotherBtn = document.getElementById('anotherSurprise');
    const gotoBtn = document.getElementById('gotoDrinks');
    const nameEl = document.getElementById('surpriseName');
    const hintEl = document.getElementById('surpriseHint');

    if (!logo || !modal) return;

    // Smoothly reveal the hero text badge after load (with safe spacing from logo)
    const textBadge = document.getElementById('heroTextBadge');
    if (textBadge) {
        setTimeout(() => {
            // ensure it sits above logo with a small gap on small screens
            textBadge.style.top = '-12px';
            textBadge.classList.remove('opacity-0');
            textBadge.classList.remove('translate-y-2');
        }, 700);
    }

    const drinks = [
        { en: { name: 'Ice Spanish Latte', hint: 'Cold, creamy, and sweet' }, ar: { name: '?????? ????? ????', hint: '????? ?????? ????' }, temp: 'cold' },
        { en: { name: 'Ice Caramel Latte', hint: 'Icy caramel delight' }, ar: { name: '??????? ????? ????', hint: '???? ???????? ????????' }, temp: 'cold' },
        { en: { name: 'Ice French Vanilla', hint: 'Vanilla chilled goodness' }, ar: { name: '?????? ?????? ??????', hint: '?????? ????? ??????' }, temp: 'cold' },
        { en: { name: 'Ice White Mocha', hint: 'Smooth and milky' }, ar: { name: '???? ???? ????', hint: '????? ???????' }, temp: 'cold' },
        { en: { name: 'Ice Dark Mocha', hint: 'Rich chocolate kick' }, ar: { name: '???? ???? ????', hint: '???? ???????? ????' }, temp: 'cold' },
        { en: { name: 'Ice Vanilla Latte', hint: 'Classic vanilla on ice' }, ar: { name: '?????? ????? ????', hint: '?????? ???????? ??? ?????' }, temp: 'cold' },
        { en: { name: 'Ice Hazelnut Latte', hint: 'Nutty and refreshing' }, ar: { name: '???? ????? ????', hint: '????? ?????? ??????' }, temp: 'cold' },
        { en: { name: 'Caramel Latte', hint: 'Warm and comforting' }, ar: { name: '??????? ?????', hint: '???? ?????' }, temp: 'hot' },
        { en: { name: 'French Vanilla', hint: 'A cozy classic' }, ar: { name: '?????? ??????', hint: '??????? ????' }, temp: 'hot' },
        { en: { name: 'Spanish Latte', hint: 'Balanced and smooth' }, ar: { name: '?????? ?????', hint: '?????? ?????' }, temp: 'hot' },
        { en: { name: 'Vanilla Latte', hint: 'Gentle sweetness' }, ar: { name: '?????? ?????', hint: '????? ?????' }, temp: 'hot' },
        { en: { name: 'Hazelnut Latte', hint: 'Nutty aroma' }, ar: { name: '???? ?????', hint: '???? ????????' }, temp: 'hot' },
        { en: { name: 'Espresso', hint: 'Strong and bold' }, ar: { name: '???????', hint: '??? ?????' }, temp: 'hot' },
        { en: { name: 'Americano', hint: 'Light and smooth' }, ar: { name: '????????', hint: '???? ?????' }, temp: 'hot' },
        { en: { name: 'Cappuccino', hint: 'Foamy delight' }, ar: { name: '????????', hint: '???? ?????' }, temp: 'hot' },
        { en: { name: 'Strawberry Smoothie', hint: 'Fruity and fresh' }, ar: { name: '????? ??????', hint: '????? ?????' }, temp: 'cold' },
        { en: { name: 'Mixed Berries Smoothie', hint: 'Berry mix boost' }, ar: { name: '????? ??? ?????', hint: '???? ??? ????' }, temp: 'cold' },
        { en: { name: 'Banana Dates Smoothie', hint: 'Sweet and rich' }, ar: { name: '????? ??? ?????', hint: '??? ????' }, temp: 'cold' },
        { en: { name: 'Mango Smoothie', hint: 'Tropical vibes' }, ar: { name: '????? ?????', hint: '????? ????????' }, temp: 'cold' },
        { en: { name: 'Pineapple Smoothie', hint: 'Sunny sweetness' }, ar: { name: '????? ??????', hint: '????? ?????' }, temp: 'cold' },
        { en: { name: 'Watermelon Smoothie', hint: 'Ultra refreshing' }, ar: { name: '????? ????', hint: '???? ????' }, temp: 'cold' },
        { en: { name: 'Lemonade', hint: 'Zesty and bright' }, ar: { name: '????????', hint: '???? ?????' }, temp: 'cold' },
        { en: { name: 'Iced Tea Peach', hint: 'Light and fruity' }, ar: { name: '??? ????? ???', hint: '???? ??????' }, temp: 'cold' },
        { en: { name: 'Iced Tea Watermelon', hint: 'Cool and crisp' }, ar: { name: '??? ????? ????', hint: '???? ????' }, temp: 'cold' },
        { en: { name: 'Iced Tea Passionfruit', hint: 'Tropical tea' }, ar: { name: '??? ????? ???? ????', hint: '??? ???????' }, temp: 'cold' },
        { en: { name: 'Flavored Ice Tea', hint: 'Pick your flavor' }, ar: { name: '??? ????? ?????', hint: '???? ?????' }, temp: 'cold' },
        { en: { name: 'Orange Juice', hint: 'Freshly squeezed' }, ar: { name: '???? ??????', hint: '???? ??????' }, temp: 'cold' },
        { en: { name: 'Carrots Juice', hint: 'Sweet and earthy' }, ar: { name: '???? ???', hint: '??? ??????? ??????' }, temp: 'cold' },
        { en: { name: 'Lemon Mint Juice', hint: 'Minty zing' }, ar: { name: '???? ????? ??????', hint: '???? ????? ?????' }, temp: 'cold' },
        { en: { name: 'Pinky Lemonade', hint: 'Pretty and tasty' }, ar: { name: '???????? ?????', hint: '???? ?????' }, temp: 'cold' },
        { en: { name: 'Classic Vanilla Frappe', hint: 'Icy vanilla cloud' }, ar: { name: '?????? ?????? ???????', hint: '????? ?????? ??????' }, temp: 'cold' },
        { en: { name: 'Hazelnut Frappe', hint: 'Frosty nutty treat' }, ar: { name: '?????? ????', hint: '????? ???? ??????' }, temp: 'cold' },
        { en: { name: 'Chocolate Frappe', hint: 'Cocoa chill' }, ar: { name: '?????? ????????', hint: '???????? ??????' }, temp: 'cold' },
        { en: { name: 'French Vanilla Frappe', hint: 'Silky and sweet' }, ar: { name: '?????? ?????? ??????', hint: '????? ????' }, temp: 'cold' },
        { en: { name: 'Salted Caramel Frappe', hint: 'Sweet-salty crush' }, ar: { name: '?????? ????? ???????', hint: '???? ??? ?????' }, temp: 'cold' },
        { en: { name: 'Pistachio Milkshake', hint: 'Creamy pistachio' }, ar: { name: '???? ??? ????', hint: '???? ?????' }, temp: 'cold' },
        { en: { name: 'Lotus Milkshake', hint: 'Biscoff dream' }, ar: { name: '???? ??? ????', hint: '??? ????????' }, temp: 'cold' },
        { en: { name: 'Kinder Milkshake', hint: 'Chocolatey classic' }, ar: { name: '???? ??? ?????', hint: '?????? ????????' }, temp: 'cold' },
        { en: { name: 'Chocolate Milkshake', hint: 'Thick and rich' }, ar: { name: '???? ??? ????????', hint: '???? ????' }, temp: 'cold' },
    ];

    function pickRandomDrink() {
        return drinks[Math.floor(Math.random() * drinks.length)];
    }

    function setIconForTemp(temp) {
        const icon = document.getElementById('surpriseIcon');
        if (!icon) return;
        if (temp === 'hot') {
            icon.className = 'fas fa-mug-hot text-amber-600';
        } else {
            icon.className = 'fas fa-ice-cream text-cyan-600';
        }
    }

    function openModal() {
        // pre-show rolling effect
        rollNames(900);
        const d = pickRandomDrink();
        const isAr = document.documentElement.classList.contains('ar');
        const t = isAr ? d.ar : d.en;
        nameEl.textContent = t.name;
        hintEl.textContent = t.hint || '';
        setIconForTemp(d.temp);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // trigger show state for CSS transitions
        requestAnimationFrame(() => modal.classList.add('show'));
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        // play closing animation
        modal.classList.add('closing');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.classList.remove('closing');
        }, 420);
        document.body.style.overflow = '';
    }

    logo.addEventListener('click', () => {
        if (textBadge && !textBadge.classList.contains('opacity-0')) {
            textBadge.classList.add('opacity-0');
        }
        openModal();
    });
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('bg-black/50')) closeModal();
    });
    function rollNames(durationMs = 800) {
        const start = performance.now();
        function frame(now) {
            const elapsed = now - start;
            const d = pickRandomDrink();
            const isAr = document.documentElement.classList.contains('ar');
            const t = isAr ? d.ar : d.en;
            nameEl.textContent = t.name;
            hintEl.textContent = t.hint || '';
            setIconForTemp(d.temp);
            if (elapsed < durationMs) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // Re-localize current content when language changes
    window.localizeSurpriseCurrent = function(lang){
        const isAr = (lang === 'ar');
        const currentName = nameEl.textContent && nameEl.textContent.trim();
        if (!currentName) return;
        const match = drinks.find(d => d.en.name === currentName || d.ar.name === currentName);
        if (match) {
            const t = isAr ? match.ar : match.en;
            nameEl.textContent = t.name;
            hintEl.textContent = t.hint || '';
            setIconForTemp(match.temp);
        }
    }

    anotherBtn && anotherBtn.addEventListener('click', () => {
        rollNames(700);
        setTimeout(() => {
            const d = pickRandomDrink();
            const isAr = document.documentElement.classList.contains('ar');
            const t = isAr ? d.ar : d.en;
            nameEl.textContent = t.name;
            hintEl.textContent = t.hint || '';
            setIconForTemp(d.temp);
        }, 720);
    });
    gotoBtn && gotoBtn.addEventListener('click', () => {
        const drinksTab = document.querySelector('.category-tab[data-category="drinks"]');
        if (drinksTab) drinksTab.click();
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeModal();
    });
})();

// Breakfast Popup JS (no external libs)
(function breakfastPopup(){
    const overlay = document.getElementById('breakfastOverlay');
    const modal = document.getElementById('breakfastModal');
    const closeBtn = document.getElementById('breakfastClose');

    if (!overlay || !modal || !closeBtn) return;

    // Disabled globally: hide the breakfast popup entirely
    return;

    function isBreakfastTime(){
        const now = new Date();
        const hour = now.getHours();
        return hour >= 9 && hour < 12;
    }

    function openPopup(){
        overlay.style.display = 'block';
        modal.style.display = 'flex';
        requestAnimationFrame(()=>{
            overlay.classList.add('show');
            modal.classList.add('show');
        });
        document.body.style.overflow = 'hidden';
    }

    function closePopup(){
        modal.classList.add('closing');
        overlay.classList.remove('show');
        modal.classList.remove('show');
        setTimeout(()=>{
            overlay.style.display = 'none';
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.style.overflow = '';
        }, 300);
    }

    overlay.addEventListener('click', closePopup);
    closeBtn.addEventListener('click', closePopup);

    if (isBreakfastTime()){
        openPopup();
    }

    // No persistence: allow showing on every visit/refresh within time window
})();

// QR generator
(function initQR() {
    const qrContainer = document.getElementById('qrMenu');
    if (!qrContainer || !window.QRCode) return;
    const urlInput = document.getElementById('qrUrl');
    const updateBtn = document.getElementById('updateQR');
    const downloadBtn = document.getElementById('downloadQR');

    const initialUrl = window.location.href;
    urlInput.value = initialUrl;
    let qr = new QRCode(qrContainer, {
        text: initialUrl,
        width: 260,
        height: 260,
        colorDark: '#222222',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    function regenerate(value) {
        qr.clear();
        qr.makeCode(value || initialUrl);
    }

    updateBtn.addEventListener('click', () => {
        const v = (urlInput.value || '').trim();
        if (!v) return;
        try { new URL(v); } catch { alert('الرابط غير صالح'); return; }
        regenerate(v);
    });

    downloadBtn.addEventListener('click', () => {
        // try to get canvas or fallback to img
        const canvas = qrContainer.querySelector('canvas');
        let dataUrl;
        if (canvas) {
            // draw overlay logo into a new canvas to include it in the export
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = canvas.width;
            exportCanvas.height = canvas.height;
            const ctx = exportCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.onload = () => {
                const size = Math.floor(exportCanvas.width * 0.18);
                const x = (exportCanvas.width - size) / 2;
                const y = (exportCanvas.height - size) / 2;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                const pad = Math.floor(size * 0.18);
                ctx.roundRect(x - pad/2, y - pad/2, size + pad, size + pad, 12);
                ctx.fill();
                ctx.drawImage(logo, x, y, size, size);
                triggerDownload(exportCanvas.toDataURL('image/png'));
            };
            logo.src = '99cafe-logo2.png';
        } else {
            const img = qrContainer.querySelector('img');
            dataUrl = img ? img.src : null;
            if (dataUrl) triggerDownload(dataUrl);
        }

        function triggerDownload(url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = '99cafe-qr.png';
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    });
})();

// Move any parenthetical text inside item titles under the title in a faint color
(function moveParenthesesUnderTitles() {
    try {
        const titleNodes = document.querySelectorAll('.menu-item h4');
        titleNodes.forEach(h4 => {
            const originalText = (h4.textContent || '').trim();
            if (!originalText) return;
            const parenRegex = /\(([^)]+)\)/g;
            const matches = [...originalText.matchAll(parenRegex)].map(m => m[1]).filter(Boolean);
            if (matches.length === 0) return;
            const cleanedTitle = originalText.replace(parenRegex, '').replace(/\s+/g, ' ').trim();
            h4.textContent = cleanedTitle;
            const note = document.createElement('p');
            note.className = 'text-sm text-cafe-black/60 mt-1';
            note.textContent = `(${matches.join(') (')})`;
            h4.insertAdjacentElement('afterend', note);
        });
    } catch {}
})();

// Flavor picker (Hookah)
(function initFlavorPicker(){
    const openBtn = document.getElementById('flavorBtn');
    const modal = document.getElementById('flavorModal');
    const closeBtn = document.getElementById('closeFlavor');
    const overlay = modal ? modal.querySelector('[data-close-flavor]') : null;
    const list = document.getElementById('flavorList');
    const search = document.getElementById('flavorSearch');
    const clearBtn = document.getElementById('clearFlavor');
    const selectedLabel = document.getElementById('selectedFlavor');
    const selectEl = document.getElementById('flavorSelect');

    if (!openBtn || !modal || !list) return;

    const flavors = [
        'Two Apples','Grape','Blueberry','Lemon and Mint','Watermelon and Mint','Cinnamon and Gum','Love 66','Nakhla',
        'Mint','Gum','Orange','Peach','Strawberry','Mango','Kiwi','Pineapple','Mixed Berries'
    ];

    function setSelected(name){
        if (selectedLabel) selectedLabel.textContent = name ? `Selected flavor: ${name}` : '';
        if (selectEl) selectEl.value = name || '';
    }

    function render(items){
        list.innerHTML = '';
        items.forEach(name => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'px-3 py-2 rounded-lg bg-cafe-gray hover:bg-cafe-red hover:text-white transition text-cafe-black text-sm';
            btn.textContent = name;
            btn.addEventListener('click', () => {
                setSelected(name);
                close();
            });
            list.appendChild(btn);
        });
    }

    function populateSelect(){
        if (!selectEl) return;
        const hadSelection = !!selectEl.value;
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = !hadSelection;
        defaultOption.textContent = 'Choose a flavor...';
        selectEl.innerHTML = '';
        selectEl.appendChild(defaultOption);
        flavors.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            selectEl.appendChild(opt);
        });
    }

    function open(){
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        requestAnimationFrame(()=> modal.classList.add('show'));
        document.body.style.overflow = 'hidden';
        if (search) search.value = '';
        render(flavors);
        populateSelect();
        setTimeout(()=> search && search.focus(), 50);
    }
    function close(){
        modal.classList.remove('show');
        setTimeout(()=>{
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    if (clearBtn) clearBtn.addEventListener('click', () => { setSelected(''); close(); });
    if (search) search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        if (!q) { render(flavors); return; }
        render(flavors.filter(f => f.toLowerCase().includes(q)));
    });

    // Select change -> update label
    if (selectEl) {
        populateSelect();
        selectEl.addEventListener('change', () => {
            const v = selectEl.value;
            setSelected(v || '');
        });
    }
})();

// Check for wheel parameter in URL
(function() {
    try {
        var params = new URLSearchParams(window.location.search);
        if (params.get('wheel') === '1') {
            var btn = document.getElementById('tryLuckBtn');
            if (btn) btn.classList.remove('hidden');
        }
    } catch (e) {}
})();

// Menu Items Sync from Admin Panel
(function syncMenuItems() {
    try {
        const stored = localStorage.getItem('cafe_menu_items_sync');
        if (!stored) return; // No admin items, use default HTML
        
        const adminItems = JSON.parse(stored);
        if (!Array.isArray(adminItems) || adminItems.length === 0) return;
        
        // Filter out Fresher items (Tango Fresher, Pango Fresher, etc.)
        const filteredItems = adminItems.filter(item => {
            const nameEn = (item.nameEn || '').toLowerCase();
            const nameAr = (item.nameAr || '').toLowerCase();
            const group = (item.group || '').toLowerCase();
            
            // Remove items with "Fresher" in name or group
            if (nameEn.includes('fresher') || nameAr.includes('فريشر') || 
                nameEn.includes('tango fresher') || nameAr.includes('تانغو فريشر') ||
                nameEn.includes('pango fresher') || nameAr.includes('بانغو فريشر') ||
                group.includes('fresher') || group.includes('فريشر')) {
                return false;
            }
            return true;
        });
        
        // Group items by category and group
        const grouped = {};
        filteredItems.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = {};
            if (!grouped[item.category][item.group || 'default']) {
                grouped[item.category][item.group || 'default'] = [];
            }
            grouped[item.category][item.group || 'default'].push(item);
        });
        
        // Render items in each category
        Object.keys(grouped).forEach(category => {
            const categoryEl = document.getElementById(category);
            if (!categoryEl) return;
            
            // Clear existing items (optional - comment out to keep original items)
            // categoryEl.querySelectorAll('.menu-item').forEach(el => el.remove());
            
            // Create container if doesn't exist
            let gridContainer = categoryEl.querySelector('.grid');
            if (!gridContainer) {
                gridContainer = document.createElement('div');
                gridContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
                categoryEl.appendChild(gridContainer);
            }
            
            // Render each group
            Object.keys(grouped[category]).forEach(groupName => {
                const items = grouped[category][groupName];
                if (items.length === 0) return;
                
                // Find or create group card
                let groupCard = Array.from(gridContainer.querySelectorAll('.bg-cafe-white')).find(card => {
                    const h3 = card.querySelector('h3');
                    return h3 && h3.textContent.includes(groupName);
                });
                
                if (!groupCard) {
                    groupCard = document.createElement('div');
                    groupCard.className = 'bg-cafe-white rounded-xl p-6 shadow-lg';
                    groupCard.innerHTML = `
                        <h3 class="text-2xl font-bold text-cafe-red mb-4 border-b-2 border-cafe-red pb-2">
                            <i class="fas fa-coffee ml-2"></i>
                            ${groupName}
                        </h3>
                        <div class="space-y-3"></div>
                    `;
                    gridContainer.appendChild(groupCard);
                }
                
                const itemsContainer = groupCard.querySelector('.space-y-3');
                
                // Add items to group
                items.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'menu-item bg-cafe-gray rounded-lg p-4';
                    itemEl.setAttribute('data-item-id', item.id);
                    
                    // Build price HTML
                    let priceHTML = '';
                    if (item.priceMini || item.priceNormal || item.priceLarge) {
                        priceHTML = '<div class="text-right price-group">';
                        if (item.priceMini) {
                            priceHTML += `<div class="price-chip"><span class="label">Mini</span><span class="font-bold text-cafe-red">${item.priceMini}</span></div>`;
                        }
                        if (item.priceNormal) {
                            priceHTML += `<div class="price-chip mt-2 ml-auto"><span class="label">Normal</span><span class="font-bold text-cafe-red">${item.priceNormal}</span></div>`;
                        }
                        if (item.priceLarge) {
                            priceHTML += `<div class="price-chip mt-2 ml-auto"><span class="label">Large</span><span class="font-bold text-cafe-red">${item.priceLarge}</span></div>`;
                        }
                        priceHTML += '</div>';
                    } else if (item.priceSingle) {
                        priceHTML = `<div class="text-right"><div class="font-bold text-cafe-red">${item.priceSingle}</div></div>`;
                    }
                    
                    // Build description HTML
                    let descHTML = '';
                    if (item.descriptionAr || item.descriptionEn) {
                        const isAr = document.documentElement.classList.contains('ar');
                        descHTML = `<p class="text-sm text-cafe-black/60">${isAr ? item.descriptionAr : item.descriptionEn}</p>`;
                    }
                    
                    // Build notes HTML
                    let notesHTML = '';
                    if (item.notesAr || item.notesEn) {
                        const isAr = document.documentElement.classList.contains('ar');
                        const notes = (isAr ? item.notesAr : item.notesEn).split(',').map(n => n.trim()).filter(Boolean);
                        notes.forEach(note => {
                            notesHTML += `<p class="text-sm font-semibold text-cafe-red">${note}</p>`;
                        });
                    }
                    
                    const isAr = document.documentElement.classList.contains('ar');
                    itemEl.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-semibold text-cafe-black" data-en="${item.nameEn}">${isAr ? item.nameAr : item.nameEn}</h4>
                                ${descHTML}
                                ${notesHTML}
                            </div>
                            ${priceHTML}
                        </div>
                    `;
                    
                    itemsContainer.appendChild(itemEl);
                });
            });
        });
        
        // Apply translations if language changes
        const observer = new MutationObserver(() => {
            filteredItems.forEach(item => {
                const itemEl = document.querySelector(`[data-item-id="${item.id}"]`);
                if (!itemEl) return;
                const h4 = itemEl.querySelector('h4');
                const isAr = document.documentElement.classList.contains('ar');
                if (h4) {
                    h4.textContent = isAr ? item.nameAr : item.nameEn;
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
    } catch (error) {
        console.error('Error syncing menu items:', error);
    }
})();

// Hide preloader when page is loaded
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    }
});

// Also trigger reveal animations when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('show');
        });
    }, 300);
});

// Back to top button
(function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Enhanced Image Loading for Menu Items
(function initImageLoading() {
    const menuCards = document.querySelectorAll('.menu-item-card');
    
    menuCards.forEach((card, index) => {
        // Set animation delay based on index
        card.style.setProperty('--index', index);
        
        const imageContainer = card.querySelector('.menu-item-image');
        if (!imageContainer) return;
        
        const img = imageContainer.querySelector('img');
        if (!img) return;
        
        // Add loading class
        imageContainer.classList.add('loading');
        
        // Handle image load
        img.addEventListener('load', () => {
            imageContainer.classList.remove('loading');
            img.classList.add('loaded');
        });
        
        // Handle image error
        img.addEventListener('error', () => {
            imageContainer.classList.remove('loading');
            // Keep placeholder icon visible
        });
        
        // If image has src, trigger load
        if (img.src && img.src !== window.location.href) {
            img.loading = 'lazy';
        }
    });
})();

// Intersection Observer for Lazy Loading Images
(function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        document.querySelectorAll('.menu-item-image img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
})();

// Enhanced Card Interactions
(function initCardInteractions() {
    const cards = document.querySelectorAll('.menu-item-card');
    
    cards.forEach(card => {
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
})();

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(217, 4, 41, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Menu Filtering Functionality
(function initMenuFiltering() {
    // Handle filtering for each category separately
    function initCategoryFiltering(categoryId) {
        const categoryEl = document.getElementById(categoryId);
        if (!categoryEl) return;
        
        const filterButtons = categoryEl.querySelectorAll('.filter-btn');
        const menuItems = categoryEl.querySelectorAll('.menu-item-card');
        
        if (!filterButtons.length || !menuItems.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Remove active class from all buttons in this category
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter menu items in this category only
                menuItems.forEach(item => {
                    const itemFilter = item.getAttribute('data-filter');
                    
                    if (filterValue === 'all' || filterValue === 'all-food' || itemFilter === filterValue) {
                        // Show item with animation
                        item.style.display = '';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        // Hide item with animation
                        item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }
    
    // Initialize filtering for each category
    initCategoryFiltering('drinks');
    initCategoryFiltering('food');
    initCategoryFiltering('desserts');
})();

// Add attractive taglines to menu items based on category
(function() {
    const isArabic = document.documentElement.classList.contains('ar') || document.documentElement.dir === 'rtl';
    
    const taglines = {
        // Drinks taglines
        drinks: isArabic ? [
            "مصنوع بشغف، يُقدم بكمال",
            "لحظة من المتعة الخالصة",
            "حيث يلتقي الطعم بالفن",
            "ارتشف، استمتع، واحتفل",
            "ارتقِ بتجربة القهوة",
            "مخمرة إلى الكمال، تُقدم بحب",
            "كل كوب يحكي قصة",
            "تذوق الفرق، اشعر بالجودة"
        ] : [
            "Crafted with passion, served with perfection",
            "A moment of pure indulgence",
            "Where flavor meets artistry",
            "Sip, savor, and celebrate",
            "Elevate your coffee experience",
            "Brewed to perfection, served with love",
            "Every cup tells a story",
            "Taste the difference, feel the quality"
        ],
        // Food taglines
        food: isArabic ? [
            "مكونات طازجة، نكهات جريئة",
            "رحلة طهوية تنتظرك",
            "مصنوع بحب، يُقدم بعناية",
            "حيث يلتقي الطعم بالتقاليد",
            "استمتع بكل قضمة لذيذة",
            "مصمم للذواق المميز",
            "مكونات عالية الجودة، طعم استثنائي",
            "وليمة لحواسك"
        ] : [
            "Fresh ingredients, bold flavors",
            "A culinary journey awaits",
            "Made with love, served with care",
            "Where taste meets tradition",
            "Savor every delicious bite",
            "Crafted for the discerning palate",
            "Quality ingredients, exceptional taste",
            "A feast for your senses"
        ],
        // Desserts taglines
        desserts: isArabic ? [
            "لحظات حلوة، ذكريات لا تُنسى",
            "استمتع بالحلاوة الخالصة",
            "متعَة لروحك",
            "حيث تلتقي الحلاوة بالكمال",
            "الحياة أحلى مع الحلوى",
            "مصنوع بحب، يُقدم بفرح",
            "كل قضمة احتفال",
            "أحلام حلوة تتحقق"
        ] : [
            "Sweet moments, unforgettable memories",
            "Indulge in pure sweetness",
            "A treat for your soul",
            "Where sweetness meets perfection",
            "Life is sweeter with dessert",
            "Crafted with love, served with joy",
            "Every bite is a celebration",
            "Sweet dreams made real"
        ]
    };
    
    function getCategoryFromCard(card) {
        // Check parent category section
        const drinksSection = card.closest('#drinks');
        const foodSection = card.closest('#food');
        const dessertsSection = card.closest('#desserts');
        
        if (drinksSection) return 'drinks';
        if (foodSection) return 'food';
        if (dessertsSection) return 'desserts';
        return 'drinks'; // default
    }
    
    function addTaglinesToCards() {
        const cards = document.querySelectorAll('.menu-item-card');
        const categoryCounts = { drinks: 0, food: 0, desserts: 0 };
        
        cards.forEach(card => {
            // Skip if tagline already exists
            if (card.querySelector('.menu-item-tagline')) return;
            
            const category = getCategoryFromCard(card);
            const categoryTaglines = taglines[category] || taglines.drinks;
            const index = categoryCounts[category] % categoryTaglines.length;
            const tagline = categoryTaglines[index];
            
            categoryCounts[category]++;
            
            // Find the header and prices
            const header = card.querySelector('.menu-item-header');
            const prices = card.querySelector('.menu-item-prices');
            const content = card.querySelector('.menu-item-content');
            
            if (header && prices && content) {
                // Create tagline element
                const taglineEl = document.createElement('div');
                taglineEl.className = 'menu-item-tagline';
                taglineEl.textContent = tagline;
                
                // Insert between header and prices
                if (header.nextSibling === prices) {
                    content.insertBefore(taglineEl, prices);
                } else {
                    // If there's description, insert after it
                    const description = card.querySelector('.menu-item-description');
                    if (description) {
                        description.parentNode.insertBefore(taglineEl, description.nextSibling);
                    } else {
                        header.parentNode.insertBefore(taglineEl, prices);
                    }
                }
            }
        });
    }
    
    // Function to update taglines when language changes
    function updateTaglines() {
        const isArabic = document.documentElement.classList.contains('ar') || document.documentElement.dir === 'rtl';
        const currentTaglines = {
            drinks: isArabic ? [
                "مصنوع بشغف، يُقدم بكمال",
                "لحظة من المتعة الخالصة",
                "حيث يلتقي الطعم بالفن",
                "ارتشف، استمتع، واحتفل",
                "ارتقِ بتجربة القهوة",
                "مخمرة إلى الكمال، تُقدم بحب",
                "كل كوب يحكي قصة",
                "تذوق الفرق، اشعر بالجودة"
            ] : [
                "Crafted with passion, served with perfection",
                "A moment of pure indulgence",
                "Where flavor meets artistry",
                "Sip, savor, and celebrate",
                "Elevate your coffee experience",
                "Brewed to perfection, served with love",
                "Every cup tells a story",
                "Taste the difference, feel the quality"
            ],
            food: isArabic ? [
                "مكونات طازجة، نكهات جريئة",
                "رحلة طهوية تنتظرك",
                "مصنوع بحب، يُقدم بعناية",
                "حيث يلتقي الطعم بالتقاليد",
                "استمتع بكل قضمة لذيذة",
                "مصمم للذواق المميز",
                "مكونات عالية الجودة، طعم استثنائي",
                "وليمة لحواسك"
            ] : [
                "Fresh ingredients, bold flavors",
                "A culinary journey awaits",
                "Made with love, served with care",
                "Where taste meets tradition",
                "Savor every delicious bite",
                "Crafted for the discerning palate",
                "Quality ingredients, exceptional taste",
                "A feast for your senses"
            ],
            desserts: isArabic ? [
                "لحظات حلوة، ذكريات لا تُنسى",
                "استمتع بالحلاوة الخالصة",
                "متعَة لروحك",
                "حيث تلتقي الحلاوة بالكمال",
                "الحياة أحلى مع الحلوى",
                "مصنوع بحب، يُقدم بفرح",
                "كل قضمة احتفال",
                "أحلام حلوة تتحقق"
            ] : [
                "Sweet moments, unforgettable memories",
                "Indulge in pure sweetness",
                "A treat for your soul",
                "Where sweetness meets perfection",
                "Life is sweeter with dessert",
                "Crafted with love, served with joy",
                "Every bite is a celebration",
                "Sweet dreams made real"
            ]
        };
        
        const cards = document.querySelectorAll('.menu-item-card');
        const categoryCounts = { drinks: 0, food: 0, desserts: 0 };
        
        cards.forEach(card => {
            const taglineEl = card.querySelector('.menu-item-tagline');
            if (!taglineEl) return;
            
            const category = getCategoryFromCard(card);
            const categoryTaglines = currentTaglines[category] || currentTaglines.drinks;
            const index = categoryCounts[category] % categoryTaglines.length;
            const tagline = categoryTaglines[index];
            
            categoryCounts[category]++;
            taglineEl.textContent = tagline;
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTaglinesToCards);
    } else {
        addTaglinesToCards();
    }
    
    // Watch for language changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isArabic = document.documentElement.classList.contains('ar');
                if (isArabic !== (mutation.target.dir === 'rtl')) {
                    updateTaglines();
                }
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                updateTaglines();
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'dir']
    });
    
    // Also run after category switching
    setTimeout(addTaglinesToCards, 500);
})();

// Hide icon placeholder when image is present
(function() {
    function hideIconsWhenImagePresent() {
        document.querySelectorAll('.menu-item-image').forEach(imageContainer => {
            const img = imageContainer.querySelector('img');
            const icon = imageContainer.querySelector('.icon-placeholder');
            
            if (img && icon) {
                // Check if image has a valid src and is loaded
                if (img.src && img.src !== window.location.href) {
                    icon.style.display = 'none';
                } else {
                    // If image fails to load, show icon
                    img.addEventListener('error', () => {
                        icon.style.display = 'block';
                    });
                    // If image loads successfully, hide icon
                    img.addEventListener('load', () => {
                        icon.style.display = 'none';
                    });
                }
            }
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideIconsWhenImagePresent);
    } else {
        hideIconsWhenImagePresent();
    }
    
    // Also run after category switching
    setTimeout(hideIconsWhenImagePresent, 500);
})();


document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function updateOnlinePlayers() {
        const onlinePlayers = document.getElementById('online-players');
        const randomPlayers = Math.floor(Math.random() * 50) + 20;
        onlinePlayers.textContent = randomPlayers;
    }
    
    function updateServerStatus() {
        const serverStatus = document.getElementById('server-status');
        const isOnline = Math.random() > 0.1;
        
        if (isOnline) {
            serverStatus.textContent = 'Çevrimiçi';
            serverStatus.parentElement.classList.remove('bg-danger');
            serverStatus.parentElement.classList.add('bg-primary');
        } else {
            serverStatus.textContent = 'Bakımda';
            serverStatus.parentElement.classList.remove('bg-primary');
            serverStatus.parentElement.classList.add('bg-danger');
        }
    }
    
    updateOnlinePlayers();
    updateServerStatus();
    
    setInterval(function() {
        updateOnlinePlayers();
        updateServerStatus();
    }, 30000);
    
    const notificationContainer = document.getElementById('notificationContainer');
    
    function showNotification(type, title, message, duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = '';
        switch(type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'error':
                icon = 'times-circle';
                break;
            case 'info':
                icon = 'info-circle';
                break;
            default:
                icon = 'bell';
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationContainer.appendChild(notification);
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            closeNotification(notification);
        });
        
        setTimeout(function() {
            closeNotification(notification);
        }, duration);
        
        return notification;
    }
    
    function closeNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        
        setTimeout(function() {
            if (notification.parentNode === notificationContainer) {
                notificationContainer.removeChild(notification);
            }
        }, 300);
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            showNotification('success', 'Mesaj Gönderildi', `Teşekkürler ${name}! Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.`);
            
            contactForm.reset();
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const characterName = document.getElementById('characterName').value;
            
            showNotification('success', 'Kayıt Başarılı', `Teşekkürler ${username}! Kaydınız başarıyla oluşturuldu. Discord sunucumuza katılmayı unutmayın!`);
            
            registerForm.reset();
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    initMap();
});

function initMap() {
    if (typeof L === 'undefined' || !document.getElementById('game-map')) {
        console.error('Leaflet library is not loaded or map element does not exist.');
        return;
    }

    const map = L.map('game-map').setView([34.052235, -118.243683], 12);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    const locations = {
        police: {
            coords: [34.052235, -118.243683],
            title: 'Polis Departmanı',
            description: 'Los Santos Polis Departmanı (LSPD) ana merkezi. Polis mesleği için başvurabilir, suçluları rapor edebilir veya kayıp eşyalarınızı bildirebilirsiniz.',
            icon: 'shield-alt'
        },
        hospital: {
            coords: [34.056235, -118.233683],
            title: 'Hastane',
            description: 'Los Santos Merkez Hastanesi. Yaralanma durumunda tedavi olabilir veya doktor mesleği için başvurabilirsiniz.',
            icon: 'hospital'
        },
        mechanic: {
            coords: [34.042235, -118.253683],
            title: 'Tamirci',
            description: 'Los Santos Customs. Araçlarınızı tamir ettirebilir, modifiye edebilir veya mekanik mesleği için başvurabilirsiniz.',
            icon: 'wrench'
        },
        bank: {
            coords: [34.048235, -118.263683],
            title: 'Banka',
            description: 'Fleeca Bank. Para yatırabilir, çekebilir veya kredi başvurusunda bulunabilirsiniz.',
            icon: 'university'
        },
        clothing: {
            coords: [34.058235, -118.273683],
            title: 'Kıyafet Mağazası',
            description: 'Ponsonbys. Karakteriniz için kıyafet ve aksesuar satın alabilirsiniz.',
            icon: 'tshirt'
        },
        gas: {
            coords: [34.038235, -118.223683],
            title: 'Benzin İstasyonu',
            description: 'LTD Benzin İstasyonu. Aracınıza yakıt alabilir ve market alışverişi yapabilirsiniz.',
            icon: 'gas-pump'
        },
        apartment: {
            coords: [34.062235, -118.253683],
            title: 'Apartmanlar',
            description: 'Eclipse Towers. Kendinize bir daire satın alabilir veya kiralayabilirsiniz.',
            icon: 'building'
        },
        club: {
            coords: [34.045235, -118.283683],
            title: 'Gece Kulüpleri',
            description: 'Vanilla Unicorn. Eğlenebilir, içki içebilir veya diğer oyuncularla sosyalleşebilirsiniz.',
            icon: 'cocktail'
        }
    };
    
    const markers = {};
    
    for (const [key, location] of Object.entries(locations)) {
        const customIcon = L.divIcon({
            html: `<i class="fas fa-${location.icon}" style="color: #ff3333;"></i>`,
            className: 'custom-map-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        markers[key] = L.marker(location.coords, { icon: customIcon }).addTo(map);

        markers[key].bindPopup(`<b>${location.title}</b><br>${location.description}`);
        
        markers[key].on('click', function() {
            updateLocationInfo(key);
        });
    }
    
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-map-icon {
            background: none;
            border: none;
        }
        .custom-map-icon i {
            font-size: 24px;
            text-shadow: 0 0 3px #000;
        }
    `;
    document.head.appendChild(style);
    
    document.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', function() {
            const locationKey = this.getAttribute('data-location');
            
            document.querySelectorAll('.location-item').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            updateLocationInfo(locationKey);
            map.panTo(locations[locationKey].coords);
            markers[locationKey].openPopup();
        });
    });
    
    function updateLocationInfo(locationKey) {
        const location = locations[locationKey];
        const titleElement = document.getElementById('location-title');
        const descriptionElement = document.getElementById('location-description');
        
        titleElement.textContent = location.title;
        descriptionElement.textContent = location.description;
        
        document.querySelectorAll('.location-item').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelector(`.location-item[data-location="${locationKey}"]`).classList.add('active');
    }
}

if (typeof L === 'undefined') {
    console.error('Leaflet library is not loaded. Please ensure Leaflet is properly included in your HTML.');
}
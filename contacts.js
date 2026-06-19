// ===================================
// ARIST Messenger - Contacts Module
// ===================================

class ContactsManager {
    constructor() {
        this.contacts = this.getDefaultContacts();
    }

    getDefaultContacts() {
        return [
            {
                id: 'alex',
                name: 'Александр Петров',
                avatar: 'А',
                color: '#FF6B6B',
                status: 'online',
                lastMessage: 'Привет! Как дела?',
                time: '12:30',
                unread: 3,
                bio: 'Frontend разработчик',
                email: 'alex@example.com'
            },
            {
                id: 'maria',
                name: 'Мария Иванова',
                avatar: 'М',
                color: '#4ECDC4',
                status: 'online',
                lastMessage: 'Отправила файл с отчетом',
                time: '11:45',
                unread: 0,
                bio: 'UX/UI Дизайнер',
                email: 'maria@example.com'
            },
            {
                id: 'dmitry',
                name: 'Дмитрий Смирнов',
                avatar: 'Д',
                color: '#45B7D1',
                status: 'offline',
                lastMessage: 'До встречи на тренировке!',
                time: 'Вчера',
                unread: 1,
                bio: 'Backend разработчик',
                email: 'dmitry@example.com'
            },
            {
                id: 'elena',
                name: 'Елена Козлова',
                avatar: 'Е',
                color: '#F7DC6F',
                status: 'online',
                lastMessage: '👍 Отличная работа!',
                time: '09:15',
                unread: 0,
                bio: 'Project Manager',
                email: 'elena@example.com'
            },
            {
                id: 'group_work',
                name: 'Рабочая группа',
                avatar: 'Р',
                color: '#BB8FCE',
                status: 'group',
                lastMessage: 'Иван: Завтра встреча в 15:00',
                time: 'Вчера',
                unread: 5,
                bio: 'Командный чат',
                members: 8
            },
            {
                id: 'anna',
                name: 'Анна Волкова',
                avatar: 'А',
                color: '#FF8A5C',
                status: 'online',
                lastMessage: 'Давай созвонимся завтра',
                time: '08:30',
                unread: 0,
                bio: 'QA Engineer',
                email: 'anna@example.com'
            },
            {
                id: 'sergey',
                name: 'Сергей Морозов',
                avatar: 'С',
                color: '#5DADE2',
                status: 'offline',
                lastMessage: 'Спасибо за информацию!',
                time: 'Пн',
                unread: 0,
                bio: 'DevOps',
                email: 'sergey@example.com'
            }
        ];
    }

    getContact(contactId) {
        return this.contacts.find(contact => contact.id === contactId);
    }

    searchContacts(query) {
        if (!query) return this.contacts;
        
        const searchTerm = query.toLowerCase();
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm) ||
            (contact.email && contact.email.toLowerCase().includes(searchTerm)) ||
            (contact.bio && contact.bio.toLowerCase().includes(searchTerm))
        );
    }

    updateLastMessage(contactId, message, time) {
        const contact = this.getContact(contactId);
        if (contact) {
            contact.lastMessage = message;
            contact.time = time;
        }
    }

    incrementUnread(contactId) {
        const contact = this.getContact(contactId);
        if (contact && contact.unread !== undefined) {
            contact.unread = (contact.unread || 0) + 1;
        }
    }

    resetUnread(contactId) {
        const contact = this.getContact(contactId);
        if (contact) {
            contact.unread = 0;
        }
    }

    getOnlineContacts() {
        return this.contacts.filter(contact => contact.status === 'online');
    }

    getGroups() {
        return this.contacts.filter(contact => contact.status === 'group');
    }

    renderContacts(filterText = '') {
        const contactsList = document.getElementById('contactsList');
        if (!contactsList) return;

        contactsList.innerHTML = '';
        
        const filteredContacts = this.searchContacts(filterText);
        
        if (filteredContacts.length === 0) {
            contactsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 10px;">🔍</div>
                    <p>Контакты не найдены</p>
                </div>
            `;
            return;
        }

        filteredContacts.forEach(contact => {
            const contactElement = this.createContactElement(contact);
            contactsList.appendChild(contactElement);
        });
    }

    createContactElement(contact) {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.setAttribute('data-contact-id', contact.id);
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Чат с ${contact.name}`);
        
        const statusClass = contact.status === 'online' ? 'online-indicator' : 
                          contact.status === 'offline' ? 'online-indicator offline-indicator' : '';
        
        const statusIndicator = (contact.status === 'online' || contact.status === 'offline') ? 
            `<div class="${statusClass}"></div>` : '';

        div.innerHTML = `
            <div class="contact-avatar" style="background: ${contact.color};">
                ${contact.avatar}
                ${statusIndicator}
            </div>
            <div class="contact-info">
                <div class="contact-name">${this.escapeHtml(contact.name)}</div>
                <div class="contact-last-message">${this.escapeHtml(contact.lastMessage || '')}</div>
            </div>
            <div class="contact-meta">
                <div class="contact-time">${contact.time || ''}</div>
                ${contact.unread > 0 ? `<div class="unread-badge">${contact.unread}</div>` : ''}
            </div>
        `;

        return div;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactsManager;
}

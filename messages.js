// ===================================
// ARIST Messenger - Messages Module
// ===================================

class MessagesManager {
    constructor() {
        this.messages = this.getDefaultMessages();
        this.autoResponses = [
            'Да, полностью согласен!',
            'Интересная мысль, давай обсудим подробнее',
            'Я подумаю над этим и напишу позже',
            'Хорошо, договорились!',
            '👍',
            'Отличная идея!',
            'Понял, спасибо за информацию',
            'Можешь рассказать подробнее?',
            'Супер! Буду ждать',
            'Давай созвонимся, так будет быстрее',
            'Я уже работаю над этим',
            'Принято!',
            'Хорошего дня! ☀️',
            'Спасибо большое!',
            'Договорились, до встречи'
        ];
        
        this.typingSpeed = {
            min: 1000,  // Минимальная задержка ответа (мс)
            max: 3000   // Максимальная задержка ответа (мс)
        };
    }

    getDefaultMessages() {
        return {
            'alex': [
                { id: 1, sender: 'alex', text: 'Привет! Как дела?', time: '12:25', status: 'read' },
                { id: 2, sender: 'me', text: 'Привет! Отлично, спасибо! Как твои дела?', time: '12:26', status: 'read' },
                { id: 3, sender: 'alex', text: 'У меня тоже все хорошо! Не хочешь сходить в кино сегодня вечером?', time: '12:28', status: 'read' },
                { id: 4, sender: 'me', text: 'Да, отличная идея! А на какой фильм?', time: '12:29', status: 'read' },
                { id: 5, sender: 'alex', text: 'Там новый боевик вышел, говорят классный. Или можем комедию посмотреть', time: '12:30', status: 'read' }
            ],
            'maria': [
                { id: 1, sender: 'maria', text: 'Привет! Я закончила отчет по проекту', time: '11:40', status: 'read' },
                { id: 2, sender: 'me', text: 'Отлично! Отправь, пожалуйста, на почту', time: '11:42', status: 'read' },
                { id: 3, sender: 'maria', text: 'Уже отправила. Проверь, все ли правильно', time: '11:45', status: 'read' }
            ],
            'dmitry': [
                { id: 1, sender: 'dmitry', text: 'Привет! Завтра тренировка в 10 утра, не опаздывай!', time: 'Вчера', status: 'read' },
                { id: 2, sender: 'me', text: 'Хорошо, буду вовремя. Что брать с собой?', time: 'Вчера', status: 'read' },
                { id: 3, sender: 'dmitry', text: 'Форму и воду. До встречи на тренировке!', time: 'Вчера', status: 'read' }
            ],
            'elena': [
                { id: 1, sender: 'elena', text: 'Как прошло собеседование?', time: '09:10', status: 'read' },
                { id: 2, sender: 'me', text: 'Отлично! Меня взяли на позицию! 🎉', time: '09:12', status: 'read' },
                { id: 3, sender: 'elena', text: '👍 Поздравляю! Отличная работа!', time: '09:15', status: 'read' }
            ],
            'group_work': [
                { id: 1, sender: 'ivan', text: 'Коллеги, у кого готов отчет за прошлый месяц?', time: 'Вчера', status: 'read' },
                { id: 2, sender: 'me', text: 'У меня почти готов, сегодня доделаю', time: 'Вчера', status: 'read' },
                { id: 3, sender: 'ivan', text: 'Отлично! Завтра встреча в 15:00, обсудим результаты', time: 'Вчера', status: 'read' }
            ],
            'anna': [
                { id: 1, sender: 'anna', text: 'Привет! Есть время обсудить новый проект?', time: '08:25', status: 'read' },
                { id: 2, sender: 'me', text: 'Да, конечно. Что именно нужно обсудить?', time: '08:28', status: 'read' },
                { id: 3, sender: 'anna', text: 'Давай созвонимся завтра, так будет удобнее', time: '08:30', status: 'read' }
            ],
            'sergey': [
                { id: 1, sender: 'sergey', text: 'Привет! У меня вопрос по серверу', time: 'Пн', status: 'read' },
                { id: 2, sender: 'me', text: 'Привет! Что случилось?', time: 'Пн', status: 'read' },
                { id: 3, sender: 'sergey', text: 'Все работает. Спасибо за информацию!', time: 'Пн', status: 'read' }
            ]
        };
    }

    getMessages(contactId) {
        return this.messages[contactId] || [];
    }

    addMessage(contactId, message) {
        if (!this.messages[contactId]) {
            this.messages[contactId] = [];
        }
        this.messages[contactId].push(message);
        return message;
    }

    getLastMessage(contactId) {
        const messages = this.getMessages(contactId);
        return messages.length > 0 ? messages[messages.length - 1] : null;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getCurrentTime() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    getRandomResponse() {
        const index = Math.floor(Math.random() * this.autoResponses.length);
        return this.autoResponses[index];
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (this.typingSpeed.max - this.typingSpeed.min + 1)) + this.typingSpeed.min;
    }

    simulateTyping(callback) {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }

        setTimeout(() => {
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, this.getRandomDelay());
    }

    createMessage(sender, text, time = null) {
        return {
            id: this.generateId(),
            sender: sender,
            text: text,
            time: time || this.getCurrentTime(),
            status: 'sent'
        };
    }

    renderMessages(contactId) {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        container.innerHTML = '';
        
        const messages = this.getMessages(contactId);
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 15px;">💬</div>
                    <p>Нет сообщений. Начните общение!</p>
                </div>
            `;
            return;
        }

        messages.forEach((message, index) => {
            const messageElement = this.createMessageElement(message, index, messages);
            container.appendChild(messageElement);
        });

        // Scroll to bottom
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }

    createMessageElement(message, index, allMessages) {
        const div = document.createElement('div');
        const isSent = message.sender === 'me';
        div.className = `message ${isSent ? 'sent' : 'received'}`;
        
        // Get sender info
        let senderInitial = '?';
        let senderColor = '#45B7D1';
        
        if (isSent) {
            senderInitial = 'Я';
            senderColor = '#6C5CE7';
        } else {
            // Try to get from contacts manager if available
            if (window.app && window.app.contactsManager) {
                const contact = window.app.contactsManager.getContact(message.sender);
                if (contact) {
                    senderInitial = contact.avatar;
                    senderColor = contact.color;
                } else {
                    senderInitial = message.sender.charAt(0).toUpperCase();
                }
            } else {
                senderInitial = message.sender.charAt(0).toUpperCase();
            }
        }

        // Determine if we should show avatar
        const showAvatar = index === 0 || 
                          allMessages[index - 1].sender !== message.sender;

        div.innerHTML = `
            ${!isSent && showAvatar ? `
                <div class="message-avatar" style="background: ${senderColor};">
                    ${senderInitial}
                </div>
            ` : (!isSent ? '<div class="message-avatar" style="visibility: hidden;"></div>' : '')}
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${message.time}</div>
                ${isSent ? '<div class="message-status">✓✓</div>' : ''}
            </div>
            ${isSent && showAvatar ? `
                <div class="message-avatar" style="background: ${senderColor};">
                    ${senderInitial}
                </div>
            ` : (isSent ? '<div class="message-avatar" style="visibility: hidden;"></div>' : '')}
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
    module.exports = MessagesManager;
}

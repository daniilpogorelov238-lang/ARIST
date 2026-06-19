// ===================================
// ARIST Messenger - Chat Module
// ===================================

class ChatManager {
    constructor(app) {
        this.app = app;
        this.currentChatId = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Send message button
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            // Send on Enter (without Shift)
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            messageInput.addEventListener('input', () => {
                messageInput.style.height = 'auto';
                messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
            });
        }

        // Back button (mobile)
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.closeChat());
        }

        // Contact list clicks (event delegation)
        const contactsList = document.getElementById('contactsList');
        if (contactsList) {
            contactsList.addEventListener('click', (e) => {
                const contactItem = e.target.closest('.contact-item');
                if (contactItem) {
                    const contactId = contactItem.getAttribute('data-contact-id');
                    if (contactId) {
                        this.openChat(contactId);
                    }
                }
            });
        }

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (this.app.contactsManager) {
                    this.app.contactsManager.renderContacts(e.target.value);
                }
            });
        }

        // Handle window resize for responsive
        window.addEventListener('resize', () => this.handleResize());
    }

    openChat(contactId) {
        this.currentChatId = contactId;
        
        // Get contact info
        const contact = this.app.contactsManager ? 
                       this.app.contactsManager.getContact(contactId) : null;
        
        if (!contact) return;

        // Update UI
        this.updateChatHeader(contact);
        
        // Show chat screen
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatScreen = document.getElementById('chatScreen');
        
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (chatScreen) chatScreen.style.display = 'flex';

        // Update active contact in sidebar
        document.querySelectorAll('.contact-item').forEach(el => {
            el.classList.remove('active');
        });
        const activeContact = document.querySelector(`[data-contact-id="${contactId}"]`);
        if (activeContact) {
            activeContact.classList.add('active');
            // Scroll into view
            activeContact.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset unread counter
        if (this.app.contactsManager) {
            this.app.contactsManager.resetUnread(contactId);
            this.app.contactsManager.renderContacts(
                document.getElementById('searchInput')?.value || ''
            );
        }

        // Render messages
        if (this.app.messagesManager) {
            this.app.messagesManager.renderMessages(contactId);
        }

        // Handle mobile view
        this.handleMobileView();

        // Focus on input
        setTimeout(() => {
            const messageInput = document.getElementById('messageInput');
            if (messageInput) messageInput.focus();
        }, 300);
    }

    closeChat() {
        this.currentChatId = null;
        
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatScreen = document.getElementById('chatScreen');
        
        if (welcomeScreen) welcomeScreen.style.display = 'flex';
        if (chatScreen) chatScreen.style.display = 'none';

        // Remove active state from contacts
        document.querySelectorAll('.contact-item').forEach(el => {
            el.classList.remove('active');
        });

        // Handle mobile view
        this.handleMobileView();
    }

    updateChatHeader(contact) {
        const chatContactName = document.getElementById('chatContactName');
        const chatContactInitials = document.getElementById('chatContactInitials');
        const chatContactAvatar = document.getElementById('chatContactAvatar');
        const chatContactStatus = document.getElementById('chatContactStatus');

        if (chatContactName) chatContactName.textContent = contact.name;
        if (chatContactInitials) chatContactInitials.textContent = contact.avatar;
        if (chatContactAvatar) chatContactAvatar.style.background = contact.color;
        
        if (chatContactStatus) {
            let statusText = 'Не в сети';
            if (contact.status === 'online') statusText = 'В сети';
            else if (contact.status === 'group') statusText = `Группа • ${contact.members || 0} участников`;
            chatContactStatus.textContent = statusText;
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput || !this.currentChatId) return;

        const text = messageInput.value.trim();
        if (!text) return;

        // Create message
        const message = this.app.messagesManager.createMessage('me', text);
        
        // Add to messages
        this.app.messagesManager.addMessage(this.currentChatId, message);

        // Update contact's last message
        if (this.app.contactsManager) {
            this.app.contactsManager.updateLastMessage(
                this.currentChatId, 
                text, 
                message.time
            );
        }

        // Re-render messages
        this.app.messagesManager.renderMessages(this.currentChatId);

        // Re-render contacts
        if (this.app.contactsManager) {
            this.app.contactsManager.renderContacts(
                document.getElementById('searchInput')?.value || ''
            );
        }

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Simulate response (for non-group chats)
        const contact = this.app.contactsManager ? 
                       this.app.contactsManager.getContact(this.currentChatId) : null;
        
        if (contact && contact.status !== 'group') {
            this.simulateResponse(contact);
        }
    }

    simulateResponse(contact) {
        if (!this.app.messagesManager) return;

        // Show typing indicator
        this.app.messagesManager.simulateTyping(() => {
            // Create response message
            const responseText = this.app.messagesManager.getRandomResponse();
            const response = this.app.messagesManager.createMessage(
                contact.id, 
                responseText
            );
            
            // Add response to messages
            this.app.messagesManager.addMessage(this.currentChatId, response);

            // Update contact
            if (this.app.contactsManager) {
                this.app.contactsManager.updateLastMessage(
                    contact.id,
                    responseText,
                    response.time
                );

                // If chat not currently open, increment unread
                if (this.currentChatId !== contact.id) {
                    this.app.contactsManager.incrementUnread(contact.id);
                }
            }

            // Re-render messages if chat is open
            if (this.currentChatId === contact.id) {
                this.app.messagesManager.renderMessages(contact.id);
            }

            // Re-render contacts list
            if (this.app.contactsManager) {
                this.app.contactsManager.renderContacts(
                    document.getElementById('searchInput')?.value || ''
                );
            }
        });
    }

    handleMobileView() {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                if (this.currentChatId) {
                    sidebar.classList.add('hidden');
                } else {
                    sidebar.classList.remove('hidden');
                }
            }
        }
    }

    handleResize() {
        this.handleMobileView();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatManager;
}

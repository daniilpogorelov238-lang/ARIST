// ===================================
// ARIST Messenger - Messages Module
// ===================================

class MessagesManager {
    constructor() {
        this.messages = this.getDefaultMessages();
        this.autoResponses = [
            'Да, полностью согласен!',
            'Интересная мысль, давай обсудим подроб

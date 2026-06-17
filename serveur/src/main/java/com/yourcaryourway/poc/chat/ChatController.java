package com.yourcaryourway.poc.chat;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate template;
    
    @Autowired
    private ChatMessageStore messageStore;

    /**
     * Endpoint STOMP : client envoie un message
     * URL : /app/chat.send (mapping STOMP)
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message) {
        // Sauvegarder le message dans l'historique
        messageStore.addMessage(message.getSessionId(), message);
        
        // Router le message vers le topic spécifique de cette session
        // Tous les clients abonnés à /topic/support-chat/{sessionId} recevront ce message
        String destination = "/topic/support-chat/" + message.getSessionId();
        template.convertAndSend(destination, message);
    }
    
    /**
     * Endpoint STOMP : client demande l'historique
     * URL : /app/chat.history (mapping STOMP)
     */
    @MessageMapping("/chat.history")
    public void getHistory(@Payload Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        String clientId = payload.get("clientId");
        
        
        if (clientId == null) {
            System.err.println("ERROR: clientId missing from request!");
            return;
        }
        
        // Récupérer tous les messages de cette session
        List<ChatMessage> messages = messageStore.getMessages(sessionId);
        
        // Envoyer l'historique uniquement au client demandeur via son topic privé
        String destination = "/topic/chat-history-" + clientId;
        template.convertAndSend(destination, messages);
        
    }
}
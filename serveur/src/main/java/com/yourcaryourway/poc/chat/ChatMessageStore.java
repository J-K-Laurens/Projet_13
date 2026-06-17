package com.yourcaryourway.poc.chat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 * Stocke les messages par session pour permettre aux nouveaux utilisateurs de voir l'historique quand ils rejoignent une session
 */
@Component
public class ChatMessageStore {
    
    // Map : sessionId -> List de messages
    private final Map<String, List<ChatMessage>> messagesBySession = new ConcurrentHashMap<>();
    
    // Nombre maximum de messages à garder par session
    private static final int MAX_MESSAGES_PER_SESSION = 100;
    
    /**
     * Ajoute un message à l'historique d'une session
     */
    public void addMessage(String sessionId, ChatMessage message) {
        messagesBySession.computeIfAbsent(sessionId, k -> Collections.synchronizedList(new ArrayList<>()))
                         .add(message);
        
        // Limiter la taille pour ne pas consommer trop de mémoire
        List<ChatMessage> messages = messagesBySession.get(sessionId);
        if (messages.size() > MAX_MESSAGES_PER_SESSION) {
            messages.remove(0); // Supprimer le plus ancien message
        }
    }
    
    /**
     * Récupère tous les messages d'une session
     */
    public List<ChatMessage> getMessages(String sessionId) {
        return messagesBySession.getOrDefault(sessionId, new ArrayList<>());
    }
    
    /**
     * Nettoie les messages d'une session (optionnel, pour éviter les fuites mémoire)
     */
    public void clearSession(String sessionId) {
        messagesBySession.remove(sessionId);
    }
}
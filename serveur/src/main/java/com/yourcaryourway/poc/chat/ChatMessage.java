package com.yourcaryourway.poc.chat;

public class ChatMessage {
    private String senderName;
    private String senderType; // "user"/"agent"
    private String content;
    private String sessionId;

    // Classe représentant un message
    public ChatMessage() {}

    // Getters et Setters
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}
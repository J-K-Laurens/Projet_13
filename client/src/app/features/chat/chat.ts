import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Websocket } from './websocket';
import { Subscription } from 'rxjs';

//Composant gérant l'interface UI du chat. 
//Objectif : Saisir le nom, le type (user/agent), le sessionId, envoyer des messages, afficher les messages reçus
@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {

  // Ce que l'utilisateur saisit dans les champs
  senderName: string = '';
  senderType: string = 'user'; // 'user'/'agent'
  newMessage: string = '';
  inputSessionId: string = ''; // Pour entrer un sessionId manuellement

  // La liste des messages affichés
  messages: any[] = [];

  // Pour savoir si on est connecté ou pas encore
  isConnected: boolean = false;

  // Session ID unique pour cette conversation
  sessionId: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private wsService: Websocket, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {}

  /**
   * Appelé quand l'utilisateur clique sur "Rejoindre le chat"
   */
  join(): void {
    if (!this.senderName.trim()) return;
    
    // Utiliser le sessionId saisi ou en générer un nouveau
    if (this.inputSessionId.trim()) {
      this.sessionId = this.inputSessionId.trim();
    } else {
      this.sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    }
    
    console.log('Joining chat as:', this.senderName, 'with sessionId:', this.sessionId);
    
    // Réinitialiser les messages pour cette nouvelle session
    this.messages = [];
    
    // Se connecter au WebSocket
    this.wsService.connect(this.sessionId);
    
    // S'abonner aux messages entrants
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.wsService.getMessages().subscribe((message: any) => {
      console.log('Message received in component:', message);
      // Exécuter dans la zone Angular pour assurer que la détection de changement fonctionne
      this.ngZone.run(() => {
        if (message && !this.messages.some(m => JSON.stringify(m) === JSON.stringify(message))) {
          this.messages.push(message);
        }
        this.cdr.detectChanges();
      });
    });
    
    this.isConnected = true;
  }

  /**
   * Envoyer un message
   */
  send(): void {
    if (!this.newMessage.trim()) return;

    const message = {
      senderName: this.senderName,
      senderType: this.senderType,
      content: this.newMessage,
      sessionId: this.sessionId
    };

    console.log('Sending message:', message);
    this.wsService.sendMessage(message);
    this.newMessage = '';
  }

  /**
   * Permettre d'envoyer un message en appuyant sur Enter
   */
  handleKeyPress(event: any): void {
    if (event.key === 'Enter') {
      this.send();
    }
  }

    /**
   * Quitter la session en cours & Reinitialiser l'interface
   */
  leave(): void {
  console.log('Leaving chat session:', this.sessionId);
  this.wsService.disconnect();
  this.subscription.unsubscribe();
  this.isConnected = false;
  this.messages = [];
  this.sessionId = '';
  this.inputSessionId = '';
  this.senderName = '';
  this.newMessage = '';
}

  /**
   * Nettoyage quand le composant est détruit
   */
  ngOnDestroy(): void {
    if (this.isConnected) {
        this.subscription.unsubscribe();
        this.wsService.disconnect();
    }
  }

  copySessionId(): void {
    navigator.clipboard.writeText(this.sessionId);
  }
  
}
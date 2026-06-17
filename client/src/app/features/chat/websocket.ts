import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as Stomp from '@stomp/stompjs';

// Service -> encapsuler la logique STOMP.
//Objectif : Connexion au serveur, abonnement aux topics, exposition des messages (RxJs) (+gestion de l'historique des messages)
@Injectable({
  providedIn: 'root'
})
export class Websocket {
  private client: any;
  private messageSubject = new Subject<any>(); // Utiliser Subject au lieu de BehaviorSubject pour ne pas conserver les anciens messages
  public messages$: Observable<any> = this.messageSubject.asObservable();
  private connected = false;
  private subscriptions: any[] = []; // Tracer les subscriptions STOMP pour les nettoyer

  constructor() {
    // Initialiser le client STOMP
    this.client = new Stomp.Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => this.onConnected(),
      onDisconnect: () => this.onDisconnected()
    });
  }

  /**
   * Se connecter au serveur WebSocket
   */
  connect(sessionId: string): void {
    if (this.connected) {
      console.log('Déjà connecté');
      return;
    }
    
    // Stocker le sessionId pour l'utiliser dans les abonnements
    this.client.sessionId = sessionId;
    
    // Activer le client STOMP
    this.client.activate();
  }

  /**
   * Appelé quand la connexion est établie
   */
  private onConnected(): void {
    console.log('Connecté au serveur STOMP');
    this.connected = true;
    const sessionId = this.client.sessionId;

    // Nettoyer les anciennes subscriptions avant d'en créer de nouvelles
    this.cleanupSubscriptions();

    // S'abonner au topic de cette session pour recevoir les nouveaux messages
    const msgSub = this.client.subscribe(`/topic/support-chat/${sessionId}`, (message: any) => {
      console.log('Message reçu:', message.body);
      const parsedMessage = JSON.parse(message.body);
      this.messageSubject.next(parsedMessage);
    });
    this.subscriptions.push(msgSub);

    // S'abonner au topic de l'historique pour recevoir les anciens messages
    const clientId = 'client-' + Math.random().toString(36).substring(7);
    const historySub = this.client.subscribe(`/topic/chat-history-${clientId}`, (message: any) => {
      console.log('Historique reçu:', message.body);
      const messages = JSON.parse(message.body);
      messages.forEach((msg: any) => this.messageSubject.next(msg));
    });
    this.subscriptions.push(historySub);

    // Demander l'historique
    this.client.publish({
      destination: '/app/chat.history',
      body: JSON.stringify({ sessionId, clientId })
    }); 
  }

  /**
   * Appelé quand la connexion est fermée
   */
  private onDisconnected(): void {
    console.log('Déconnecté du serveur STOMP');
    this.connected = false;
  }

  /**
   * Envoyer un message via STOMP
   */
  sendMessage(message: any): void {
    if (!this.connected) {
      console.error('Non connecté au serveur');
      return;
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });
  }

  /**
   * Nettoyer les subscriptions STOMP
   */
  private cleanupSubscriptions(): void {
    this.subscriptions.forEach(sub => {
      try {
        sub.unsubscribe();
      } catch (e) {
        console.warn('Erreur en nettoyant la subscription:', e);
      }
    });
    this.subscriptions = [];
  }

  /**
   * Se déconnecter
   */
  disconnect(): void {
    this.cleanupSubscriptions();
    if (this.client && this.connected) {
      this.client.deactivate();
    }
  }

  /**
   * Récupérer les messages sous forme d'Observable
   */
  getMessages(): Observable<any> {
    return this.messages$;
  }
}
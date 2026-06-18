# POC Chat WebSocket

Application de chat en temps réel utilisant WebSocket STOMP avec un backend Spring Boot et un frontend Angular.

## 🎯 Fonctionnalités

- ✅ Chat temps réel via WebSocket
- ✅ Sessions isolées par ID
- ✅ Historique des messages persistant par session
- ✅ Support multi-utilisateurs simultanés
- ✅ Rejoin de session existante

## 🏗️ Architecture

```
client (Angular)          serveur (Spring Boot)
├── UI Chat              ├── ChatController
├── WebSocket Service    ├── ChatMessageStore
└── RxJS Observables     └── WebSocket Config
        ↕ STOMP/WebSocket ↕
```

## 📋 Prérequis

- **Node.js** 18+
- **npm** ou **yarn**
- **Java** 17+
- **Maven** 3.8+

## 🚀 Installation & Démarrage

### 1. Backend (Spring Boot)

```bash
cd serveur
mvn clean install
mvn spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`

### 2. Frontend (Angular)

```bash
cd client
npm install
ng serve
```

L'app démarre sur `http://localhost:4200`

## 💬 Utilisation

1. **Rejoindre le chat**
   - Entrez votre nom
   - Sélectionnez votre rôle (user/agent)
   - Cliquez "Rejoindre" pour créer une nouvelle session
   - Ou collez un Session ID existant pour rejoindre

2. **Envoyer un message**
   - Tapez votre message
   - Appuyez sur Enter ou cliquez "Envoyer"

3. **Partager une session**
   - Cliquez sur l'icône de copie du Session ID
   - Partagez le code avec d'autres utilisateurs

4. **Quitter**
   - Cliquez "Leave" pour quitter la session

## 📁 Structure

```
client/
├── src/app/features/chat/
│   ├── chat.ts              # Composant principal
│   ├── chat.html            # Template UI
│   ├── websocket.ts         # Service STOMP
│   └── chat.css             # Styles

serveur/src/main/java/com/yourcaryourway/poc/
├── chat/
│   ├── ChatController.java   # Endpoints STOMP
│   ├── ChatMessage.java      # Modèle
│   └── ChatMessageStore.java # Persistence mémoire
└── config/
    ├── WebSocketConfig.java  # Config STOMP
    └── CorsConfig.java       # CORS setup
```

## 🔧 Configuration

**WebSocket URL** (client): `ws://localhost:8080/ws`

Modifiable dans [websocket.ts](client/src/app/features/chat/websocket.ts#L16)

## 📊 Vers la Production

Voir [database/poc-chat.sql](database/poc-chat.sql) pour un aperçu du schéma de base de données prévu pour la version finale.

Cette SQL montre:
- Tables pour persister les sessions, messages et utilisateurs
- Schéma prêt pour migration vers production
- Exemple de structure relationnelle recommandée

## ⚠️ Notes POC

- Messages stockés **en mémoire** (perdu au redémarrage)
- Pas de base de données
- Pas d'authentification
- CORS ouvert (localhost uniquement en prod)

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| WebSocket refused | Vérifier que le serveur tourne sur :8080 |
| CORS error | Vérifier CorsConfig.java |
| Messages en retard | Vérifier la connexion réseau |

---

**POC** – À adapter selon vos besoins pour la production

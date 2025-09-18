import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessageModel {
  // Define properties as per your Angular model
  // Example:
  // id: string;
  // message: string;
  // user: string;
  // timestamp: Date;
}

const chatMessagesSubject = new BehaviorSubject<ChatMessageModel | null>(null);
const activeUsersSubject = new BehaviorSubject<any | null>(null);

const liveChatService = {
  pushMessage: (model: ChatMessageModel) => {
    chatMessagesSubject.next(model);
  },
  pushActiveUsers: (user: any) => {
    activeUsersSubject.next(user);
  },
  chatMessages$: (): Observable<ChatMessageModel | null> => chatMessagesSubject.asObservable(),
  activeUser$: (): Observable<any | null> => activeUsersSubject.asObservable()
};

export default liveChatService;

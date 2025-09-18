import { BehaviorSubject } from 'rxjs';

const loadingSubject = new BehaviorSubject<boolean>(false);
let activeRequests = 0;

const loaderService = {
  loading$: () => loadingSubject.asObservable(),
  show: () => {
    activeRequests++;
    loadingSubject.next(true);
  },
  hide: () => {
    activeRequests--;
    if (activeRequests === 0) loadingSubject.next(false);
  }
};

export default loaderService;

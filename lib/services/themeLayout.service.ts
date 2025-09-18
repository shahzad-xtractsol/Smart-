import { BehaviorSubject, Subject } from 'rxjs';

const dashBoardMenuState = new Subject<boolean>();
const componentMenuState = new Subject<boolean>();
const directionChange = new BehaviorSubject<string>('');
const color = new BehaviorSubject<string>('');
const layout = new BehaviorSubject<string>('');
const isDarkMode = new BehaviorSubject<string>('');
const drawerOpen = new BehaviorSubject<boolean>(false);
const componentDrawerOpen = new BehaviorSubject<boolean>(false);
const sidebarToggleTrigger$ = new Subject<void>();
const toggleState = new BehaviorSubject<boolean>(false);

const themeLayoutService = {
  dashBoardMenuState,
  componentMenuState,
  directionChange,
  color,
  layout,
  isDarkMode,
  drawerOpen,
  componentDrawerOpen,
  sidebarToggleTrigger$,
  toggleState$: toggleState.asObservable(),
  toggleSideDrawer: () => {
    toggleState.next(!toggleState.getValue());
    dashBoardMenuState.next(!drawerOpen.getValue());
  },
  getValueToggle: () => toggleState.getValue(),
  toggleSideDrawerInit: () => {
    toggleState.next(toggleState.getValue());
    dashBoardMenuState.next(drawerOpen.getValue());
  },
  toggleMenuSide: () => {
    componentMenuState.next(!componentDrawerOpen.getValue());
  }
};

export default themeLayoutService;

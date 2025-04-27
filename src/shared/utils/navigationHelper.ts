import { RootStackParamList } from '@/navigators/types';
import {
  CommonActions,
  NavigationAction,
  NavigationContainerRefWithCurrent,
  NavigationState,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

class NavigationHelper {
  private navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
  static instance: NavigationHelper;

  private constructor() {
    this.navigationRef = createNavigationContainerRef<RootStackParamList>();
  }

  public static getInstance(): NavigationHelper {
    if (!NavigationHelper.instance) {
      NavigationHelper.instance = new NavigationHelper();
    }

    return NavigationHelper.instance;
  }

  public getRef() {
    return this.navigationRef;
  }

  public dispatch(
    action: NavigationAction | ((state: NavigationState) => NavigationAction),
  ) {
    return this.navigationRef.dispatch(action);
  }

  public navigate(routeName: string, params?: object) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
  }

  public push(routeName: string, params?: object) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(StackActions.push(routeName, params));
    }
  }

  public replace(routeName: string, params?: object) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(StackActions.replace(routeName, params));
    }
  }

  public goBack() {
    if (this.navigationRef.canGoBack()) {
      this.navigationRef.goBack();
    }
  }

  public pop(count?: number) {
    this.navigationRef.dispatch(StackActions.pop(count));
  }
}

export const navigationHelper = NavigationHelper.getInstance();

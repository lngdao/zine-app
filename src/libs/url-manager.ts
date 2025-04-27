class UrlManagerSingleton {
  static #instance: UrlManagerSingleton;
  public _APP_DOMAIN: string = 'https://phimapi.com/';
  public _APP_CDN_IMG_DOMAIN: string = 'https://phimimg.com/';

  private constructor() {}

  public static get instance(): UrlManagerSingleton {
    if (!UrlManagerSingleton.#instance) {
      UrlManagerSingleton.#instance = new UrlManagerSingleton();
    }

    return UrlManagerSingleton.#instance;
  }

  public updateAppDomain(appDomain: string) {
    this._APP_DOMAIN = appDomain;
  }

  public updateAppCDNImgDomain(appCDNImgDomain: string) {
    this._APP_CDN_IMG_DOMAIN = appCDNImgDomain;
  }
}

const UrlManager = UrlManagerSingleton.instance;

export default UrlManager;

import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { AuthHelper } from '../helpers/auth.helper';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService extends BaseService {
  constructor(private http: HttpClient) {
    super();
    //this.registerServiceWorker();
  }

  private vapidPublicKey =
    'BLKLhXbDE4jE2pSF86t2_dYY-C6qFFW0RWSprOzvI2ih67Q3gpH1EUWwXH2FLLi-m1PpVUBS1P_l-uaCFo1Dag0';

  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }

  public async registerServiceWorker() {
    console.log('here i m');
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        // const registration = await navigator.serviceWorker.register('/sw.js');
        // console.log('✅ Service Worker registered:', registration);

        // Wait until the service worker is active
        navigator.serviceWorker.ready.then((reg) => {
          console.log('✅ Service Worker ready:', reg);
          this.subscribeToPush(reg, AuthHelper.getJwtPayloads()!.sub);
        });
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.warn('Push messaging is not supported');
    }
  }

  async subscribeToPush(
    registration: ServiceWorkerRegistration,
    userId: string
  ) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      console.log('✅ Push subscribed:', subscription);

      return this.http
        .post('http://localhost:8081/api/v1/notifications/subscribe', {
          userId,
          subscription,
        })
        .toPromise();
    } catch (error) {
      console.error('❌ Push subscription failed:', error);
      throw error;
    }
  }
}

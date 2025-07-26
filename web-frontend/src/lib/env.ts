export class ENV {
  static BACKEND_URI = process.env.NEXT_PUBLIC_API_BASE_URL;
  static Frontend_URI = process.env.NEXT_PUBLIC_APP_URL;
  static VERSION = process.env.NEXT_PUBLIC_VERSION;
}

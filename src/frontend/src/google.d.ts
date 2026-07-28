declare namespace google {
  namespace accounts {
    namespace id {
      interface IdConfiguration {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        context?: string;
      }

      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      function initialize(config: IdConfiguration): void;
      function prompt(momentListener?: (notification: any) => void): void;
      function renderButton(parent: HTMLElement, options: any): void;
      function disableAutoSelect(): void;
    }
  }
}

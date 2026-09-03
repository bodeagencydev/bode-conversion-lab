/* PopupSystem previously rendered two extra timed popups (a 1-min "Store
   Leak Finder" offer and a 3-min pricing-page discount). Both were retired
   to keep total sitewide interruptions down to 2: HelpMenuPopup (the "what
   do you need" popup, fires ~7s after landing) and ExitIntentPopup (fires
   only when a visitor is about to leave). Both of those live in
   components.jsx and are mounted via PageWrapper, so nothing needs to
   render from here anymore. Kept as a no-op instead of removing the import
   in App.jsx, so nothing else needs to change if popups are ever reintroduced. */
   export default function PopupSystem() {
    return null;
  }
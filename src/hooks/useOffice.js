import { createContext, useContext } from 'react';

// The office name shown in the portal header (provided by OfficeLayout).
// A page that changes the name calls setOfficeName so the header updates at once.
export const OfficeContext = createContext({ officeName: '', setOfficeName: () => {} });

export function useOffice() {
  return useContext(OfficeContext);
}

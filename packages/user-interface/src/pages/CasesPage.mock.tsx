import CasesPage from "./CasesPage";
import TestProvider from "../providers/TestProvider";
import { mocksRequestBurgerGegevens } from "./AccountPageRequests.mock";

const route = "/zaken";

export const MockAccountPage = () => (
  <TestProvider mocks={mocksRequest} route={route}>
    <CasesPage showNotificationSubSection="false" />
  </TestProvider>
);

import * as React from 'react';
import {Button, StylesProvider, Card} from '@gemeente-denhaag/denhaag-component-library';
import {useKeycloak} from '@react-keycloak/web';
import {FormattedMessage} from 'react-intl';
import {LocaleContext, DEFAULT_LOCALES} from '@nl-portal/localization';
import {useContext} from 'react';

const Example = () => {
  const {keycloak} = useKeycloak();
  const {setLocale} = useContext(LocaleContext);

  return (
    <StylesProvider>
      <Button onClick={() => setLocale(DEFAULT_LOCALES.DUTCH)}>
        <FormattedMessage id="app.languageName" />
      </Button>
      <Button onClick={() => keycloak.logout()}>
        <FormattedMessage id="app.logout" />
      </Button>
      <Card title="Test" date={new Date()} href="test" variant="case" />
    </StylesProvider>
  );
};

export {Example};
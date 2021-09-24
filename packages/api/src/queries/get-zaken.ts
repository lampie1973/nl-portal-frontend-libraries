import {gql} from '@apollo/client';

export const QUERY_GET_ZAKEN = gql`
  query GetZaken {
    getZaken {
      uuid
      omschrijving
      zaaktype {
        identificatie
      }
      startdatum
      status {
        statustype {
          isEindstatus
        }
      }
    }
  }
`;

import {gql} from '@apollo/client';

export const QUERY_GET_PERSOON_DATA = gql`
  query GetPersoonData {
    getPersoon {
      burgerservicenummer
      geslachtsaanduiding
      naam {
        aanhef
        voorletters
        voornamen
        geslachtsnaam
      }
      verblijfplaats {
        straat
        huisnummer
        postcode
        woonplaats
      }
      geboorte {
        datum {
          datum
          jaar
          maand
          dag
        }
        land {
          code
          omschrijving
        }
      }
      nationaliteiten {
        nationaliteit {
          code
          omschrijving
        }
      }
    }
  }
`;
import * as React from 'react';
import {useGetZaakQuery} from '@nl-portal/nl-portal-api';
import {FC, Fragment, ReactElement, useContext} from 'react';
import {Heading2, Heading3, Paragraph} from '@gemeente-denhaag/components-react';
import {DescriptionList} from '@gemeente-denhaag/descriptionlist';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gemeente-denhaag/table';
import {Link} from '@gemeente-denhaag/link';
import {FormattedMessage, useIntl} from 'react-intl';
import Skeleton from 'react-loading-skeleton';
import {ArrowRightIcon} from '@gemeente-denhaag/icons';
import {Link as RouterLink} from 'react-router-dom';
import {LocaleContext} from '@nl-portal/nl-portal-localization';
import classNames from 'classnames';
import {useMediaQuery, useQuery} from '../../hooks';
import styles from './case-page.module.scss';
import {DocumentList} from '../../components/document-list';
import {StatusHistory} from '../../components/status-history';
import {BREAKPOINTS} from '../../constants';
import mock from './mock';

interface CasePageProps {
  statusHistoryFacet?: ReactElement;
  statusHistoryBackground?: ReactElement;
  showDocumentsListLink?: boolean;
}

const CasePage: FC<CasePageProps> = ({
  statusHistoryFacet,
  statusHistoryBackground,
  showDocumentsListLink = false,
}) => {
  const intl = useIntl();
  const query = useQuery();
  const {hrefLang} = useContext(LocaleContext);
  const id = query.get('id');
  const {data, loading, error} = useGetZaakQuery({
    variables: {id},
  });
  const isTablet = useMediaQuery(BREAKPOINTS.TABLET);
  const getDocumentsUrl = (caseId: string) => `/zaken/zaak/documenten?id=${caseId}`;

  const details = React.useMemo(() => {
    if (!data?.getZaak) return [];

    const array = [
      {
        title: intl.formatMessage({id: 'case.creationDate'}),
        detail: new Date(data?.getZaak.startdatum).toLocaleDateString(),
      },
      {
        title: intl.formatMessage({id: 'case.caseNumber'}),
        detail: data?.getZaak.identificatie || '',
      },
    ];

    if (data?.getZaak.omschrijving)
      array.push({
        title: intl.formatMessage({id: 'case.description'}),
        detail: data?.getZaak.omschrijving || '',
      });

    return array;
  }, [data]);

  console.log(data?.getZaak, details);

  return (
    <section className={styles.case}>
      {!error ? (
        <Fragment>
          <header className={styles.case__header}>
            <Heading2>
              {loading ? (
                <div
                  aria-busy
                  aria-disabled
                  aria-label={intl.formatMessage({id: 'element.loading'})}
                >
                  <Skeleton width={250} />
                </div>
              ) : (
                <FormattedMessage id={`case.${data?.getZaak.zaaktype.identificatie}.title`} />
              )}
            </Heading2>
          </header>
          <div className={styles.case__status}>
            <Heading3 className={styles['case__sub-header']}>
              <FormattedMessage id="case.statusHeader" />
            </Heading3>
            <StatusHistory
              caseId={data?.getZaak.zaaktype.identificatie}
              statusHistory={data?.getZaak.statusGeschiedenis}
              statuses={data?.getZaak.statussen}
              status={data?.getZaak.status}
              loading={loading}
              facet={statusHistoryFacet}
              background={statusHistoryBackground}
            />
          </div>
          {details.length > 0 && (
            <div className={styles.case__status}>
              <Heading3 className={styles['case__sub-header']}>
                <FormattedMessage id="case.detailsHeader" />
              </Heading3>
              <DescriptionList items={details} />
            </div>
          )}
          {mock.data.map(section => {
            if (section.type === 'table' || !Array.isArray(section.value)) {
              return (
                <div className={styles.case__status} key={section.heading}>
                  <Heading3 className={styles['case__sub-header']}>{section.heading}</Heading3>
                  <Table>
                    {
                      // @ts-ignore
                      section.value.headers.length > 0 && (
                        <TableHead>
                          <TableRow>
                            {
                              // @ts-ignore
                              section.value.headers?.map(header => (
                                <TableHeader>{header.value}</TableHeader>
                              ))
                            }
                          </TableRow>
                        </TableHead>
                      )
                    }
                    {
                      // @ts-ignore
                      section.value.rows.length > 0 && (
                        <TableBody>
                          {
                            // @ts-ignore
                            section.value.rows.map(cells => (
                              <TableRow>
                                {cells.map((cell: {value: string}) => (
                                  <TableCell>{cell.value}</TableCell>
                                ))}
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      )
                    }
                  </Table>
                </div>
              );
            }

            return (
              <div className={styles.case__status} key={section.heading}>
                <Heading3 className={styles['case__sub-header']}>{section.heading}</Heading3>
                <DescriptionList
                  items={section.value.map(item => ({
                    title: item.key,
                    detail: item.value,
                  }))}
                />
              </div>
            );
          })}
          <div className={styles.case__documents}>
            <div
              className={classNames(styles['case__documents-header'], {
                [styles['case__documents-header--tablet']]: isTablet,
              })}
            >
              <Heading3 className={classNames({[styles['case__sub-header']]: !isTablet})}>
                <FormattedMessage id="pageTitles.documents" />
              </Heading3>
              {showDocumentsListLink &&
                !loading &&
                data?.getZaak?.documenten &&
                data?.getZaak?.documenten.length > 0 && (
                  <div
                    className={classNames(styles['case__documents-link'], {
                      [styles['case__documents-link--tablet']]: isTablet,
                    })}
                  >
                    <Link
                      component={RouterLink}
                      to={getDocumentsUrl(id || '')}
                      icon={<ArrowRightIcon />}
                      iconAlign="end"
                      hrefLang={hrefLang}
                    >
                      <FormattedMessage id="case.showAllDocuments" />
                    </Link>
                  </div>
                )}
            </div>
            <DocumentList documents={loading ? undefined : data?.getZaak.documenten} />
          </div>
        </Fragment>
      ) : (
        <Paragraph>
          <FormattedMessage id="case.fetchError" />
        </Paragraph>
      )}
    </section>
  );
};

export {CasePage};

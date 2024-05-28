import React, { useState, useEffect } from 'react';
import { onEntryChange } from '../contentstack-sdk';
import RenderComponents from '../components/render-components';
import { getLocale, getPageLocale, getPageRes } from '../helper';
import Skeleton from 'react-loading-skeleton';
import { Props, Context } from "../typescript/pages";
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';

export default function Home(props: Props) {

  const { page, entryUrl } = props;

  const [getEntry, setEntry] = useState(page);
  const router = useRouter();
  const locale = getLocale(router);
  async function fetchData() {
    try {
      const entryRes = await getPageRes(entryUrl, locale);
      if (!entryRes) throw new Error('Status code 404');
      setEntry(entryRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);

  return getEntry ? (
    <RenderComponents
      pageComponents={getEntry.page_components}
      contentTypeUid='page'
      entryUid={getEntry.uid}
      locale={getEntry.locale}
    />
  ) : (
    <Skeleton count={3} height={300} />
  );
}

export async function getServerSideProps(context: any) {
  try {
    const { locale } = context.query as { locale?: string };
    const csLocale = getPageLocale(locale || 'en');
    const entryRes = await getPageRes(context.resolvedUrl, csLocale);
    return {
      props: {
        entryUrl: context.resolvedUrl,
        page: entryRes,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}

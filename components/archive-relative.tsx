import React from 'react';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';

type AdditionalParam = {
  title: string;
  body: string;
}

type Blog = {
  url: string;
  body: string;
  title: string;
  $: AdditionalParam;
}

type BlogListProps = {
  blogs: [Blog];
}

export default function ArchiveRelative({ blogs }: BlogListProps) {
  const router = useRouter();
  const { locale } = router.query as { locale?: string };

  const handleNavigation = (url: string) => {
    const localizedUrl = `/${locale}${url}`;
    if (router.asPath !== localizedUrl) {
      router.push(localizedUrl);
    }
  };

  return (
    <>
      {blogs?.map((blog, idx) => (
        <div
          key={idx}
          onClick={() => handleNavigation(blog.url)}
          style={{ cursor: 'pointer' }}
        >
          <h4 {...blog.$?.title as {}}>{blog.title}</h4>
          {typeof blog.body === 'string' && (
            <div {...blog.$?.body as {}}>{parse(blog.body.slice(0, 80))}</div>
          )}
        </div>
      ))}
    </>
  );
}
import React from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { Image } from "../typescript/action";

type AdditionalParam = {
  banner_title: string;
  banner_description: string;
  title: {};
  title_h2: string;
  body: string;
  date: string;
}

type Author = {
  title: string;
  $: AdditionalParam;
}

type BloglistProps = {
  body: string;
  url: string;
  featured_image: Image;
  title: string;
  date: string;
  author: [Author];
  $: AdditionalParam;
}

function BlogList({ bloglist }: { bloglist: BloglistProps }) {
  const router = useRouter();
  const { locale } = router.query as { locale?: string };

  const handleNavigation = (url: string) => {
    const localizedUrl = `/${locale}${url}`;
    if (router.asPath !== localizedUrl) {
      router.push(localizedUrl);
    }
  };

  let body: string = bloglist.body && bloglist.body.substr(0, 300);
  const stringLength = body.lastIndexOf(' ');
  body = `${body.substr(0, Math.min(body.length, stringLength))}...`;

  return (
    <div className='blog-list'>
      {bloglist.featured_image && (
        <div onClick={() => handleNavigation(bloglist.url)} style={{ cursor: 'pointer' }}>
          <img
            className='blog-list-img'
            src={bloglist.featured_image.url}
            alt='blog img'
            {...bloglist.featured_image.$?.url as {}}
          />
        </div>
      )}
      <div className='blog-content'>
        {bloglist.title && (
          <h3 onClick={() => handleNavigation(bloglist.url)} style={{ cursor: 'pointer' }} {...bloglist.$?.title}>
            {bloglist.title}
          </h3>
        )}
        <p>
          <strong {...bloglist.$?.date as {}}>
            {moment(bloglist.date).format('ddd, MMM D YYYY')}
          </strong>
          ,{" "}
          <strong {...bloglist.author[0].$?.title}>
            {bloglist.author[0].title}
          </strong>
        </p>
        <div {...bloglist.$?.body as {}}>{parse(body)}</div>
        {bloglist.url ? (
          <span onClick={() => handleNavigation(bloglist.url)} style={{ cursor: 'pointer' }}>
            {'Read more -->'}
          </span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default BlogList;
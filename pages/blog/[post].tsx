import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { getPageRes, getBlogPostRes, getPageLocale, getLocale } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import Skeleton from 'react-loading-skeleton';
import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';
import { Page, BlogPosts, PageUrl } from "../../typescript/pages";
import { useRouter } from 'next/router';


export default function BlogPost({ blogPost, page, pageUrl }: {blogPost: BlogPosts, page: Page, pageUrl: PageUrl}) {
  console.log('CLIENT 1', blogPost);
  console.log('PAGE', page);
  console.log('URL', pageUrl)
  const [getPost, setPost] = useState({ banner: page, post: blogPost });
  const router = useRouter();
  const locale = getLocale(router);
  async function fetchData() {
    try {
      const entryRes = await getBlogPostRes(pageUrl, locale);
      const bannerRes = await getPageRes('/blog', locale);
      if (!entryRes || !bannerRes) throw new Error('Status: ' + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [blogPost]);

  const { post, banner } = getPost;
  return (
    <>
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogPost
          contentTypeUid='blog_post'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        <article className='blog-detail'>
          {post && post.title ? (
            <h2 {...post.$?.title as {}}>{post.title}</h2>
          ) : (
            <h2>
              <Skeleton />
            </h2>
          )}
          {post && post.date ? (
            <p {...post.$?.date as {}}>
              {moment(post.date).format('ddd, MMM D YYYY')},{' '}
              <strong {...post.author[0].$?.title as {}}>
                {post.author[0].title}
              </strong>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          {post && post.body ? (
            <div {...post.$?.body as {}}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        </article>
        <div className='blog-column-right'>
          <div className='related-post'>
            {banner && banner?.page_components[2].widget ? (
              <h2 {...banner?.page_components[2].widget.$?.title_h2 as {}}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_post ? (
              <ArchiveRelative
                {...post.$?.related_post}
                blogs={post.related_post}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ params, query }: any) {
  try {
    const { locale } = query as { locale?: string };
    const csLocale = getPageLocale(locale || 'en');
    const page = await getPageRes('/blog', csLocale);
    const posts = await getBlogPostRes(`/blog/${params.post}`, csLocale);
    if (!page || !posts) throw new Error('404');

    return {
      props: {
        pageUrl: `/blog/${params.post}`,
        blogPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

import React from 'react';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import { Image } from "../typescript/action";

type AdditionalParam = {
  banner_title: string;
  banner_description: string;
  title: {};
  title_h2: string;
  body: string;
  date: string;
}

type Article = {
  href: string;
  title: string;
  $: AdditionalParam;
}

type FeaturedBlog = {
  title: string;
  featured_image: Image;
  body: string;
  url: string;
  $: AdditionalParam;
}

type FeaturedBlogData = {
  title_h2: string;
  view_articles: Article;
  featured_blogs: [FeaturedBlog];
  $: AdditionalParam;
}

type FeaturedBlogProps = {
  fromBlog: FeaturedBlogData;
}

export default function BlogSection(props: FeaturedBlogProps) {
  const router = useRouter();
  const { locale } = router.query as { locale?: string };
  const fromBlog = props.fromBlog;

  const handleNavigation = (url: string) => {
    const localizedUrl = `/${locale}${url}`;
    if (router.asPath !== localizedUrl) {
      router.push(localizedUrl);
    }
  };

  return (
    <div className='community-section'>
      <div className='community-head'>
        {fromBlog.title_h2 && (
          <h2 {...fromBlog.$?.title_h2 as {}}>{fromBlog.title_h2}</h2>
        )}
        {fromBlog.view_articles && (
          <div
            onClick={() => handleNavigation(fromBlog.view_articles.href)}
            className='btn secondary-btn article-btn'
            style={{ cursor: 'pointer' }}
            {...fromBlog.view_articles.$?.title}
          >
            {fromBlog.view_articles.title}
          </div>
        )}
      </div>
      <div className='home-featured-blogs'>
        {fromBlog.featured_blogs.map((blog, index) => (
          <div className='featured-blog' key={index}>
            {blog.featured_image && (
              <img
                {...blog.featured_image.$?.url as {}}
                src={blog.featured_image.url}
                alt={blog.featured_image.filename}
                className='blog-post-img'
              />
            )}
            <div className='featured-content'>
              {blog.title && <h3 {...blog.$?.title}>{blog.title}</h3>}
              {typeof blog.body === 'string' && (
                <div>{parse(blog.body.slice(0, 300))}</div>
              )}
              {blog.url && (
                <div
                  onClick={() => handleNavigation(blog.url)}
                  className='blogpost-readmore'
                  style={{ cursor: 'pointer' }}
                >
                  {'Read More -->'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
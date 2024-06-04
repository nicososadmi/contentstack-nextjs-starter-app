import { addEditableTags } from "@contentstack/utils";
import { Page, BlogPosts } from "../typescript/pages";
import getConfig from "next/config";
import { FooterProps, HeaderProps } from "../typescript/layout";
import { getEntry, getEntryByUrl } from "../contentstack-sdk";
import { NextRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";

export const getHeaderRes = async (locale: string): Promise<HeaderProps> => {

  const response = (await getEntry({
    contentTypeUid: "header",
    referenceFieldPath: ["navigation_menu.page_reference"],
    jsonRtePath: ["notification_bar.announcement_text"],
    locale
  })) as HeaderProps[][];

  liveEdit && addEditableTags(response[0][0], "header", true);
  return response[0][0];
};

export const getFooterRes = async (locale: string): Promise<FooterProps> => {
  const response = (await getEntry({
    contentTypeUid: "footer",
    referenceFieldPath: undefined,
    jsonRtePath: ["copyright"],
    locale
  })) as FooterProps[][];
  liveEdit && addEditableTags(response[0][0], "footer", true);
  return response[0][0];
};

export const getAllEntries = async (locale: string): Promise<Page[]> => {
  const response = (await getEntry({
    contentTypeUid: "page",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
    locale
  })) as Page[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, "page", true));
  return response[0];
};

export const getPageRes = async (entryUrl: string, locale: string): Promise<Page> => {
  entryUrl = entryUrl.replace(/\/(en|fr)/g, '') 
           .replace(/\?locale=(en|fr)/g, '') 
           .replace(/\?$/, '')

  if (entryUrl === '') {
    entryUrl = '/'
  }

  const response = (await getEntryByUrl({
    contentTypeUid: "page",
    entryUrl,
    referenceFieldPath: ["page_components.from_blog.featured_blogs"],
    jsonRtePath: [
      "page_components.from_blog.featured_blogs.body",
      "page_components.section_with_buckets.buckets.description",
      "page_components.section_with_html_code.description",
    ],
    locale
  })) as Page[];
  liveEdit && addEditableTags(response[0], "page", true);
  return response[0];
};

export const getBlogListRes = async (locale: string): Promise<BlogPosts[]> => {
  const response = (await getEntry({
    contentTypeUid: "blog_post",
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body"],
    locale
  })) as BlogPosts[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, "blog_post", true));
  return response[0];
};

export const getBlogPostRes = async (entryUrl: string, locale: string): Promise<BlogPosts> => {
  const response = (await getEntryByUrl({
    contentTypeUid: "blog_post",
    entryUrl,
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body", "related_post.body"],
    locale
  })) as BlogPosts[];
  liveEdit && addEditableTags(response[0], "blog_post", true);
  return response[0];
};

const mapShortLocaleToFullLocale = (shortLocale: string): string => {
  const localeMap: { [key: string]: string } = {
    en: 'en-us',
    fr: 'fr-fr',
  };
  return localeMap[shortLocale] || 'en-us'; // Default to 'en-us' if not found
};

export const getLocale = (router: NextRouter): string => {
  const { locale } = router.query as { locale?: string };

  return mapShortLocaleToFullLocale(locale || 'en');
}

export const getPageLocale = (locale: string): string => {
  return mapShortLocaleToFullLocale(locale || 'en');
}

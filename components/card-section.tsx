import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Action } from "../typescript/action";

type AdditionalParam = {
  title_h3: string;
  description: string;
}

type Card = {
  title_h3: string;
  description: string;
  call_to_action: Action;
  $: AdditionalParam;
}

type CardProps = {
  cards: [Card]
}

export default function CardSection({ cards }: CardProps) {
  const router = useRouter();
  const { locale } = router.query as { locale?: string };

  const buildLocalizedUrl = (url: string) => {
    return `/${locale}${url}`;
  };

  const handleNavigation = (url: string) => {
    const localizedUrl = buildLocalizedUrl(url);
    if (router.asPath !== localizedUrl) {
      router.push(localizedUrl);
    }
  };

  return (
    <div className='demo-section'>
      {cards?.map((card, index) => (
        <div className='cards' key={index}>
          {card.title_h3 && <h3 {...card.$?.title_h3 as {}}>{card.title_h3}</h3>}
          {card.description && <p {...card.$?.description as {}}>{card.description}</p>}
          <div className='card-cta'>
            {card.call_to_action.title && card.call_to_action.href && (
              <button
                onClick={() => handleNavigation(card.call_to_action.href)}
                className='btn primary-btn'
                {...card.call_to_action.$?.title}
              >
                {card.call_to_action.title}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
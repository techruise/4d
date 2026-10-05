import type { Metadata } from 'next';
import OfferPage from '@/components/offer/OfferPage';

export const metadata: Metadata = {
  title: 'Websites that cruise — fast, animated, AI-powered',
  description:
    'Techruise designs and builds premium, animated, AI-powered websites that turn visitors into customers. 3D motion, intelligent agents, SEO and speed — built in from day one. Let your business cruise.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Techruise',
  slogan: 'Let your business cruise',
  email: 'techruise5@gmail.com',
  founder: {
    '@type': 'Person',
    name: 'Raja Hunain',
    jobTitle: 'Founder & CEO',
  },
  makesOffer: {
    '@type': 'Offer',
    name: 'Website design & build',
    description:
      'Fast, animated, AI-powered websites with premium design, 3D visuals, intelligent agents, SEO and speed built in.',
  },
};

export default function Offer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OfferPage />
    </>
  );
}

import type { BrandConfig } from '@triparc/brand-engine';

/** Seed data returned by the mock `/Brand/{brandCode}` endpoint simulation. */
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  brandCode: 'kt',
  name: 'Kensington',
  legalName: 'Kensington Ltd.',
  fonts: {
    default: { fontFamily: 'Urbanist' },
    display: { fontFamily: 'Lora' },
  },
  images: {
    primaryLogo: { url: '', altText: 'Kensington logo' },
    primaryLogoDark: { url: '', altText: 'Kensington logo (dark)' },
    favicon: { url: '', altText: 'Kensington favicon' },
    poweredBy: { url: '', altText: 'Powered by Triparc' },
  },
  colors: {
    primary: { hex: '#3A2F3C' },
    accent: { hex: '#767260' },
    warn: { hex: '#B3261E' },
    success: { hex: '#2E7D32' },
    alert: { hex: '#F9A825' },
    attention: { hex: '#0288D1' },
    neutral: { hex: '#6B6B6B' },
    color1: { hex: '#E0D7E6' },
    color2: { hex: '#D3EBE1' },
    color3: { hex: '#1A3E32' },
    color4: { hex: '#FDF9EC' },
  },
  linkGroups: {
    social: { title: 'Social', links: [] },
    legal: { title: 'Legal', links: [] },
    resources: { title: 'Resources', links: [] },
    help: { title: 'Help', links: [] },
    mobileApps: { title: 'Mobile Apps', links: [] },
    other: { title: 'Other', links: [] },
  },
  poweredBy: {
    name: 'Triparc',
    image: { url: '', altText: 'Triparc' },
    key: 'triparc',
    url: 'https://triparc.com',
    label: 'Powered by Triparc',
    icon: '',
  },
  textEntry: {
    emailSignature: { lang: 'en', text: 'Kensington Ltd.' },
  },
  domains: [{ key: 'default', domainName: 'kensington.example.com' }],
  dateModified: new Date().toISOString(),
  auth0: {
    tenant: 'kensington',
    connectionId: '',
    connectionName: '',
    organizationId: '',
    organizationName: 'Kensington',
  },
};

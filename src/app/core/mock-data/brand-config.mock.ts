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
    secondary: { hex: '#3A2F3C' },
    tertiary: { hex: '#E0D7E6' },
    accent: { hex: '#767260' },
    secondaryAccent: { hex: '#D3EBE1' },
    tertiaryAccent: { hex: '#1A3E32' },
    backgroundPrimary: { hex: '#FDF9EC' },
    backgroundSecondary: { hex: '#FAF8F4' },
    backgroundTertiary: { hex: '#F5F0E2' },
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

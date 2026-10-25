import SiteRoot, { rootMetadata } from '../../components/SiteRoot';
export const metadata = rootMetadata;
export default function Layout({ children }: { children: React.ReactNode }) { return <SiteRoot locale="es">{children}</SiteRoot>; }

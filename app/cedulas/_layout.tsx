import { CedulaProvider } from '@/context/CedulaContext';

export default function CedulasLayout({ children }: { children: React.ReactNode }) {
  return (
    <CedulaProvider>
      {children}
    </CedulaProvider>
  );
}

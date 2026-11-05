export default function EstadoCarregando({ children }: { children: React.ReactNode }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {children}
    </div>
  );
}

import TipJarWrapper from './components/TipJarWrapper';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <TipJarWrapper />
      
      <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
        <p>Powered by LNBits ⚡</p>
      </footer>
    </div>
  );
}
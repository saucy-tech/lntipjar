import TipJarWrapper from './components/TipJarWrapper';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <TipJarWrapper />
      
      <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
        <p>An <Link href={'https://atlbitlab.com/'} target="_blank" className="hover:underline text-yellow-500">ATL BitLab</Link> Demo</p>
      </footer>
    </div>
  );
}
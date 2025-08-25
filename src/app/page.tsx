import { LoginBox } from '@/components/index.cjs'; 

export default function Home() {
  return (
    <div className="w-full h-[100vh] p-8 flex flex-col items-center justify-center bg-[url('/bg_fincas.jpeg')] bg-cover bg-center">
      <LoginBox />
    </div>
  );
}

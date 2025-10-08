import { LoginBox } from '@/components/index.cjs'; 
import { isLogged, getUsername } from '@/middlewares';
import { redirect } from 'next/navigation';

export default async function Home() {
  const logged = await isLogged();
  const username = await getUsername();
  if (logged && username) redirect('/images');
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[url('/bg_fincas.jpeg')] bg-cover bg-center">
      <LoginBox />
    </div>
  );
}

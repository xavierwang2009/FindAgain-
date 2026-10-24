import FindAgain from './find-again';
import {getUser} from '@/lib/auth';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
async function SignedInApp(){if(!await getUser())redirect('/signin');return <FindAgain/>}
export default function Home(){return <SignedInApp/>}

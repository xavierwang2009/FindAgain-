import FindAgain from './find-again';
import {requireChatGPTUser} from './chatgpt-auth';
export const dynamic='force-dynamic';
async function SignedInApp(){await requireChatGPTUser('/');return <FindAgain/>}
export default function Home(){return <SignedInApp/>}

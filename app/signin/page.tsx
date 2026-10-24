export const dynamic='force-dynamic';
export default async function SignIn({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams;
 return <main style={{maxWidth:480,margin:'8vh auto',padding:24,textAlign:'center'}}>
  <img src="/icons/icon-192.png" width="80" height="80" alt=""/>
  <h1>FindAgain</h1><p>Remember where you put everyday things.</p>
  <p>Sign in to save your places and photos privately.</p>
  {error&&<p role="alert">Sign-in did not finish. Please try again.</p>}
  <a className="primary-button" href="/auth/google" target="_top">Sign in with Google</a>
  <p style={{fontSize:14,marginTop:24}}>By Xavier Wang · <a href="/privacy">Privacy policy</a></p>
 </main>
}

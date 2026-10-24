import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
const googleKeys=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
export async function verifyGoogleToken(token:string,audience:string,nonce:string,keys:JWTVerifyGetKey=googleKeys){
 const {payload}=await jwtVerify(token,keys,{issuer:['https://accounts.google.com','accounts.google.com'],audience,algorithms:['RS256'],requiredClaims:['sub','exp','iat','nonce','email','email_verified']});
 if(payload.nonce!==nonce||payload.email_verified!==true||typeof payload.email!=='string'||!payload.sub)throw Error('Invalid Google identity');
 return {userId:payload.sub,email:payload.email};
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {voiceSession} from '../lib/voice-session.ts';
function setup(){
 const state={text:'',done:[],errors:[],listening:false};
 const engine={start(){this.onstart()},stop(){this.onend()},abort(){this.onend()}};
 const session=voiceSession(engine,{onText:t=>state.text=t,onDone:t=>state.done.push(t),onError:e=>state.errors.push(e),onListening:v=>state.listening=v});
 return {engine,session,state};
}
test('dictation collects speech and completes once without auto-saving',()=>{
 const {engine,session,state}=setup();session.start();
 engine.onresult({results:[Object.assign([{transcript:'bedside drawer'}],{isFinal:true})]});
 engine.onend();assert.equal(state.text,'bedside drawer');assert.deepEqual(state.done,['bedside drawer']);assert.equal(state.listening,false);
});
test('permission denial explains failure and clears listening',()=>{
 const {engine,session,state}=setup();session.start();engine.onerror({error:'not-allowed'});
 assert.match(state.errors[0],/Microphone access is blocked/);assert.deepEqual(state.done,[]);assert.equal(state.listening,false);
});
test('cancelling ignores late speech results',()=>{
 const {engine,session,state}=setup();session.start();session.abort();
 engine.onresult({results:[Object.assign([{transcript:'ignore me'}],{isFinal:true})]});
 assert.equal(state.text,'');assert.deepEqual(state.done,[]);assert.equal(state.listening,false);
});

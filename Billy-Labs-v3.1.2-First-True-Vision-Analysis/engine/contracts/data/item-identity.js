/* Billy Engine canonical item identity contract — v1 */
(() => {
  const VERSION = 1;
  const TYPES = Object.freeze({MASHUP:'mashup', BASE_EMOJI:'base-emoji'});
  const normalize = value => String(value || '').normalize('NFC');
  const pairId = (left, right) => {
    if (!window.BillyMashups?.id) throw new Error('ItemIdentity requires BillyMashups');
    return window.BillyMashups.id(normalize(left), normalize(right));
  };
  const mashup = (left, right) => Object.freeze({type:TYPES.MASHUP,id:pairId(left,right)});
  const baseEmoji = emoji => Object.freeze({type:TYPES.BASE_EMOJI,id:normalize(emoji)});
  const key = item => `${item?.type || ''}:${item?.id || ''}`;
  const parseKey = value => {
    const text=String(value||''), index=text.indexOf(':');
    if(index<1)return null;
    const type=text.slice(0,index), id=text.slice(index+1);
    return Object.values(TYPES).includes(type)&&id?{type,id}:null;
  };
  window.BillyItemIdentity=Object.freeze({version:VERSION,types:TYPES,normalize,pairId,mashup,baseEmoji,key,parseKey});
})();

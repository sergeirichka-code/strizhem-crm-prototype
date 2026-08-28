const haircuts=[
{id:'box',name:'Бокс',price:400,image:'./haircut-crops/box.png'},
{id:'halfbox',name:'Полубокс',price:700,image:'./haircut-crops/halfbox.png'},
{id:'classic',name:'Классика',price:900,image:'./haircut-crops/classic.png'},
{id:'canada',name:'Канадка',price:900,image:'./haircut-crops/canada.png'},
{id:'platform',name:'Площадка',price:900,image:'./haircut-crops/platform.png'},
{id:'model',name:'Модельная',price:900,image:'./haircut-crops/model.png'},
{id:'kids',name:'Детская',price:700,image:'./haircut-crops/kids.png'}
];
const extras=[
{id:'wash-style',name:'Мытьё головы',description:'/ Стайлинг',price:100,priceLabel:'100 / 100 ₽',image:'./extra-services/wash.png'},
{id:'personal',name:'Персонализация',price:300,image:'./extra-services/personal.png'},
{id:'beard',name:'Оформление бороды',description:'/ Моделирование бороды',price:500,priceLabel:'500 / 700 ₽',image:'./extra-services/beard-shape.png'},
{id:'super-shave',name:'Супер Бритьё',price:1200,image:'./extra-services/super-shave.png'},
{id:'camouflage',name:'Камуфляж Бороды',description:'/ Камуфляж Головы',price:800,priceLabel:'800 / 1000 ₽',image:'./extra-services/beard-camouflage.png'},
{id:'fade',name:'Фейд',description:'(дополнительный элемент в стрижке)',price:200,image:'./extra-services/fade.png'},
{id:'mask',name:'Чёрная маска',price:600,image:'./extra-services/black-mask.png'},
{id:'edge',name:'Окантовка',price:200,image:'./extra-services/edge.png'},
{id:'wash-dry',name:'Мытьё + сушка',price:200,image:'./extra-services/wash-dry.png'},
{id:'depilation',name:'Депиляция',description:'(стоимость за 1 зону)',price:300,image:'./extra-services/depilation.png'},
{id:'personal-pro',name:'Персонализация ПРО',price:500,image:'./extra-services/personal-pro.png'},
{id:'shaver',name:'Бритьё шейвером',price:800,image:'./extra-services/shaver.png'}
];
const sources=[
{id:'yandex',label:'Яндекс-карты',icon:'yandex'},
{id:'2gis',label:'2ГИС',icon:'2gis'},
{id:'google',label:'Гугл-карты',icon:'google'},
{id:'flyer',label:'Листовка',icon:'flyer'},
{id:'recommend',label:'Рекомендация',icon:'recommend'},
{id:'site',label:'Сайт',icon:'site'},
{id:'social',label:'Соц сети',icon:'social'},
{id:'walkin',label:'Проходил мимо',icon:'walkin'},
{id:'regular',label:'Постоянный клиент',icon:'regular'}
];
const masters=[
{id:101,display:1,enabled:true},
{id:102,display:2,enabled:true},
{id:103,display:3,enabled:true},
{id:104,display:4,enabled:false},
{id:105,display:5,enabled:false}
];
const state={screen:'home',flow:'services',base:null,selectedExtras:{},phone:'',consentAccepted:true,master:null,masterBackendId:null,rating:null,selectedSource:null,modal:null,entry:'haircut',promoCode:'',promoDraft:'',promoError:'',promoValidating:false,useBonuses:false,bonusVerified:false,birthDraft:'',birthError:'',birthValidating:false,servicePin:'',servicePinError:'',servicePinValidating:false,serviceAuthed:false,serviceBusy:null,serviceMessages:[],promotionSelection:null,cosmeticsCategory:'shampoo',cosmeticsManufacturer:'ESTEL',cosmeticsCart:{},receiptTo:'none',receiptPhone:'',receiptEmail:'',emailDraft:'',emailError:'',emailSaving:false,emailShift:false,paymentMethod:'',scale:1};
const __p=new URLSearchParams(location.search);if(__p.get('demo')==='extras'){state.screen='extras';state.base=haircuts[1];state.entry='haircut';state.selectedExtras={'wash-style':1,'beard':1,'fade':1};}if(__p.get('demo')==='phone'){state.screen='phone';state.base=haircuts[1];state.entry='haircut';state.selectedExtras={'wash-style':1,'beard':1,'fade':1};}if(__p.get('demo')==='source'){state.screen='source';state.base=haircuts[1];state.entry='haircut';state.selectedExtras={'wash-style':1};}
if(__p.get('demo')==='promos'){state.screen='promos';}
if(__p.get('demo')==='cosmetics'){state.flow='cosmetics';state.screen='cosmetics';}
if(__p.get('demo')==='rating'){state.screen='rating';state.base=haircuts[1];state.entry='haircut';state.selectedExtras={'wash-style':1};state.selectedSource='yandex';}
if(__p.get('demo')==='payment'){state.screen='payment';state.base=haircuts[1];state.entry='haircut';state.selectedExtras={'wash-dry':1,'fade':1};state.selectedSource='yandex';state.master=1;state.masterBackendId=101;state.rating=5;state.phone='9991234567';state.receiptTo='none';}
const policyContent=(window.STRIZHEM_POLICY_CONTENT&&typeof window.STRIZHEM_POLICY_CONTENT==='object')?window.STRIZHEM_POLICY_CONTENT:null;
const app=document.getElementById('app');
const fmt=n=>Number(n||0).toLocaleString('ru-RU');
const selectedExtraItems=()=>extras.filter(x=>(state.selectedExtras[x.id]||0)>0);
const total=()=> (state.base?.price||0)+selectedExtraItems().reduce((s,i)=>s+i.price*state.selectedExtras[i.id],0);
const serviceCount=()=> (state.base?1:0)+Object.values(state.selectedExtras).reduce((s,n)=>s+n,0);
const receiptDiscount=()=> total()>0?100:0;
const receiptBonusSpent=()=> state.useBonuses?Math.min(235,150,total()):0;
const payableTotal=()=>Math.max(0,total()-receiptDiscount()-receiptBonusSpent());
const bonusAccrual=()=>Math.floor(payableTotal()*0.05);
const receiptPhoneDisplay=()=> state.phone.length===10 ? `+7 (${state.phone.slice(0,3)}) ${state.phone.slice(3,6)}-${state.phone.slice(6,8)}-${state.phone.slice(8,10)}` : '+7 (999) 123-45-67';
const serviceNameForReceipt=(base)=> base && base.id==='halfbox' ? 'Мужская стрижка' : (base? base.name : '');
const openPromoModal=()=>{state.promoDraft=state.promoCode||'';state.promoError='';state.promoValidating=false;state.modal='promo';render();};
const closePromoModal=()=>{state.modal=null;state.promoDraft='';state.promoError='';state.promoValidating=false;render();};
const validatePromoCode=(code)=> new Promise(resolve=>setTimeout(()=>{const normalized=(code||'').trim();const validCodes=new Set(['1234','1111','5555','123456']);if(validCodes.has(normalized))resolve({ok:true,code:normalized});else resolve({ok:false,message:'Промокод не найден или недействителен'});},450));
const openEmailModal=()=>{state.emailDraft=state.receiptEmail||'';state.emailError='';state.emailSaving=false;state.emailShift=false;state.modal='email';render();};
const closeEmailModal=()=>{state.modal=null;state.emailDraft='';state.emailError='';state.emailSaving=false;state.emailShift=false;render();};
const emailLooksValid=(value)=>{const v=(value||'').trim();if(!v)return {ok:false,message:'Введите e-mail.'};if(/\s/.test(v)||!v.includes('@'))return {ok:false,message:'Проверьте правильность e-mail.'};const parts=v.split('@');if(parts.length!==2||!parts[0]||!parts[1]||!parts[1].includes('.')||parts[1].startsWith('.')||parts[1].endsWith('.'))return {ok:false,message:'Проверьте правильность e-mail.'};return {ok:true,value:v};};
const saveReceiptEmail=async(value)=>{try{if(typeof window.STRIZHEM_SAVE_RECEIPT_EMAIL==='function'){const r=await window.STRIZHEM_SAVE_RECEIPT_EMAIL(value);return r&&typeof r==='object'?r:{ok:!!r};}return await new Promise(resolve=>setTimeout(()=>resolve({ok:true}),280));}catch(e){return {ok:false,message:'Не удалось сохранить e-mail. Попробуйте ещё раз.'};}};
const openBirthModal=()=>{state.birthDraft='';state.birthError='';state.birthValidating=false;state.modal='birthdate';render();};
const closeBirthModal=()=>{state.modal=null;state.birthDraft='';state.birthError='';state.birthValidating=false;state.useBonuses=false;state.bonusVerified=false;render();};
const birthParts=()=>{const d=(state.birthDraft+'________').slice(0,8).split('');return {d,day:d.slice(0,2),month:d.slice(2,4),year:d.slice(4,8)}};
const validateBirthLocal=digits=>{if(digits.length<8)return 'Введите дату рождения полностью.';const day=Number(digits.slice(0,2)),month=Number(digits.slice(2,4)),year=Number(digits.slice(4,8));if(month<1||month>12||year<1000)return 'Проверьте правильность даты рождения.';const dt=new Date(year,month-1,day);if(dt.getFullYear()!==year||dt.getMonth()!==month-1||dt.getDate()!==day)return 'Проверьте правильность даты рождения.';const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(dt>today)return 'Проверьте правильность даты рождения.';return '';};
const verifyBirthDate=digits=>new Promise(resolve=>setTimeout(()=>resolve({ok:true}),500));
const openServicePinModal=()=>{state.servicePin='';state.servicePinError='';state.servicePinValidating=false;state.modal='service-pin';render();};
const closeServicePinModal=()=>{state.modal=null;state.servicePin='';state.servicePinError='';state.servicePinValidating=false;render();};
const verifyServiceModePin=async(pin)=>{try{if(typeof window.STRIZHEM_VERIFY_SERVICE_PIN==='function'){const r=await window.STRIZHEM_VERIFY_SERVICE_PIN(pin);return r&&typeof r==='object'?r:{ok:!!r};}return await new Promise(resolve=>setTimeout(()=>resolve(pin==='12345'?{ok:true,demo:true}:{ok:false,message:'Неверный PIN. Попробуйте ещё раз.'}),350));}catch(e){return {ok:false,message:'Не удалось выполнить проверку. Попробуйте ещё раз.'};}};
const serviceDenoms=[5000,1000,2000,500,200,100,50];
const serviceData=()=>({version:(window.STRIZHEM_SERVICE_VERSION||'1.0.0'),terminalId:(window.STRIZHEM_TERMINAL_ID||'1'),time:(window.STRIZHEM_SERVICE_TIME||new Date().toLocaleString('ru-RU')),denoms:(window.STRIZHEM_BILL_DENOMS||serviceDenoms.map(v=>({value:v,count:0}))),total:(window.STRIZHEM_BILL_TOTAL||0),collection:(window.STRIZHEM_COLLECTION_TOTAL||0)});
const pushServiceMessage=(text,type='info')=>{state.serviceMessages=[...state.serviceMessages,{text,type,ts:Date.now()}].slice(-8);render();};
const runServiceAction=async(action,label)=>{if(state.serviceBusy)return;state.serviceBusy=action;render();try{const fn=window[action];if(typeof fn==='function'){const r=await fn();pushServiceMessage((r&&r.message)||label+' — выполнено',r&&r.ok===false?'error':'success');}else{await new Promise(r=>setTimeout(r,320));pushServiceMessage(label+' — demo', 'info');}}catch(e){pushServiceMessage('Ошибка: '+label,'error');}finally{state.serviceBusy=null;render();}};
function fit(){state.scale=Math.min(innerWidth/1024,innerHeight/768,1);render();}
window.addEventListener('resize',fit);
function title(overline,t){return `<div class="title"><p>${overline}</p><h2>${t}</h2></div>`}
const cosmeticsProducts=[
{id:'estel-tone-250',name:'ТОНИЗИРУЮЩИЙ\nШАМПУНЬ 250МЛ',price:600,category:'shampoo',manufacturer:'ESTEL'},
{id:'estel-growth-250',name:'ШАМПУНЬ АКТИВАТОР\nРОСТА 250МЛ',price:600,category:'shampoo',manufacturer:'ESTEL',badge:'ХИТ'},
{id:'estel-dandruff-250',name:'ШАМПУНЬ ПРОТИВ\nПЕРХОТИ 250МЛ',price:600,category:'shampoo',manufacturer:'ESTEL'},
{id:'estel-alpha-250',name:'ШАМПУНЬ ALPHA\nMARINE 250МЛ',price:650,category:'shampoo',manufacturer:'ESTEL'},
{id:'estel-genwood-250',name:'ШАМПУНЬ GENWOOD\n250МЛ',price:650,category:'shampoo',manufacturer:'ESTEL'},
{id:'estel-tone-300',name:'ТОНИЗИРУЮЩИЙ\nШАМПУНЬ 300МЛ',price:700,category:'shampoo',manufacturer:'ESTEL'},
{id:'estel-growth-300',name:'ШАМПУНЬ АКТИВАТОР\nРОСТА 300МЛ',price:700,category:'shampoo',manufacturer:'ESTEL',badge:'ХИТ'},
{id:'estel-dandruff-300',name:'ШАМПУНЬ ОТ\nПЕРХОТИ 300МЛ',price:700,category:'shampoo',manufacturer:'ESTEL'},
{id:'tefia-style-1',name:'МАТОВАЯ ПАСТА\nДЛЯ УКЛАДКИ',price:750,category:'styling',manufacturer:'TEFIA'},
{id:'tefia-style-2',name:'МОДЕЛИРУЮЩИЙ\nВОСК',price:690,category:'styling',manufacturer:'TEFIA'},
{id:'tefia-shave-1',name:'ГЕЛЬ ДЛЯ БРИТЬЯ',price:590,category:'shave',manufacturer:'TEFIA'},
{id:'tefia-shave-2',name:'БАЛЬЗАМ ПОСЛЕ\nБРИТЬЯ',price:720,category:'shave',manufacturer:'TEFIA'},
{id:'estel-other-1',name:'ТОНИК ДЛЯ КОЖИ',price:540,category:'other',manufacturer:'ESTEL'},
{id:'tefia-other-1',name:'УХОД ДЛЯ БОРОДЫ',price:810,category:'other',manufacturer:'TEFIA'}
];
const cosmeticsCategories=[['shampoo','ШАМПУНИ\nИ УХОД','bottle'],['styling','СТАЙЛИНГ','style'],['shave','БРИТЬЕ И\nУХОД','shave'],['other','ПРОЧЕЕ','dots']];
const cosmeticsCount=()=>Object.values(state.cosmeticsCart).reduce((a,b)=>a+b,0);
const cosmeticsVisible=()=>cosmeticsProducts.filter(p=>p.category===state.cosmeticsCategory&&p.manufacturer===state.cosmeticsManufacturer);
function cosmeticsPlaceholder(index=0){return `<div class="cosmetics-placeholder ph-${index%4}" aria-hidden="true"><span class="ph-cap"></span><span class="ph-body"></span><i></i></div>`}
function cosmeticsSteps(){const labels=['Косметика','Телефон','Источник','Мастер','Оплата'];const map={cosmetics:1,phone:2,source:3,rating:4,payment:5,success:5};const current=map[state.screen]||1;return `<div class="steps cosmetics-steps">${labels.map((x,i)=>`<span class="${i+1===current?'active':''}"><b>${i+1}</b><small>${x}</small></span>`).join('')}</div>`}
function cosmeticsScreen(){const visible=cosmeticsVisible();return `<div class="cosmetics-screen">
  <aside class="cosmetics-sidebar">${cosmeticsCategories.map(([id,label,icon])=>`<button class="cosmetics-category ${state.cosmeticsCategory===id?'active':''}" data-cosmetics-category="${id}"><span class="cosmetics-cat-icon ${icon}"></span><b>${label.replace('\\n','<br>')}</b></button>`).join('')}</aside>
  <section class="cosmetics-main">
    <div class="cosmetics-manufacturers"><button class="${state.cosmeticsManufacturer==='ESTEL'?'active':''}" data-cosmetics-manufacturer="ESTEL">ESTEL</button><button class="${state.cosmeticsManufacturer==='TEFIA'?'active':''}" data-cosmetics-manufacturer="TEFIA">TEFIA</button></div>
    <div class="cosmetics-catalog-wrap"><div class="cosmetics-catalog" id="cosmeticsCatalog">${visible.length?visible.map((p,i)=>{const q=state.cosmeticsCart[p.id]||0;return `<article class="cosmetics-product-card">${p.badge?`<span class="cosmetics-hit">${p.badge}</span>`:''}<div class="cosmetics-product-image">${cosmeticsPlaceholder(i)}</div><h3>${p.name.replace('\\n','<br>')}</h3><strong>${fmt(p.price)} ₽</strong><div class="cosmetics-qty"><button data-cosmetics-minus="${p.id}" ${q===0?'disabled':''}>−</button><span>${q}</span><button class="plus" data-cosmetics-plus="${p.id}">＋</button></div></article>`}).join(''):`<div class="cosmetics-empty">В этой категории товары отсутствуют</div>`}</div><div class="cosmetics-scroll-controls"><button data-action="cosmetics-scroll-up" aria-label="Прокрутить вверх">⌃</button><div class="cosmetics-scroll-track"><i></i></div><button data-action="cosmetics-scroll-down" aria-label="Прокрутить вниз">⌄</button></div></div>
  </section>
</div>`}
function steps(){if(state.flow==='cosmetics')return cosmeticsSteps();const map={haircuts:1,promos:2,extras:2,phone:3,source:4,rating:5,payment:6,success:6};const current=map[state.screen]||1;return `<div class="steps">${['Стрижка','Доп. услуги','Данные','Источник','Оценка','Оплата'].map((x,i)=>`<span class="${i+1===current?'active':''}"><b>${i+1}</b><small>${x}</small></span>`).join('')}</div>`}
function goHome(){Object.assign(state,{screen:'home',base:null,selectedExtras:{},phone:'',master:null,masterBackendId:null,rating:null,selectedSource:null,entry:'haircut',promotionSelection:null});render();}
function goBackFromExtras(){state.screen=state.entry==='promo'?'promos':state.entry==='extras'?'home':'haircuts';render();}
function changeExtra(id,delta){const n=Math.max(0,Math.min(99,(state.selectedExtras[id]||0)+delta)); if(n===0)delete state.selectedExtras[id];else state.selectedExtras[id]=n; render();}
function phoneText(){const digits=(state.phone+'__________').slice(0,10).split('');return `+7 (${digits.slice(0,3).join('')}) ${digits.slice(3,6).join('')}-${digits.slice(6,8).join('')}-${digits.slice(8,10).join('')}`;}
function nextPhoneScreen(){const knownClients=new Set(['9991234567','9000000000','9211112233']);if(state.phone.length===0){state.screen='source';render();return;}if(state.phone.length===10){state.screen=knownClients.has(state.phone)?'rating':'source';render();return;}if(window.confirm('Номер введён не полностью. Нажмите OK, чтобы очистить поле и продолжить без номера. Нажмите Отмена, чтобы вернуться и завершить ввод.')){state.phone='';state.screen='source';render();}}
function home(){return `<div class="hero"><h1>Здравствуйте!<br/>Выберите раздел</h1><p>Чтобы начать, выберите нужный раздел</p></div><div class="home-grid">
<button class="home-card" data-action="haircuts"><img class="home-card-art" src="./home-icons/haircut.png" alt=""><i></i><b>СТРИЖКА</b><small>Выберите стрижку, которую Вам выполнили</small><strong>→</strong></button>
<button class="home-card" data-action="extras-home"><img class="home-card-art" src="./home-icons/extras.png" alt=""><i></i><b>ДОП УСЛУГИ</b><small>Отметьте выполненные дополнительные услуги</small><strong>→</strong></button>
<button class="home-card" data-action="promos"><img class="home-card-art" src="./home-icons/promos.png" alt=""><i></i><b>АКЦИИ</b><small>Посмотрите актуальные акции и специальные предложения</small><strong>→</strong></button>
<button class="home-card" data-action="cosmetics"><img class="home-card-art" src="./home-icons/cosmetics.png" alt=""><i></i><b>КОСМЕТИКА</b><small>Профессиональная косметика для ухода за волосами и бородой</small><strong>→</strong></button></div>`}
function haircutScreen(){return title('Выберите из списка или нажмите «Далее»','Выберите стрижку')+`<div class="cards">${haircuts.map(i=>`<button class="product ${state.base?.id===i.id?'selected':''}" data-haircut="${i.id}"><span class="check">✓</span><span class="picture"><img src="${i.image}" alt=""></span><span class="product-info"><b>Стрижка «${i.name}»</b><em>${i.price} ₽</em></span></button>`).join('')}</div>`}
function promos(){const selected=state.promotionSelection;return `<div class="promotions-screen">
  <h1>ДОСТУПНЫЕ АКЦИИ</h1>
  <div class="promotions-grid">
    <button class="promotion-card active-promo ${selected==='senior'?'selected':''}" data-promotion="senior" aria-pressed="${selected==='senior'}">
      <div class="promotion-art"><img src="./brand/action-senior-clean.png" alt="Пенсионер"></div>
      <div class="promotion-content">
        <span class="promotion-badge active"><i>✓</i> АКЦИЯ АКТИВНА</span>
        <h2>ПЕНСИОНЕР</h2>
        <p>Скидка для пенсионеров<br>на мужские стрижки.</p>
        <div class="promotion-price">400 ₽</div>
      </div>
    </button>
    <button class="promotion-card active-promo ${selected==='father-son'?'selected':''}" data-promotion="father-son" aria-pressed="${selected==='father-son'}">
      <div class="promotion-art"><img src="./brand/action-family-clean.png" alt="Отец и сын"></div>
      <div class="promotion-content">
        <span class="promotion-badge active"><i>✓</i> АКЦИЯ АКТИВНА</span>
        <h2>ОТЕЦ И СЫН</h2>
        <p>Скидка при стрижке отца<br>и сына в один визит.</p>
        <div class="promotion-price">1 400 ₽</div>
      </div>
    </button>
    <div class="promotion-card inactive-promo" aria-disabled="true">
      <div class="promotion-art coupon-art"><img src="./promotions/coupon-reference-clean.png" alt="Купон на стрижку"></div>
      <div class="promotion-content">
        <span class="promotion-badge inactive"><i>×</i> АКЦИЯ НЕАКТИВНА</span>
        <h2>КУПОН НА СТРИЖКУ</h2>
        <p>Подарите стрижку близкому —<br>удобный формат подарка.</p>
        <div class="promotion-price disabled">НЕДОСТУПНО</div>
      </div>
    </div>
    <div class="promotion-card inactive-promo" aria-disabled="true">
      <div class="promotion-art cosmetics-art"><img src="./home-icons/cosmetics.png" alt="Комплекс"></div>
      <div class="promotion-content">
        <span class="promotion-badge inactive"><i>×</i> АКЦИЯ НЕАКТИВНА</span>
        <h2>КОМПЛЕКС</h2>
        <p>Выгодное предложение<br>на стрижку и уход.</p>
        <div class="promotion-price disabled">НЕДОСТУПНО</div>
      </div>
    </div>
  </div>
</div>`}
function extrasScreen(){const items=selectedExtraItems();const positions=items.length+(state.base?1:0);const density=positions>=10?'dense':positions>=6?'compact':'comfortable';return `<button class="upper-back" data-action="upper-back">← <span>НАЗАД К ВЫБОРУ СТРИЖКИ</span></button>${title('Выберите необходимые услуги. Выбранные позиции будут добавлены к заказу.','Отметьте выполненные дополнительные услуги')}<div class="extras-layout"><div class="extra-grid">${extras.map(i=>{const q=state.selectedExtras[i.id]||0;return `<div class="extra-card ${q>0?'selected':''}" data-extra-card="${i.id}" tabindex="0"><img src="${i.image}" alt=""><span class="extra-copy"><b>${i.name}</b>${i.description?`<small>${i.description}</small>`:''}<em>${i.priceLabel||`${i.price} ₽`}</em></span><span class="counter"><button data-minus="${i.id}">−</button><strong>${q}</strong><button data-plus="${i.id}">＋</button></span></div>`}).join('')}</div><aside class="order-aside"><h3>Ваши услуги</h3><div class="order-items ${density}">${state.base?`<div><span>${state.base.name}</span><b>${fmt(state.base.price)} ₽</b></div>`:''}${items.map(i=>`<div><span>${i.name}${state.selectedExtras[i.id]>1?`<small> × ${state.selectedExtras[i.id]}</small>`:''}</span><b>${fmt(i.price*state.selectedExtras[i.id])} ₽</b></div>`).join('')}</div><footer><div><span>Всего услуг</span><b>${serviceCount()}</b></div><span>К оплате</span><strong>${fmt(total())} ₽</strong></footer></aside></div>`}
function phoneScreen(){return `<div class="phone-screen"><div class="phone-form">${title('Введите номер телефона','Получайте бонусы<br/>за каждое посещение')}<div class="phone-value ${state.phone?'filled':''}">${phoneText()}</div><label class="consent-row"><button type="button" class="consent-box ${state.consentAccepted?'checked':''}" data-action="toggle-consent" aria-pressed="${state.consentAccepted?'true':'false'}">${state.consentAccepted?'✓':''}</button><span class="consent-text">Я согласен с <button type="button" class="consent-link" data-action="policy">Политикой обработки персональных данных</button></span></label><div class="keypad phone-keypad">${'123456789'.split('').map(n=>`<button data-digit="${n}">${n}</button>`).join('')}<span class="keypad-empty" aria-hidden="true"></span><button data-digit="0">0</button><button class="key-delete" data-action="backspace" aria-label="Удалить цифру"><svg class="backspace-icon" viewBox="0 0 34 24" aria-hidden="true"><path d="M11 3.5h17.5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H11L3.5 12 11 3.5Z"/><path d="m17 8 7 8M24 8l-7 8"/></svg></button></div></div><div class="bonus-drawing"><img class="bonus-illustration-image" src="./reference/phone-bonus-illustration.png" alt="Бонусная карта Стрижём, монеты и блок +150 бонусов"></div></div>`}
function sourceIcon(type){const icons={
'yandex':`<img src="./reference/source-yandex.png" class="source-brand-image source-brand-image-yandex" alt="">`,
'2gis':`<img src="./reference/source-2gis.png" class="source-brand-image source-brand-image-2gis" alt="">`,
'google':`<img src="./reference/source-googlemaps.png" class="source-brand-image source-brand-image-google" alt="">`,
'flyer':`<svg viewBox="0 0 64 64" class="source-svg" aria-hidden="true"><rect x="13" y="10" width="38" height="44" rx="2.5" fill="none" stroke="#111" stroke-width="3"/><rect x="18" y="16" width="10" height="18" fill="#e30613"/><rect x="31" y="16" width="15" height="4" fill="#111" opacity=".9"/><rect x="31" y="24" width="15" height="4" fill="#111" opacity=".75"/><rect x="18" y="39" width="28" height="3.5" fill="#111" opacity=".85"/><rect x="18" y="46" width="28" height="3.5" fill="#111" opacity=".55"/></svg>`,
'recommend':`<svg viewBox="0 0 64 64" class="source-svg" aria-hidden="true"><path fill="#e30613" d="M24 15c0-4.4 3.6-8 8-8s8 3.6 8 8v1c0 4.4-3.6 8-8 8s-8-3.6-8-8z"/><circle cx="23" cy="36" r="7" fill="none" stroke="#111" stroke-width="3"/><circle cx="41" cy="36" r="7" fill="none" stroke="#111" stroke-width="3"/><path d="M11 52c1.2-6.6 6.2-11 12-11s10.8 4.4 12 11" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M29 52c1.2-6.6 6.2-11 12-11s10.8 4.4 12 11" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/></svg>`,
'site':`<svg viewBox="0 0 64 64" class="source-svg" aria-hidden="true"><circle cx="32" cy="32" r="19" fill="none" stroke="#111" stroke-width="3"/><path d="M13 32h38M32 13c5.6 5.2 9 11.4 9 19s-3.4 13.8-9 19M32 13c-5.6 5.2-9 11.4-9 19s3.4 13.8 9 19" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/></svg>`,
'social':`<img src="./reference/source-vk.png" class="source-brand-image source-brand-image-vk" alt="">`,
'walkin':`<svg viewBox="0 0 64 64" class="source-svg" aria-hidden="true"><circle cx="24" cy="14" r="5" fill="none" stroke="#111" stroke-width="3"/><path d="M23 20l-4 12 8 8M23 20l11 6 8-1M19 32l-8 7M27 33l-2 16M34 26l7 15" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path fill="#e30613" d="M48 17c-5.8 0-10.5 4.7-10.5 10.5 0 7.9 10.5 15.9 10.5 15.9S58.5 35.4 58.5 27.5C58.5 21.7 53.8 17 48 17Z"/><circle cx="48" cy="27.5" r="4" fill="#fff"/></svg>`,
'regular':`<svg viewBox="0 0 64 64" class="source-svg" aria-hidden="true"><rect x="14" y="13" width="34" height="38" rx="5" fill="#111"/><path d="M48 18l7 4v24l-7 4z" fill="#e30613"/><path d="M32 20.5l3.2 6.5 7.2 1-5.2 5.1 1.3 7.1-6.5-3.5-6.5 3.5 1.3-7.1-5.2-5.1 7.2-1z" fill="#fff"/><rect x="24" y="44" width="16" height="3" rx="1.5" fill="#fff"/></svg>`
};return icons[type]||''}
function sourceScreen(){return `<div class="source-screen"><div class="source-panel"><div class="source-copy"><h2>Откуда Вы узнали о нас?</h2><p>Выберите вариант, который подходит.<br>Это поможет нам стать лучше.</p></div><div class="source-grid">${sources.map((s,i)=>`<button class="source-card ${state.selectedSource===s.id?'selected':''}" data-source="${s.id}"><span class="source-card-icon">${sourceIcon(s.icon)}</span><b>${s.label}</b></button>`).join('')}</div></div><div class="source-drawing"><div class="source-illustration-wrap"><img class="source-illustration-image" src="./reference/source-art-custom-transparent.png" alt="Иллюстрация: лупа с логотипом Стрижём и иконки источников"></div></div></div>`}
function ratingScreen(){return `<div class="rating-screen"><div class="rating-layout"><div class="rating-left"><section class="rating-block rating-block-masters"><h3 class="rating-title">1. Выберите номер своего мастера</h3><div class="master-row">${masters.map(m=>`<button class="master-button ${state.master===m.display?'selected':''} ${!m.enabled?'disabled':''}" data-master="${m.display}" data-enabled="${m.enabled?'true':'false'}" ${m.enabled?'':'disabled'}>${m.display}</button>`).join('')}</div><div class="rating-helper"><span class="rating-helper-icon">i</span><span>Номер мастера указан на рабочем модуле или бейдже</span></div></section><div class="rating-divider"></div><section class="rating-block rating-block-stars"><h3 class="rating-title">2. Оцените работу мастера</h3><div class="star-row">${[1,2,3,4,5].map(n=>`<button class="star-button ${state.rating&&n<=state.rating?'selected':''}" data-rating="${n}" aria-label="Оценка ${n}">★</button>`).join('')}</div><div class="star-legend"><span>1 — плохо</span><span>5 — отлично</span></div></section></div><div class="rating-visual"><img class="rating-illustration-image" src="./reference/rating-art-clean.png" alt="Кресло мастера, зеркало и предметы интерьера"></div></div></div>`}
function serviceScreen(){const d=serviceData();const msgs=state.serviceMessages;const busy=a=>state.serviceBusy===a;const msgHtml=(scope)=>{const list=msgs.filter(m=>!scope||m.text.toLowerCase().includes(scope));return list.length?list.map(m=>`<div class="service-msg ${m.type}">${m.text}</div>`).join(''):'<div class="service-msg empty">&nbsp;</div>'};return `<div class="service-screen"><header class="service-header"><div class="service-brand"><img src="./brand/logo.svg" alt="СТРИЖЁМ"></div><div class="service-head-actions"><button class="service-btn outline" data-service-action="STRIZHEM_SERVICE_UPDATE_SOFT">ОБНОВИТЬ ПО</button><button class="service-btn outline danger-outline" data-service-action="STRIZHEM_SERVICE_REBOOT">ПЕРЕЗАГРУЗКА<br>ТЕРМИНАЛА</button><button class="service-btn danger" data-action="service-exit">ВЫХОД</button></div></header><div class="service-meta"><h1>Сервисный режим <span>(ver ${d.version})</span></h1><p>Терминал: ${d.terminalId} (${d.time})</p></div><section class="service-cash"><div class="service-cash-actions"><h2>Купюроприемник</h2><button class="service-control positive" data-service-action="STRIZHEM_BILL_START" ${busy('STRIZHEM_BILL_START')?'disabled':''}>${busy('STRIZHEM_BILL_START')?'Выполняется...':'Начать прием банкнот'}</button><button class="service-control danger-text" data-service-action="STRIZHEM_BILL_STOP" ${busy('STRIZHEM_BILL_STOP')?'disabled':''}>${busy('STRIZHEM_BILL_STOP')?'Выполняется...':'Завершить прием банкнот'}</button></div><div class="service-denoms"><table><thead><tr><th>Номинал</th><th>Количество на сдачу</th></tr></thead><tbody>${d.denoms.map(x=>`<tr><td>${x.value}</td><td>${x.count}</td></tr>`).join('')}</tbody></table></div><div class="service-totals"><p>Всего в терминале: <b>${fmt(d.total)} ₽</b></p><p>В инкассации: <b>${fmt(d.collection)} ₽</b></p></div></section><div class="service-message-band">${msgHtml('банкнот')}</div><section class="service-bottom"><div class="service-panel"><h2>Фискальный регистратор</h2><div class="service-grid two"><button data-service-action="STRIZHEM_FR_STATUS">Статус сост-ия ФР</button><button class="positive-text" data-service-action="STRIZHEM_FR_ZREPORT">Снять Z отчет</button><button data-service-action="STRIZHEM_FR_RESUME">Продолжение печати</button><button class="danger-text" data-service-action="STRIZHEM_FR_CLOSE_SHIFT">Закрыть смену</button><button class="danger-text" data-service-action="STRIZHEM_FR_CANCEL_RECEIPT">Отменить чек</button><button class="danger-text" data-service-action="STRIZHEM_FR_REBOOT">Перезагрузить ККТ</button></div></div><div class="service-panel pos"><h2>POS терминал</h2><div class="service-grid one"><button data-service-action="STRIZHEM_POS_CHECK">Проверка соединения</button><button class="positive-text" data-service-action="STRIZHEM_POS_RECONCILE">Сверка итогов</button></div></div></section><div class="service-message-band bottom">${msgHtml()}</div></div>`}
function paymentScreen(){
const items=selectedExtraItems();
const receiptRows=[];
if(state.base)receiptRows.push({name:serviceNameForReceipt(state.base),price:state.base.price});
items.forEach(i=>receiptRows.push({name:i.name,price:i.price*state.selectedExtras[i.id]}));
const density=receiptRows.length>=10?'dense':receiptRows.length>=6?'compact':'comfortable';
return `<div class="payment-screen">
  <div class="payment-left">
    <button class="home-link" data-action="home-from-payment"><span class="back-arrow">←</span><span>ГЛАВНЫЙ ЭКРАН</span></button>
    <div class="payment-title">
      <h2>Ваши услуги</h2>
      <p>Проверьте состав услуг перед оплатой.</p>
    </div>
    <section class="payment-receipt">
      <div class="receipt-dynamic ${density}">
        <div class="receipt-section-label">УСЛУГИ</div>
        ${receiptRows.slice(0,1).map(r=>`<div class="receipt-line"><span class="receipt-name">${r.name}</span><b class="receipt-price">${fmt(r.price)} ₽</b></div>`).join('')}
        ${items.length?`<div class="receipt-section-label section-gap">ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ</div>`:''}
        ${receiptRows.slice(1).map(r=>`<div class="receipt-line"><span class="receipt-name">${r.name}</span><b class="receipt-price">${fmt(r.price)} ₽</b></div>`).join('')}
      </div>
      <div class="receipt-summary">
        <div class="receipt-section-block">
          <div class="receipt-section-label">СУММА УСЛУГ</div>
          <div class="receipt-line receipt-line-strong"><span class="receipt-name">&nbsp;</span><b class="receipt-price">${fmt(total())} ₽</b></div>
        </div>
        <div class="receipt-section-block">
          <div class="receipt-section-label receipt-section-red">СКИДКИ</div>
          <div class="receipt-line"><span class="receipt-name">Скидка по акции</span><b class="receipt-price receipt-red">− ${fmt(receiptDiscount())} ₽</b></div>
        </div>
        <div class="receipt-section-block">
          <div class="receipt-section-label receipt-section-green">БОНУСЫ</div>
          <div class="receipt-line"><span class="receipt-name">Списание бонусов</span><b class="receipt-price receipt-green">− ${fmt(receiptBonusSpent())} ₽</b></div>
        </div>
      </div>
      <div class="receipt-total-zone" data-service-trigger="true">
        <div class="receipt-total-copy">
          <strong>ИТОГО К ОПЛАТЕ</strong>
          <span>Начислим бонусов: +${fmt(bonusAccrual())} ₽</span>
        </div>
        <div class="receipt-total-value">${fmt(payableTotal())} ₽</div>
      </div>
    </section>
  </div>
  <div class="payment-right">
    <div class="promo-block">
      <div class="promo-icon">%</div>
      <div class="promo-fieldset">
        <label class="promo-label">ПРОМОКОД</label>
        <input id="promoCode" value="${state.promoCode}" placeholder="Введите промокод" readonly data-action="open-promo-modal">
      </div>
      <button class="promo-apply" type="button" data-action="open-promo-modal">ПРИМЕНИТЬ</button>
    </div>
    <div class="bonus-block">
      <div class="bonus-status-icon">★</div>
      <div class="bonus-copy"><strong>СПИСАТЬ БОНУСЫ</strong><span>Доступно: 235 ₽</span></div>
      <button class="bonus-toggle ${state.useBonuses?'on':''}" data-action="toggle-bonus" aria-pressed="${state.useBonuses?'true':'false'}"><i></i></button>
      <button class="bonus-change" type="button" data-action="open-birth-modal">ИЗМЕНИТЬ</button>
    </div>
    <div class="payment-methods-block">
      <h3>ВЫБЕРИТЕ СПОСОБ ОПЛАТЫ</h3>
      <div class="payment-method-list">
        <button class="payment-method-card ${state.paymentMethod==='card'?'selected':''}" data-pay="card"><img src="./payment-icons/card.png" alt=""><span class="payment-method-copy"><b>Банковская карта</b><small>VISA, MasterCard, МИР</small></span><em>›</em></button>
        <button class="payment-method-card ${state.paymentMethod==='sbp'?'selected':''}" data-pay="sbp"><img src="./payment-icons/sbp-v2.png" alt=""><span class="payment-method-copy"><b>СБП</b><small>Оплата по QR-коду</small></span><em>›</em></button>
        <button class="payment-method-card ${state.paymentMethod==='cash'?'selected':''}" data-pay="cash"><img src="./payment-icons/cash-v2.png" alt=""><span class="payment-method-copy"><b>Наличные</b><small>Оплата наличными</small></span><em>›</em></button>
      </div>
    </div>
    <div class="receipt-delivery">
      <h3>ПОЛУЧЕНИЕ ЭЛЕКТРОННОГО ЧЕКА</h3>
      <p>Выберите способ получения чека.</p>
      <button type="button" class="receipt-email-choice ${state.receiptTo==='email'?'selected':''}" data-action="open-email-modal">
        <div class="receipt-choice-main">
          <span class="receipt-choice-icon mail"></span>
          <span class="receipt-choice-copy"><b>Отправить на e-mail</b><small>${state.receiptEmail||'Введите e-mail'}</small></span>
        </div>
        <span class="receipt-radio ${state.receiptTo==='email'?'selected':''}" aria-hidden="true"></span>
      </button>
      <button type="button" class="receipt-no-check ${state.receiptTo==='none'?'selected':''}" data-action="receipt-none">
        <span class="receipt-no-check-icon">×</span>
        <span><b>ЧЕК НЕ НУЖЕН</b><small>Продолжить без электронного чека</small></span>
        <span class="receipt-radio ${state.receiptTo==='none'?'selected':''}" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</div>`}
function success(){return `<div class="success-screen">
  <section class="success-head">
    <div class="success-indicator"><span>✓</span><i class="sdec s1"></i><i class="sdec s2"></i><i class="sdec s3"></i><i class="sdec s4"></i></div>
    <h1>Оплата прошла успешно!</h1>
    <p>Спасибо, что выбираете СТРИЖЁМ</p>
  </section>

  <section class="success-qr-grid">
    <article class="success-qr-card">
      <h3>Электронный чек</h3>
      <p>Отсканируйте QR-код, чтобы<br>получить чек</p>
      <i class="fake-qr success-qr"></i>
      <div class="qr-note"><span class="info-circle">i</span><small>Чек также отправлен на<br>указанный e-mail</small></div>
    </article>
    <article class="success-qr-card">
      <h3>Чаевые мастеру</h3>
      <p>Если вам всё понравилось,<br>оставьте чаевые мастеру</p>
      <i class="fake-qr alt success-qr"></i>
      <div class="qr-note tip-note"><span class="heart-icon">♡</span><small>Спасибо за вашу<br>поддержку!</small></div>
    </article>
  </section>

  <section class="success-info-panel">
    <div class="success-info-col success-info-left">
      <div class="mini-chair-art"><img src="./reference/rating-art-clean.png" alt=""></div>
      <div class="success-info-copy"><b>Покажите чек мастеру.</b><span>Спасибо за визит.<br>Ждём вас снова.</span></div>
    </div>
    <div class="success-info-divider"></div>
    <div class="success-info-col success-info-right">
      <div class="review-icon"><span>★</span></div>
      <div class="success-info-copy"><b>Будем благодарны<br>за отзыв о своем визите!</b><span>Ваше мнение помогает<br>нам становиться лучше.</span></div>
    </div>
  </section>

  <div class="success-bottom">
    ${steps()}
    <button class="finish-button" data-action="finish">ЗАВЕРШИТЬ <span>→</span></button>
  </div>
</div>`}
function footer(){
if(['home','success'].includes(state.screen))return '';
let next='';
if(state.screen==='cosmetics')next=`<button ${cosmeticsCount()===0?'disabled':''} class="next cosmetics-next" data-action="next-cosmetics">ДАЛЕЕ <span>→</span></button>`;
else if(state.screen==='promos')next=`<button ${!state.promotionSelection?'disabled':''} class="next promotions-next" data-action="next-promotion">ДАЛЕЕ <span>→</span></button>`;
else if(state.screen==='extras')next=`<button ${state.entry==='extras'&&serviceCount()===0?'disabled':''} class="next" data-action="next-extras">ПРОДОЛЖИТЬ →</button>`;
else if(state.screen==='phone')next=`<button class="next" data-action="next-phone">ПРОДОЛЖИТЬ →</button>`;
else if(state.screen==='rating')next=`<div class="next-wrap"><button ${!state.master||!state.rating?'disabled':''} class="next" data-action="next-rating">ПРОДОЛЖИТЬ →</button>${state.master&&state.rating?'':`<span class="next-note">Выберите номер мастера и поставьте оценку</span>`}</div>`;
else if(state.screen==='payment')next=`<button ${!state.paymentMethod?'disabled':''} class="next pay-next" data-action="next-payment">ОПЛАТИТЬ <span>→</span></button>`;
else next='<span class="footer-space"></span>';
return `<footer class="footer"><button class="back" data-action="back"><span class="back-arrow">←</span><span class="back-label">НАЗАД</span></button>${steps()}${next}</footer>`}
function modal(){
if(!state.modal)return '';
if(state.modal==='birthdate'){
  const parts=birthParts();
  const hasError=!!state.birthError;
  const canOk=state.birthDraft.length===8&&!state.birthValidating;
  const slot=(ch,ph,i)=>`<span class="birth-slot ${i<state.birthDraft.length?'filled':''}">${i<state.birthDraft.length?ch:ph}</span>`;
  return `<div class="overlay promo-overlay birth-overlay"><div class="modal birth-modal" role="dialog" aria-modal="true" aria-labelledby="birthModalTitle"><div class="birth-modal-header"><img src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></div><h2 id="birthModalTitle" class="birth-modal-title">ВВЕДИТЕ ДАТУ РОЖДЕНИЯ:</h2><div class="birth-date-row">${slot(parts.day[0],'Д',0)}${slot(parts.day[1],'Д',1)}<b>/</b>${slot(parts.month[0],'М',2)}${slot(parts.month[1],'М',3)}<b>/</b>${slot(parts.year[0],'Г',4)}${slot(parts.year[1],'Г',5)}${slot(parts.year[2],'Г',6)}${slot(parts.year[3],'Г',7)}</div><div class="birth-error-slot ${hasError?'visible':''}">${hasError?`<span class="birth-error-icon">!</span><span>${state.birthError}</span>`:'<span class="birth-error-placeholder" aria-hidden="true"></span>'}</div><div class="birth-keypad">${'123456789'.split('').map(n=>`<button class="birth-key" type="button" data-birth-key="${n}">${n}</button>`).join('')}<button class="birth-key" type="button" data-action="birth-clear">C</button><button class="birth-key" type="button" data-birth-key="0">0</button><button class="birth-key" type="button" data-action="birth-backspace">←</button></div><div class="birth-actions"><button class="birth-cancel" type="button" data-action="cancel-birth-modal">ОТМЕНА</button><button class="birth-ok" type="button" data-action="confirm-birth" ${canOk?'':'disabled'}>${state.birthValidating?'ПРОВЕРКА...':'OK'}</button></div></div></div>`;
}
if(state.modal==='email'){
  const hasError=!!state.emailError;
  const canOk=!!state.emailDraft && !state.emailSaving;
  const letters=(s)=>s.split('').map(ch=>`<button type="button" class="email-key" data-email-key="${ch}">${state.emailShift?ch.toUpperCase():ch}</button>`).join('');
  return `<div class="overlay promo-overlay email-overlay"><div class="modal email-modal" role="dialog" aria-modal="true" aria-labelledby="emailModalTitle"><div class="email-modal-header"><img src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></div><h2 id="emailModalTitle" class="email-modal-title">ВВЕДИТЕ E-MAIL</h2><div class="email-input-wrap ${hasError?'error':''}"><span class="email-input-value ${state.emailDraft?'filled':''}">${state.emailDraft||'Введите e-mail'}</span><button type="button" class="email-clear" data-action="email-clear" aria-label="Очистить">×</button></div><div class="email-error-slot ${hasError?'visible':''}">${hasError?`<span class="email-error-icon">!</span><span>${state.emailError}</span>`:'<span class="email-error-placeholder" aria-hidden="true"></span>'}</div><div class="email-keyboard"><div class="email-row email-row-12">${'1234567890'.split('').map(ch=>`<button type="button" class="email-key" data-email-key="${ch}">${ch}</button>`).join('')}<button type="button" class="email-key" data-email-key="-">-</button><button type="button" class="email-key" data-email-key="_">_</button></div><div class="email-row email-row-12">${letters('qwertyuiop')}<button type="button" class="email-key" data-email-key="@">@</button><button type="button" class="email-key" data-email-key=".">.</button></div><div class="email-row email-row-12"><button type="button" class="email-key email-shift ${state.emailShift?'active':''}" data-action="email-shift">⇧</button>${letters('asdfghjkl')}<button type="button" class="email-key" data-email-key=";">;</button><button type="button" class="email-key email-backspace" data-action="email-backspace">⌫</button></div><div class="email-row email-row-10"><button type="button" class="email-key email-quick" data-email-key=".com">.com</button>${letters('zxcvbnm')}<button type="button" class="email-key" data-email-key=",">,</button><button type="button" class="email-key email-quick wide" data-email-key="@gmail.com">@gmail.com</button></div><div class="email-row email-row-bottom"><button type="button" class="email-key email-muted" data-action="email-numbers">123</button><button type="button" class="email-key email-space" disabled>ПРОБЕЛ</button><button type="button" class="email-key email-muted" data-action="email-backspace">УДАЛИТЬ</button></div></div><div class="email-actions"><button type="button" class="email-cancel" data-action="cancel-email-modal">ОТМЕНА</button><button type="button" class="email-ok" data-action="confirm-email" ${canOk?'':'disabled'}>${state.emailSaving?'СОХРАНЕНИЕ...':'OK'}</button></div></div></div>`;
}
if(state.modal==='promo'){
  const hasError=!!state.promoError;
  const canApply=!!state.promoDraft && !state.promoValidating;
  return `<div class="overlay promo-overlay"><div class="modal promo-modal" role="dialog" aria-modal="true" aria-labelledby="promoModalTitle"><button class="promo-modal-close" data-action="close-promo-modal" aria-label="Закрыть">×</button><div class="promo-modal-header"><img src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></div><h2 id="promoModalTitle" class="promo-modal-title">ВВЕДИТЕ ПРОМОКОД</h2><div class="promo-modal-input-wrap ${hasError?'error':''}"><input class="promo-modal-input" type="text" inputmode="none" readonly value="${state.promoDraft}" placeholder=""></div><div class="promo-modal-error-slot ${hasError?'visible':''}">${hasError?`<span class="promo-modal-error-icon">!</span><span class="promo-modal-error-text">${state.promoError}</span>`:'<span class="promo-modal-error-placeholder" aria-hidden="true"></span>'}</div><div class="promo-keypad">${'123456789'.split('').map(n=>`<button class="promo-key promo-key-digit" type="button" data-promo-key="${n}">${n}</button>`).join('')}<button class="promo-key promo-key-alt" type="button" data-action="promo-clear">C</button><button class="promo-key promo-key-alt" type="button" data-promo-key="0">0</button><button class="promo-key promo-key-alt" type="button" data-action="promo-backspace">&lt;</button></div><div class="promo-modal-actions"><button class="promo-modal-cancel" type="button" data-action="cancel-promo-modal">ОТМЕНА</button><button class="promo-modal-apply ${canApply?'ready':''}" type="button" data-action="apply-promo" ${canApply?'':'disabled'}>${state.promoValidating?'ПРОВЕРКА...':'ПРИМЕНИТЬ'}</button></div></div></div>`;
}
let body='';
if(state.modal==='policy'){const hasPolicy=policyContent&&policyContent.html;body=hasPolicy?`<div class="policy-modal-header"><img src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></div><div class="policy-scroll-frame"><div class="legal legal-scroll" id="policyScrollArea">${policyContent.html}</div></div><div class="policy-modal-footer"><button class="modal-action" data-action="close-modal">ЗАКРЫТЬ</button></div>`:`<div class="policy-modal-header"><img src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></div><div class="policy-scroll-frame"><div class="legal legal-scroll legal-error"><p>Не удалось загрузить документ.</p></div></div><div class="policy-modal-footer"><button class="modal-action" data-action="close-modal">ЗАКРЫТЬ</button></div>`;}
else if(state.modal==='service-pin'){
  const hasError=!!state.servicePinError;
  const canOk=!!state.servicePin && !state.servicePinValidating;
  return `<div class="overlay promo-overlay service-pin-overlay"><div class="modal service-pin-modal" role="dialog" aria-modal="true" aria-labelledby="servicePinTitle"><div class="service-pin-header"><img src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></div><div class="service-pin-warning">ВХОД В СЕРВИСНЫЙ РЕЖИМ</div><h2 id="servicePinTitle" class="service-pin-title">ВВЕДИТЕ PIN:</h2><div class="service-pin-field">${state.servicePin?'<span class="service-pin-bullets">'+('•'.repeat(state.servicePin.length))+'</span>':''}</div><div class="service-pin-error-slot ${hasError?'visible':''}">${hasError?`<span class="service-pin-error-icon">!</span><span>${state.servicePinError}</span>`:'<span class="service-pin-error-placeholder" aria-hidden="true"></span>'}</div><div class="service-pin-keypad">${'123456789'.split('').map(n=>`<button class="service-pin-key" type="button" data-service-pin-key="${n}">${n}</button>`).join('')}<button class="service-pin-key" type="button" data-service-pin-key="0">0</button><button class="service-pin-key service-pin-delete" type="button" data-action="service-pin-delete">СТЕРЕТЬ</button></div><div class="service-pin-actions"><button class="service-pin-cancel" type="button" data-action="cancel-service-pin">ОТМЕНА</button><button class="service-pin-ok" type="button" data-action="confirm-service-pin" ${canOk?'':'disabled'}>${state.servicePinValidating?'ПРОВЕРКА...':'OK'}</button></div></div></div>`;
}
return `<div class="overlay"><div class="modal ${state.modal==='policy'?'policy-modal':''}"><button class="modal-close" data-action="close-modal">×</button>${body}</div></div>`
}
function content(){return state.screen==='home'?home():state.screen==='cosmetics'?cosmeticsScreen():state.screen==='haircuts'?haircutScreen():state.screen==='promos'?promos():state.screen==='extras'?extrasScreen():state.screen==='phone'?phoneScreen():state.screen==='source'?sourceScreen():state.screen==='rating'?ratingScreen():state.screen==='payment'?paymentScreen():state.screen==='service'?serviceScreen():success()}
function render(){const s=state.scale||1;if(state.screen==='service'){app.innerHTML=`<main class="stage"><div class="terminal-shell" style="width:${1024*s}px;height:${768*s}px"><section class="terminal screen-service" style="transform:scale(${s})">${serviceScreen()}</section></div></main>`;return;}app.innerHTML=`<main class="stage"><div class="terminal-shell" style="width:${1024*s}px;height:${768*s}px"><section class="terminal screen-${state.screen}" style="transform:scale(${s})"><header class="topbar"><button class="brand" data-action="brand"><img class="brand-logo" src="./brand/logo.svg" alt="СТРИЖЁМ — мужские стрижки"></button></header><div class="content">${content()}</div>${footer()}${modal()}</section></div></main>`;}
app.addEventListener('dblclick',e=>{if(e.target.closest('[data-service-trigger]')){openServicePinModal();}});
app.addEventListener('click',e=>{const t=e.target;const a=t.closest('[data-action]')?.dataset.action;if(a==='service-exit'){if(typeof window.STRIZHEM_SERVICE_EXIT==='function')window.STRIZHEM_SERVICE_EXIT();state.serviceAuthed=false;state.screen='payment';render();return}const svc=t.closest('[data-service-action]');if(svc){const action=svc.dataset.serviceAction;const label=svc.textContent.trim().replace(/\s+/g,' ');if(/REBOOT|CLOSE_SHIFT|CANCEL_RECEIPT/.test(action)){if(!window.confirm('Подтвердить действие: '+label+'?'))return;}runServiceAction(action,label);return}if(a==='haircuts'){state.flow='services';state.screen='haircuts';render();return}if(a==='extras-home'){state.flow='services';state.entry='extras';state.screen='extras';render();return}if(a==='promos'){state.flow='services';state.promotionSelection=null;state.screen='promos';render();return}if(a==='next-promotion'){if(!state.promotionSelection)return;state.base=state.promotionSelection==='senior'?{id:'senior',name:'Пенсионер',price:400}:{id:'father-son',name:'Отец и сын',price:1400};state.entry='promo';state.screen='extras';render();return}if(a==='cosmetics'){state.flow='cosmetics';state.screen='cosmetics';render();return}if(a==='next-cosmetics'){if(cosmeticsCount()===0)return;state.screen='phone';render();return}if(a==='cosmetics-scroll-up'){document.getElementById('cosmeticsCatalog')?.scrollBy({top:-260,behavior:'smooth'});return}if(a==='cosmetics-scroll-down'){document.getElementById('cosmeticsCatalog')?.scrollBy({top:260,behavior:'smooth'});return}if(a==='upper-back'){goBackFromExtras();return}if(a==='policy'){state.modal='policy';render();return}if(a==='close-modal'){state.modal=null;render();return}if(a==='cancel-service-pin'){closeServicePinModal();return}if(a==='service-pin-delete'){state.servicePin=state.servicePin.slice(0,-1);state.servicePinError='';render();return}if(a==='confirm-service-pin'){if(!state.servicePin||state.servicePinValidating)return;state.servicePinValidating=true;state.servicePinError='';render();verifyServiceModePin(state.servicePin).then(result=>{if(result&&result.ok){state.servicePinValidating=false;state.servicePinError='';state.servicePin='';state.modal=null;state.serviceAuthed=true;state.screen='service';state.serviceMessages=[];render();if(typeof window.STRIZHEM_OPEN_SERVICE_MODE==='function')window.STRIZHEM_OPEN_SERVICE_MODE(result);}else{state.servicePinValidating=false;state.servicePinError=(result&&result.message)||'Неверный PIN. Попробуйте ещё раз.';render();}});return}if(a==='open-email-modal'){openEmailModal();return}if(a==='cancel-email-modal'){closeEmailModal();return}if(a==='email-clear'){state.emailDraft='';state.emailError='';render();return}if(a==='email-backspace'){state.emailDraft=state.emailDraft.slice(0,-1);state.emailError='';render();return}if(a==='email-shift'){state.emailShift=!state.emailShift;render();return}if(a==='receipt-none'){state.receiptTo='none';render();return}if(a==='confirm-email'){if(state.emailSaving)return;const checked=emailLooksValid(state.emailDraft);if(!checked.ok){state.emailError=checked.message;render();return}state.emailSaving=true;state.emailError='';render();saveReceiptEmail(checked.value).then(result=>{if(result&&result.ok){state.receiptEmail=checked.value;state.receiptTo='email';state.emailDraft='';state.emailError='';state.emailSaving=false;state.emailShift=false;state.modal=null;render();}else{state.emailSaving=false;state.emailError=(result&&result.message)||'Не удалось сохранить e-mail. Попробуйте ещё раз.';render();}});return}if(a==='open-promo-modal'){openPromoModal();return}if(a==='close-promo-modal'||a==='cancel-promo-modal'){closePromoModal();return}if(a==='apply-promo'){if(!state.promoDraft||state.promoValidating)return;state.promoValidating=true;render();validatePromoCode(state.promoDraft).then(result=>{if(result.ok){state.promoCode=result.code;state.modal=null;state.promoDraft='';state.promoError='';state.promoValidating=false;render();}else{state.promoValidating=false;state.promoError=result.message||'Промокод не найден или недействителен';render();}});return}if(a==='promo-clear'){state.promoDraft='';state.promoError='';render();return}if(a==='promo-backspace'){state.promoDraft=state.promoDraft.slice(0,-1);state.promoError='';render();return}if(a==='toggle-consent'){state.consentAccepted=!state.consentAccepted;render();return}if(a==='backspace'){state.phone=state.phone.slice(0,-1);render();return}if(a==='toggle-bonus'){if(state.useBonuses&&state.bonusVerified){state.useBonuses=false;state.bonusVerified=false;render();return}openBirthModal();return}if(a==='open-birth-modal'){openBirthModal();return}if(a==='cancel-birth-modal'){closeBirthModal();return}if(a==='birth-clear'){state.birthDraft='';state.birthError='';render();return}if(a==='birth-backspace'){state.birthDraft=state.birthDraft.slice(0,-1);state.birthError='';render();return}if(a==='confirm-birth'){if(state.birthValidating)return;const err=validateBirthLocal(state.birthDraft);if(err){state.birthError=err;render();return}state.birthValidating=true;state.birthError='';render();verifyBirthDate(state.birthDraft).then(result=>{if(result.ok){state.birthValidating=false;state.birthError='';state.birthDraft='';state.modal=null;state.bonusVerified=true;state.useBonuses=true;render();}else{state.birthValidating=false;state.bonusVerified=false;state.useBonuses=false;state.birthError=result.message||'Дата рождения не совпадает с данными клиента.';render();}});return}if(a==='home-from-payment'){if(window.confirm('Вернуться на главный экран? Текущий заказ будет сброшен.'))goHome();return}if(a==='next-payment'){if(state.paymentMethod){state.screen='success';render()}return}if(a==='next-extras'){if(state.entry!=='extras'||serviceCount()>0){state.screen='phone';render()}return}if(a==='next-phone'){nextPhoneScreen();return}if(a==='next-rating'){if(state.master&&state.rating){state.screen='payment';render()}return}if(a==='finish'){goHome();return}if(a==='back'){if(state.screen==='haircuts'||state.screen==='promos'||state.screen==='cosmetics')state.screen='home';else if(state.screen==='extras')return goBackFromExtras();else if(state.screen==='phone')state.screen=state.flow==='cosmetics'?'cosmetics':'extras';else if(state.screen==='source')state.screen='phone';else if(state.screen==='rating')state.screen=state.selectedSource?'source':'phone';else state.screen='rating';render();return}
const hc=t.closest('[data-haircut]');if(hc){state.base=haircuts.find(x=>x.id===hc.dataset.haircut);state.entry='haircut';render();setTimeout(()=>{state.screen='extras';render()},200);return}
const pr=t.closest('[data-promotion]');if(pr){state.promotionSelection=pr.dataset.promotion;render();return}
const plus=t.closest('[data-plus]');if(plus){changeExtra(plus.dataset.plus,1);return}const minus=t.closest('[data-minus]');if(minus){changeExtra(minus.dataset.minus,-1);return}const card=t.closest('[data-extra-card]');if(card){const id=card.dataset.extraCard;if((state.selectedExtras[id]||0)===0)changeExtra(id,1);return}
const cc=t.closest('[data-cosmetics-category]');if(cc){state.cosmeticsCategory=cc.dataset.cosmeticsCategory;render();return}const cm=t.closest('[data-cosmetics-manufacturer]');if(cm){state.cosmeticsManufacturer=cm.dataset.cosmeticsManufacturer;render();return}const cp=t.closest('[data-cosmetics-plus]');if(cp){const id=cp.dataset.cosmeticsPlus;state.cosmeticsCart[id]=(state.cosmeticsCart[id]||0)+1;render();return}const cmin=t.closest('[data-cosmetics-minus]');if(cmin){const id=cmin.dataset.cosmeticsMinus;state.cosmeticsCart[id]=Math.max(0,(state.cosmeticsCart[id]||0)-1);render();return}const digit=t.closest('[data-digit]');if(digit){if(state.phone.length<10)state.phone+=digit.dataset.digit;render();return}const emailKey=t.closest('[data-email-key]');if(emailKey){let ch=emailKey.dataset.emailKey||'';if(ch.length===1&&/[a-z]/i.test(ch)&&state.emailShift)ch=ch.toUpperCase();state.emailDraft+=ch;state.emailError='';render();return}const promoDigit=t.closest('[data-promo-key]');if(promoDigit){if(state.promoDraft.length<12)state.promoDraft+=promoDigit.dataset.promoKey;state.promoError='';render();return}const birthDigit=t.closest('[data-birth-key]');if(birthDigit){if(state.birthDraft.length<8)state.birthDraft+=birthDigit.dataset.birthKey;state.birthError='';render();return}const serviceDigit=t.closest('[data-service-pin-key]');if(serviceDigit){state.servicePin+=serviceDigit.dataset.servicePinKey;state.servicePinError='';render();return}const src=t.closest('[data-source]');if(src){state.selectedSource=src.dataset.source;render();setTimeout(()=>{state.screen='rating';render();},180);return}const m=t.closest('[data-master]');if(m){if(m.dataset.enabled!=='true')return;const selected=masters.find(x=>x.display===Number(m.dataset.master));state.master=selected?.display||null;state.masterBackendId=selected?.id||null;render();return}const r=t.closest('[data-rating]');if(r){state.rating=Number(r.dataset.rating);render();return}const pay=t.closest('[data-pay]');if(pay){state.paymentMethod=pay.dataset.pay;render();return}});
let __serviceTapAt=0;
app.addEventListener('pointerup',e=>{const trigger=e.target.closest('[data-service-trigger]');if(!trigger)return;const now=Date.now();if(now-__serviceTapAt<360){__serviceTapAt=0;openServicePinModal();}else{__serviceTapAt=now;}});
app.addEventListener('input',e=>{if(e.target.id==='promoCode')state.promoCode=e.target.value.toUpperCase();});
fit();

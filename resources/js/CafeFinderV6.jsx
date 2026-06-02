import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

/* ── Google Fonts ── */
(() => {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `
    :root {
      --base:#F8F7F4;--surface:#FFFFFF;--surface2:#FAFAF8;
      --teal:#2ABFBF;--ink:#1A1A1A;--ink2:#444;
      --muted:#888;--rule:#E0DDD8;--card-shadow:0 1px 4px rgba(26,26,26,.07);
      --tip-bg:#FFFDE7;--tip-bd:#FBC02D;
      --chip-bg:#FFFFFF;--chip-border:#E0DDD8;--chip-color:#1A1A1A;
    }
    [data-theme="dark"]{
      --base:#0F1117;--surface:#1A1D27;--surface2:#22263A;
      --teal:#2ADADA;--ink:#F0EEE8;--ink2:#BBB;
      --muted:#666;--rule:#2E3145;--card-shadow:0 2px 12px rgba(0,0,0,.35);
      --tip-bg:#2A2510;--tip-bd:#8A6A00;
      --chip-bg:#1A1D27;--chip-border:#2E3145;--chip-color:#CCC;
    }
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:var(--base);transition:background .3s;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    .fade-up{animation:fadeUp .4s ease both;}
    .heart-pop{animation:pop .25s ease;}
    .slide-in{animation:slideIn .28s ease both;}
    .chip:hover{border-color:var(--teal)!important;color:var(--teal)!important;}
    .chip.on{background:var(--ink)!important;color:var(--base)!important;border-color:var(--ink)!important;}
    input:focus,textarea:focus{outline:none;border-color:var(--teal)!important;}
    .share-btn {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--rule);
      border-radius: 8px;
      cursor: pointer;
      font-family: Inter, "Noto Sans JP", sans-serif;
      font-size: 11px;
      font-weight: 600;
      background: var(--surface2);
      color: var(--ink2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all .15s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      text-decoration: none;
    }
    .share-btn:hover {
      background: var(--surface);
      border-color: var(--teal);
      color: var(--teal);
    }
  `;
  document.head.appendChild(s);
})();

/* ── i18n ── */
const T = {
  ja:{
    vol:"VOL.08 / FINAL EDITION",
    listView:"リスト",mapView:"マップ",saved:"保存済み",
    openNow:<><i className="fa-regular fa-clock"></i> 今すぐ開いてる</>,searchPlaceholder:"カフェ名・キーワードで検索...",
    cafesFound:"件のカフェ",savedOnly:"保存済みのみ",openOnly:"営業中",
    noResult:"条件に合うカフェが見つかりませんでした。",
    mapNote:"ドットをクリックすると詳細を表示します",compiledBy:"COMPILED BY",
    footerNote:"IT PARK CAFE FINDER · VOL.08 · CEBU CITY 🇵🇭",
    wifiLabel:"Wi-Fi",outletLabel:"電源",hoursLabel:"時間",priceLabel:"予算",
    mapsLink:<><i className="fa-solid fa-location-dot"></i> Google Maps で開く</>,saveFav:<><i className="fa-regular fa-heart"></i> マイリストに保存</>,savedFav:<><i className="fa-solid fa-heart"></i> 保存済み</>,
    reviewTitle:"レビューを投稿",reviewSubmit:"投稿する",reviewDone:<><i className="fa-solid fa-check"></i> 投稿しました</>,
    reviewSummary:"件のレビュー",reviewLoading:"読み込み中...",
    reviewEdit:"編集",reviewDelete:"削除",reviewCancel:"キャンセル",reviewSave:"保存",
    reviewDeleteConfirm:"このレビューを削除しますか？",reviewDeleteDone:<><i className="fa-solid fa-check"></i> 削除しました</>,
    reviewUpdateDone:<><i className="fa-solid fa-check"></i> 更新しました</>,
    ratingLabels:["Wi-Fi速度","電源の充実","静粛性","コスパ","雰囲気"],
    crowdLabel:"混雑度",crowdOpts:["空いてる","ふつう","混んでる"],
    tagLabel:"一言タグ（複数選択可）",
    reviewTags:["作業向き","映える","コスパ◎","静か","おすすめメニューあり","深夜OK","冷房強め","店員さん親切"],
    commentLabel:"コメント",
    commentPlaceholder:"カフェの雰囲気やおすすめポイントなどを自由に書いてください（任意）",
    allPhotos:"全ての写真",closeLb:"✕ 閉じる",
    quizBtn:<><i className="fa-solid fa-mug-hot"></i> カフェを探す</>,quizTitle:"カフェを探す",
    quizSubtitle:"3問に答えるだけで最適なカフェを提案します",
    quizNext:"次へ →",quizBack:"← 戻る",quizResult:"診断結果",
    quizRetry:"もう一度診断",quizGo:"このカフェを見る",
    shareBtn:<><i className="fa-solid fa-link"></i> URLをシェア</>,shareCopied:<><i className="fa-solid fa-check"></i> コピー完了</>,
    darkOn:<><i className="fa-solid fa-moon"></i></>,darkOff:<><i className="fa-solid fa-sun"></i></>,openBadge:<><i className="fa-solid fa-circle"></i> OPEN</>,closedBadge:<><i className="fa-regular fa-circle"></i> CLOSED</>,
  },
  en:{
    vol:"VOL.08 / FINAL EDITION",
    listView:"List",mapView:"Map",saved:"Saved",
    openNow:<><i className="fa-regular fa-clock"></i> Open Now</>,searchPlaceholder:"Search cafes...",
    cafesFound:"cafes found",savedOnly:"Saved only",openOnly:"Open now",
    noResult:"No cafes match your filters.",
    mapNote:"Click a dot to view details",compiledBy:"COMPILED BY",
    footerNote:"IT PARK CAFE FINDER · VOL.08 · CEBU CITY 🇵🇭",
    wifiLabel:"Wi-Fi",outletLabel:"Power",hoursLabel:"Hours",priceLabel:"Price",
    mapsLink:<><i className="fa-solid fa-location-dot"></i> Open in Google Maps</>,saveFav:<><i className="fa-regular fa-heart"></i> Save to My List</>,savedFav:<><i className="fa-solid fa-heart"></i> Saved</>,
    reviewTitle:"Write a Review",reviewSubmit:"Submit",reviewDone:<><i className="fa-solid fa-check"></i> Submitted!</>,
    reviewSummary:"reviews",reviewLoading:"Loading...",
    reviewEdit:"Edit",reviewDelete:"Delete",reviewCancel:"Cancel",reviewSave:"Save",
    reviewDeleteConfirm:"Are you sure you want to delete this review?",
    reviewDeleteDone:<><i className="fa-solid fa-check"></i> Deleted!</>,reviewUpdateDone:<><i className="fa-solid fa-check"></i> Updated!</>,
    ratingLabels:["Wi-Fi Speed","Power Outlets","Noise Level","Value","Ambiance"],
    crowdLabel:"Crowd Level",crowdOpts:["Empty","Moderate","Busy"],
    tagLabel:"Quick Tags (select all that apply)",
    reviewTags:["Work-friendly","Instagrammable","Great value","Quiet","Must-try menu","Open late","Cold AC","Friendly staff"],
    commentLabel:"Comment",
    commentPlaceholder:"Write your detailed review about the cafe... (optional)",
    allPhotos:"All Photos",closeLb:"✕ Close",
    quizBtn:<><i className="fa-solid fa-mug-hot"></i> Find My Cafe</>,quizTitle:"Find My Cafe",
    quizSubtitle:"Answer 3 questions to find your perfect spot",
    quizNext:"Next →",quizBack:"← Back",quizResult:"Your Match",
    quizRetry:"Try Again",quizGo:"View This Cafe",
    shareBtn:<><i className="fa-solid fa-link"></i> Share URL</>,shareCopied:<><i className="fa-solid fa-check"></i> Copied!</>,
    darkOn:<><i className="fa-solid fa-moon"></i></>,darkOff:<><i className="fa-solid fa-sun"></i></>,openBadge:<><i className="fa-solid fa-circle"></i> OPEN</>,closedBadge:<><i className="fa-regular fa-circle"></i> CLOSED</>,
  },
};

/* ── Data ── */
const PALETTES=[
  ["#C4A882","#A8836A","#8B6352"],["#7A92B0","#5B7A9C","#3E5F82"],
  ["#6B7E4A","#556335","#3F4A25"],["#B87040","#9A5528","#7D3C14"],
  ["#5A8A80","#3F7068","#285650"],["#7A6AAA","#5E528C","#453A6E"],
  ["#4A80A0","#326680","#1D4D62"],["#505050","#3A3A3A","#262626"],
];
const PLJ=[
  ["店内の雰囲気","看板メニュー","テラス席"],["自然光の窓際","シグネチャードリンク","カウンター"],
  ["朝の焼きたて","ポアオーバー","テラスの朝"],["深夜の店内","バラコブレンド","フィリピン産豆"],
  ["静かな2階席","ドリップコーヒー","穴場な外観"],["広々としたフロア","プレッツェル","グループ席"],
  ["テラスの夜","シグネチャーラテ","メンバーカード"],["本格的な静寂","スペシャルティ豆","ブラック一択"],
];
const PLE=[
  ["Interior","Signature Menu","Terrace"],["Natural Light","Signature Drink","Counter"],
  ["Fresh Baked","Pour Over","Morning Terrace"],["Late Night","Barako Blend","Local Beans"],
  ["Quiet 2F","Drip Coffee","Hidden Exterior"],["Spacious Floor","Pretzels","Group Seating"],
  ["Night Terrace","Signature Latte","Member Card"],["Serious Silence","Specialty Beans","Black Only"],
];

const CAFES=[];

const WIFI_COLOR={EXCELLENT:"#2ABFBF",GOOD:"#4CAF50",AVERAGE:"#FBC02D",NOT_EXIST:"#94A3B8"};
const WIFI_BARS={EXCELLENT:4,GOOD:3,AVERAGE:2,NOT_EXIST:0};

function isOpen(c){
  const statusInfo = getStatus(c.hours, c.is24h || c.is_24h, "en");
  return statusInfo.status === "open" || statusInfo.status === "closing";
}

function getStatus(hours, is24h, lang) {
  if (is24h || hours === "24時間営業" || (hours && hours.includes("24時間"))) {
    return { text: lang === "en" ? "Open" : "営業中", status: "open" };
  }
  if (!hours) {
    return { text: lang === "en" ? "Closed" : "準備中", status: "closed" };
  }
  const parts = hours.split(/[–-]/);
  if (parts.length < 2) {
    return { text: lang === "en" ? "Open" : "営業中", status: "open" };
  }
  
  const parseTime = (str) => {
    const clean = str.trim().toLowerCase();
    const match = clean.match(/(\d+):(\d+)/);
    if (!match) {
      const singleHour = clean.match(/(\d+)/);
      if (!singleHour) return null;
      let h = parseInt(singleHour[1], 10);
      if (clean.includes("pm") && h < 12) h += 12;
      if (clean.includes("am") && h === 12) h = 0;
      return { h, m: 0 };
    }
    let h = parseInt(match[1], 10);
    let m = parseInt(match[2], 10);
    if (clean.includes("pm") && h < 12) h += 12;
    if (clean.includes("am") && h === 12) h = 0;
    return { h, m };
  };

  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  if (!start || !end) {
    return { text: lang === "en" ? "Open" : "営業中", status: "open" };
  }

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const startMin = start.h * 60 + start.m;
  let endMin = end.h * 60 + end.m;

  // Handle overnight cafes
  let isOpenNow = false;
  let minsToClose = 9999;

  if (endMin <= startMin) {
    if (currentMin >= startMin) {
      isOpenNow = true;
      minsToClose = (endMin + 24 * 60) - currentMin;
    } else if (currentMin < endMin) {
      isOpenNow = true;
      minsToClose = endMin - currentMin;
    }
  } else {
    if (currentMin >= startMin && currentMin < endMin) {
      isOpenNow = true;
      minsToClose = endMin - currentMin;
    }
  }

  if (isOpenNow) {
    if (minsToClose > 0 && minsToClose <= 30) {
      return { text: lang === "en" ? "Closing Soon" : "まもなく閉店", status: "closing" };
    }
    return { text: lang === "en" ? "Open" : "営業中", status: "open" };
  } else {
    return { text: lang === "en" ? "Closed" : "準備中", status: "closed" };
  }
}

/* ── URL helpers ── */
function readURL(){
  const p=new URLSearchParams(window.location.search);
  return{tag:p.get("tag")||"",open:p.get("open")==="1",q:p.get("q")||"",
         lang:p.get("lang")==="en"?"en":"ja",dark:p.get("dark")==="1"};
}
function writeURL(st){
  const p=new URLSearchParams();
  if(st.tag)p.set("tag",st.tag);if(st.open)p.set("open","1");
  if(st.q)p.set("q",st.q);if(st.lang==="en")p.set("lang","en");
  if(st.dark)p.set("dark","1");
  const url=window.location.pathname+(p.toString()?"?"+p.toString():"");
  window.history.replaceState({},"",url);
  return window.location.origin+url;
}

/* ── WifiBars ── */
function WifiBars({level}){
  const bars=WIFI_BARS[level]??2,col=WIFI_COLOR[level]??"#FBC02D";
  return(
    <span style={{display:"inline-flex",alignItems:"flex-end",gap:2,marginRight:4}}>
      {[1,2,3,4].map(i=>(
        <span key={i} style={{display:"block",width:3,borderRadius:1,
          height:4+i*3,background:i<=bars?col:"var(--rule)"}}/>
      ))}
    </span>
  );
}

/* ── PhotoSlider ── */
function PhotoSlider({cafe,expanded,lang}){
  const idx = cafe.idx !== undefined ? cafe.idx : ((cafe.id || 1) - 1);
  const pal=PALETTES[idx%PALETTES.length];
  const lbls=(lang==="en"?PLE:PLJ)[idx%PLJ.length];
  const[lb,setLb]=useState(null);
  const t=lang==="en"?T.en:T.ja;

  if(!expanded){
    /* 
      【カフェ写真追加の仕組み（一覧カード表示時）】
      - cafe.photos 配列の最初の要素（cafe.photos[0]）がカードのカバー写真として表示されます。
      - 写真が登録されていない場合は、カメラの絵文字 <i className="fa-solid fa-camera"></i> がプレースホルダーとして表示されます。
      - DBシーダーや管理画面から写真を登録する際は、cafe.photos に画像URLまたはパスを追加してください。
    */
    const hasPhotos=cafe.photos&&cafe.photos.length>0;
    const coverPhoto=hasPhotos?cafe.photos[0]:null;
    return(
      <div style={{height:160,background:coverPhoto?"#000":"#D5D3CB",
                   display:"flex",alignItems:"center",justifyContent:"center",
                   overflow:"hidden",position:"relative"}}>
        {coverPhoto?(
          <img src={coverPhoto} alt={cafe.name}
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        ):(
          <span style={{fontSize:32,opacity:.4}}><i className="fa-solid fa-camera"></i></span>
        )}
      </div>
    );
  }

  const h=expanded?220:108;
  /* 
    【カフェ写真追加の仕組み（詳細展開時）】
    - 各スロット (0, 1, 2) に対応する写真が登録されている場合は実画像を表示します。
    - 登録されていない場合は、グラデーション背景とカメラの絵文字 <i className="fa-solid fa-camera"></i>（プレースホルダー）を表示します。
    - これにより、写真が1枚や2枚だけ登録されている場合でも正しく画像が表示されます。
  */
  return(
    <>
      <div style={{display:"grid",gridTemplateColumns:"1.55fr 1fr",
                   gridTemplateRows:`${h/2}px ${h/2}px`,gap:2,height:h,
                   borderRadius:expanded?"12px":8,overflow:"hidden"}}>
        {[0,1,2].map(i=>{
          const photoUrl = cafe.photos && cafe.photos[i];
          return (
            <div key={i} onClick={()=>expanded&&setLb(i)}
              style={{gridRow:i===0?"1/3":"auto",
                      background:photoUrl?"#000":`linear-gradient(145deg,${pal[i]}dd,${pal[(i+1)%3]}99)`,
                      display:"flex",flexDirection:"column",alignItems:"center",
                      justifyContent:"center",gap:5,cursor:expanded?"zoom-in":"default",
                      position:"relative",transition:"filter .2s",overflow:"hidden"}}
              onMouseEnter={e=>{if(expanded)e.currentTarget.style.filter="brightness(1.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.filter="brightness(1)";}}>
              {/* 各スロットの個別写真が存在すれば表示 */}
              {photoUrl?(
                <img src={photoUrl} alt={lbls[i]}
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              ):(
                <>
                  <span style={{fontSize:i===0?26:16,opacity:.4}}><i className="fa-solid fa-camera"></i></span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,.82)",fontWeight:600,
                                textAlign:"center",padding:"0 6px",lineHeight:1.3,
                                fontFamily:"'DM Mono',monospace"}}>{lbls[i]}</span>
                </>
              )}
              {/* ラベルオーバーレイ */}
              {photoUrl&&(
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"4px 8px",
                             background:"linear-gradient(transparent,rgba(0,0,0,.55))"}}>
                  <span style={{fontSize:8,color:"rgba(255,255,255,.9)",fontWeight:600,
                                fontFamily:"'DM Mono',monospace"}}>{lbls[i]}</span>
                </div>
              )}
              {expanded&&i===2&&(
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.38)",
                             display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:10,color:"white",fontWeight:700,
                                fontFamily:"'DM Mono',monospace"}}>{t.allPhotos}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {lb!==null&&(
        <div onClick={()=>setLb(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:9999,
                  display:"flex",flexDirection:"column",alignItems:"center",
                  justifyContent:"center",gap:16}}>
          {cafe.photos && cafe.photos[lb] ? (
            <img src={cafe.photos[lb]} alt={lbls[lb]}
              style={{width:"88vw",maxWidth:600,borderRadius:12,objectFit:"cover"}}/>
          ):(
            <div style={{width:"88vw",maxWidth:480,aspectRatio:"4/3",
                         background:`linear-gradient(145deg,${pal[lb]},${pal[(lb+1)%3]})`,
                         borderRadius:12,display:"flex",flexDirection:"column",
                         alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{fontSize:44,opacity:.4}}><i className="fa-solid fa-camera"></i></span>
              <span style={{color:"rgba(255,255,255,.8)",fontSize:13,fontWeight:600,
                            fontFamily:"'DM Mono',monospace"}}>{lbls[lb]}</span>
            </div>
          )}
          <div style={{display:"flex",gap:10}}>
            {[0,1,2].map(i=>{
              const hasP = cafe.photos && cafe.photos[i];
              return (
                <div key={i} onClick={e=>{e.stopPropagation();setLb(i);}}
                  style={{width:56,height:40,borderRadius:6,overflow:"hidden",
                          background:hasP?"#000":`linear-gradient(145deg,${pal[i]},${pal[(i+1)%3]})`,
                          border:i===lb?"2.5px solid white":"2px solid transparent",
                          opacity:i===lb?1:.55,cursor:"pointer"}}>
                  {hasP&&<img src={cafe.photos[i]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                </div>
              );
            })}
          </div>
          <button onClick={()=>setLb(null)}
            style={{color:"rgba(255,255,255,.5)",background:"none",border:"none",
                    fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
            {t.closeLb}
          </button>
        </div>
      )}
    </>
  );
}


/* ── Stars ── */
function StarInput({value,onChange}){
  const[hov,setHov]=useState(0);
  return(
    <div style={{display:"flex",gap:4}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} onMouseEnter={()=>setHov(s)} onMouseLeave={()=>setHov(0)}
          onClick={()=>onChange(s)}
          style={{fontSize:20,cursor:"pointer",transition:"transform .1s",
                  color:s<=(hov||value)?"#F5A623":"var(--rule)",
                  transform:s<=(hov||value)?"scale(1.2)":"scale(1)"}}>★</span>
      ))}
    </div>
  );
}
const CrowdStatusReport = ({ cafe, lang, authUser, onShowAuth, setAuthUser }) => {
  const [crowdStatus, setCrowdStatus] = useState(cafe.current_crowd_status);
  const [crowdUpdatedAt, setCrowdUpdatedAt] = useState(cafe.crowd_updated_at);
  const [loading, setLoading] = useState(false);

  const handleCrowdReport = async (status) => {
    if (!authUser) { onShowAuth(); return; }
    setLoading(true);
    try {
      const res = await authFetch(`/api/cafes/${cafe.id}/crowd-status`, {
        method: "POST",
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        setCrowdStatus(data.current_crowd_status);
        setCrowdUpdatedAt(data.crowd_updated_at);
        alert(lang === "en" ? "Thank you for sharing the crowd status!" : "混雑状況の共有ありがとうございます。");
        if (data.ranked_up && setAuthUser) {
          setAuthUser(prev => ({...prev, badge: data.new_badge}));
          const bName = data.new_badge.charAt(0).toUpperCase() + data.new_badge.slice(1);
          alert(lang === "en" ? `Rank Up! You are now a ${bName} Master!` : `ランクアップしました！\nあなたは ${bName} マスターになりました！`);
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getStatusDisplay = () => {
    if (!crowdStatus) return null;
    const time = new Date(crowdUpdatedAt);
    const now = new Date();
    const diffMins = Math.floor((now - time) / 60000);
    const timeStr = diffMins < 60 ? `${diffMins}分前` : `${Math.floor(diffMins/60)}時間前`;
    const enTimeStr = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins/60)}h ago`;
    const tStr = lang === "en" ? enTimeStr : timeStr;

    if (crowdStatus === "empty") {
      return <span style={{color: "#2ABFBF", fontWeight: 700}}><i className="fa-solid fa-circle" style={{color: "#2ABFBF"}}></i> {lang === "en" ? "Empty" : "空いてる"} <span style={{fontSize: 10, fontWeight: 400, color: "var(--muted)"}}>({tStr})</span></span>;
    } else {
      return <span style={{color: "#E05A5A", fontWeight: 700}}><i className="fa-solid fa-circle" style={{color: "#E05A5A"}}></i> {lang === "en" ? "Crowded" : "混んでる"} <span style={{fontSize: 10, fontWeight: 400, color: "var(--muted)"}}>({tStr})</span></span>;
    }
  };

  return (
    <div style={{marginTop: 20, padding: 16, background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 12}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
        <p style={{fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "1px", color: "var(--muted)", textTransform: "uppercase", margin: 0}}>
          {lang === "en" ? "Real-time Crowd" : "リアルタイム混雑状況"}
        </p>
        <div style={{fontSize: 13}}>
          {getStatusDisplay() || <span style={{color: "var(--muted)", fontSize: 12}}>{lang === "en" ? "No data" : "情報なし"}</span>}
        </div>
      </div>
      <div style={{display: "flex", gap: 12}}>
        <button disabled={loading} onClick={() => handleCrowdReport("empty")} style={{
          flex: 1, padding: "8px", background: "#f0faf9", border: "1px solid #2ABFBF", borderRadius: 8,
          color: "#2ABFBF", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.2s", opacity: loading ? 0.6 : 1
        }}>
          {lang === "en" ? "Empty!" : "空いてる"}
        </button>
        <button disabled={loading} onClick={() => handleCrowdReport("crowded")} style={{
          flex: 1, padding: "8px", background: "#fdf0f0", border: "1px solid #E05A5A", borderRadius: 8,
          color: "#E05A5A", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.2s", opacity: loading ? 0.6 : 1
        }}>
          {lang === "en" ? "Crowded" : "混んでる"}
        </button>
      </div>
    </div>
  );
};

const UserBadge = ({ badge }) => {
  if (!badge) return null;
  const badgeInfo = {
    bronze: { icon: <><i className="fa-solid fa-medal" style={{color: "#cd7f32"}}></i></>, label: "Bronze", bg: "linear-gradient(135deg, #cd7f32, #e5a468)", color: "#fff" },
    silver: { icon: <><i className="fa-solid fa-medal" style={{color: "#a6a6a6"}}></i></>, label: "Silver", bg: "linear-gradient(135deg, #a6a6a6, #d9d9d9)", color: "#111" },
    gold: { icon: <><i className="fa-solid fa-medal" style={{color: "#ffd700"}}></i></>, label: "Gold", bg: "linear-gradient(135deg, #ffd700, #ffea70)", color: "#7a5c00" }
  };
  const b = badgeInfo[badge];
  if (!b) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      background: b.bg, borderRadius: 12, padding: "2px 6px",
      fontSize: 10, fontWeight: 800, color: b.color, marginLeft: 6,
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
    }} title={`${b.label} Master`}>
      {b.icon} {b.label}
    </span>
  );
};

function TipsToggle({ cafe, lang }) {
  const [open, setOpen] = useState(false);
  const text = lang === "en" && cafe.tips_en ? cafe.tips_en : cafe.tips_ja;
  if (!text) return null;
  return (
    <div style={{marginTop: 20, display: "flex", gap: 12, alignItems: "flex-start"}}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        background: "var(--surface)", border: "1px solid var(--rule)", padding: "8px 16px", borderRadius: 20,
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--ink)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.2s", flexShrink: 0
      }}>
        <span style={{fontSize: 14}}><i className="fa-solid fa-lightbulb"></i></span>
        <span>{lang === "en" ? "TIPS" : "TIPS"}</span>
      </button>
      {open && (
        <div style={{padding: "10px 16px", background: "var(--tip-bg)", border: "1px solid var(--tip-bd)", borderRadius: 12, animation: "fadeUp 0.25s ease", flex: 1}}>
          <p style={{fontFamily: "'Noto Serif JP',serif", fontSize: 13, color: "var(--ink)", fontWeight: 500, lineHeight: 1.6, margin: 0}}>
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
function StarDisplay({value,small,size,fill,empty}){
  const fontSize = size || (small ? 11 : 14);
  const activeColor = fill || "#F5A623";
  const inactiveColor = empty || "var(--rule)";
  return(
    <span style={{display:"inline-flex",gap:1}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} style={{fontSize, color:s<=Math.round(value)?activeColor:inactiveColor}}>★</span>
      ))}
    </span>
  );
}
/* ── CafeReviewBadge（カード未展開時に平均評価を表示） ── */
function CafeReviewBadge({cafeId,reviewCounts,lang}){
  const data=reviewCounts?.[cafeId];
  const count=data?.count||0;
  const avg=data?.avg_rating?parseFloat(data.avg_rating).toFixed(1):null;
  const stars=avg?Math.round(parseFloat(avg)):0;
  return(
    <span style={{fontSize:9,padding:"2px 8px",borderRadius:3,
                  background:count>0?"#FFF8E1":"var(--surface2)",
                  color:count>0?"#F57F17":"var(--muted)",
                  fontFamily:"'DM Mono',monospace",display:"inline-flex",alignItems:"center",gap:3}}>
      {count>0?(
        <>
          <span style={{letterSpacing:"-1px"}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=stars?"#F57F17":"#DDD"}}>{i<=stars?"★":"☆"}</span>)}</span>
          {" "}{avg} <span style={{color:"#BF8A00"}}>({count}{lang==="en"?" reviews":"件"})</span>
        </>
      ):(
        <>{lang==="en"?"No reviews yet":"レビューなし"}</>
      )}
    </span>
  );
}

const ReviewPanel = ({cafeId,lang,authUser,onShowAuth,onClose,onRefreshCounts,setAuthUser}) => {
  const t=lang==="en"?T.en:T.ja;
  const[reviews,setReviews]=useState([]);
  const[loaded,setLoaded]=useState(false);
  const[saved,setSaved]=useState(false);
  const[error,setError]=useState("");
  const[actionMessage,setActionMessage]=useState("");
  const[form,setForm]=useState({stars:[0,0,0,0,0],crowd:"",tags:[],comment:"",purpose:""});
  const[editingReview,setEditingReview]=useState(null);

  useEffect(()=>{
    fetch(`/api/reviews/${cafeId}`).then(r=>r.json()).then(d=>{
      setReviews(d.reviews||[]);
    }).catch(()=>{}).finally(()=>setLoaded(true));
  },[cafeId]);

  const toggleTag=tag=>setForm(f=>({...f,tags:f.tags.includes(tag)?f.tags.filter(x=>x!==tag):[...f.tags,tag]}));
  const toggleEditTag=tag=>setEditingReview(prev=>{
    if(!prev)return null;
    const tags=prev.tags||[];
    return{
      ...prev,
      tags:tags.includes(tag)?tags.filter(x=>x!==tag):[...tags,tag]
    };
  });
  const canSubmit=form.stars.some(s=>s>0)||form.crowd||form.tags.length>0||(form.comment && form.comment.trim().length>0);

  const getInitials = (name) => {
    if (!name) return <><i className="fa-solid fa-user"></i></>;
    const clean = name.replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "").trim();
    if (!clean) return name.slice(0, 2).toUpperCase();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const submit=async()=>{
    if(!canSubmit||!authUser)return;
    setError("");
    setActionMessage("");
    try{
      const res=await authFetch("/api/reviews",{method:"POST",body:JSON.stringify({
        cafe_id:cafeId,stars:form.stars,crowd:form.crowd,tags:form.tags,comment:form.comment,purpose:form.purpose
      })});
      const data=await res.json();
      if(res.ok){
        setReviews(prev=>[data.review,...prev]);
        setForm({stars:[0,0,0,0,0],crowd:"",tags:[],comment:"",purpose:""});
        setSaved(true);setTimeout(()=>setSaved(false),2200);
        onRefreshCounts?.();
        if (data.ranked_up && setAuthUser) {
          setAuthUser(prev => ({...prev, badge: data.new_badge}));
          const bName = data.new_badge.charAt(0).toUpperCase() + data.new_badge.slice(1);
          alert(lang === "en" ? `Rank Up! You are now a ${bName} Master!` : `ランクアップしました！\nあなたは ${bName} マスターになりました！`);
        }
      } else {
        const msg=data.errors?Object.values(data.errors).flat().join(" "):(data.message||"");
        setError(msg||(lang==="en"?"An error occurred while saving the review":"レビューの保存中にエラーが発生しました"));
      }
    }catch{
      setError(lang==="en"?"Network error occurred":"通信エラーが発生しました");
    }
  };

  const submitEdit=async()=>{
    if(!editingReview||!authUser)return;
    setError("");
    setActionMessage("");
    try{
      const res=await authFetch(`/api/reviews/${editingReview.id}`,{
        method:"PUT",
        body:JSON.stringify({
          stars:editingReview.stars,
          crowd:editingReview.crowd,
          tags:editingReview.tags,
          comment:editingReview.comment,
          purpose:editingReview.purpose
        })
      });
      const data=await res.json();
      if(res.ok){
        setReviews(prev=>prev.map(r=>r.id===editingReview.id?data.review:r));
        setEditingReview(null);
        setActionMessage(t.reviewUpdateDone);
        setTimeout(()=>setActionMessage(""),2200);
        onRefreshCounts?.();
      }else{
        const msg=data.errors?Object.values(data.errors).flat().join(" "):(data.message||"");
        setError(msg||(lang==="en"?"Failed to update review":"クチコミの更新に失敗しました"));
      }
    }catch{
      setError(lang==="en"?"Network error occurred":"通信エラーが発生しました");
    }
  };

  const deleteReview=async(reviewId)=>{
    if(!window.confirm(t.reviewDeleteConfirm))return;
    setError("");
    setActionMessage("");
    try{
      const res=await authFetch(`/api/reviews/${reviewId}`,{method:"DELETE"});
      const data=await res.json();
      if(res.ok){
        setReviews(prev=>prev.filter(r=>r.id!==reviewId));
        setActionMessage(t.reviewDeleteDone);
        setTimeout(()=>setActionMessage(""),2200);
        onRefreshCounts?.();
      }else{
        setError(data.message||(lang==="en"?"Failed to delete review":"クチコミの削除に失敗しました"));
      }
    }catch{
      setError(lang==="en"?"Network error occurred":"通信エラーが発生しました");
    }
  };

  const avgStars=reviews && reviews.length ? t.ratingLabels.map((_,ci)=>{
    const vals=reviews.map(r=>r.stars && Array.isArray(r.stars) ? r.stars[ci] : 0).filter(v=>v>0);
    return vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null;
  }) : [];
  const totalAvg=avgStars.filter(Boolean).length
    ?(avgStars.filter(Boolean).reduce((a,b)=>a+parseFloat(b),0)/avgStars.filter(Boolean).length).toFixed(1)
    :null;
  const tagFreq={};
  if (reviews && Array.isArray(reviews)) {
    reviews.forEach(r => {
      if (r.tags && Array.isArray(r.tags)) {
        r.tags.forEach(tg => {
          tagFreq[tg] = (tagFreq[tg] || 0) + 1;
        });
      }
    });
  }

  if(!loaded)return <div style={{padding:16,fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--muted)"}}>{t.reviewLoading}</div>;

  return(
    <div style={{padding:"22px 24px",borderTop:"1px solid var(--rule)",background:"var(--surface2)"}}>
      {/* 3-1. ヘッダー */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <h3 style={{fontFamily:"Inter, 'Noto Sans JP', sans-serif",fontSize:"16px",fontWeight:500,color:"var(--ink)",margin:0}}>
          {lang==="en"?"Reviews":"レビュー"}
        </h3>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 24,
          height: 24,
          borderRadius: 12,
          background: "#1D9E75",
          color: "white",
          fontSize: 12,
          fontWeight: 700,
          padding: "0 6px"
        }}>
          {reviews.length}
        </span>
      </div>

      {/* 3-2. 総合スコア */}
      {reviews.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16,
                       padding:"16px 20px",background:"var(--surface)",
                       border:"1px solid var(--rule)",borderRadius:12,boxShadow:"var(--card-shadow)"}}>
            {totalAvg&&<>
              <div style={{fontSize:32,fontWeight:500,color:"var(--ink)",fontFamily:"Inter, sans-serif",lineHeight:1}}>{totalAvg}</div>
              <div>
                <StarDisplay value={parseFloat(totalAvg)} size={16} fill="#EF9F27" empty="var(--muted)"/>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:4,fontFamily:"Inter, sans-serif"}}>
                  {reviews.length}{lang === "en" ? " reviews" : "件のレビュー"}
                </div>
              </div>
            </>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px",marginBottom:16}}>
            {t.ratingLabels.map((lbl,i)=>avgStars[i]&&(
              <div key={lbl} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"Inter, 'Noto Sans JP', sans-serif",fontSize:10,color:"var(--muted)",width:76,flexShrink:0}}>{lbl}</span>
                <div style={{flex:1,height:4,background:"var(--rule)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${parseFloat(avgStars[i])/5*100}%`,background:"#1D9E75",borderRadius:2}}/>
                </div>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--ink)",width:20,textAlign:"right"}}>{avgStars[i]}</span>
              </div>
            ))}
          </div>
          {Object.keys(tagFreq).length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {Object.entries(tagFreq).sort((a,b)=>b[1]-a[1]).map(([tg,n])=>(
                <span key={tg} style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:"3px 8px",
                       borderRadius:3,background:"var(--surface)",border:"1px solid var(--rule)",color:"var(--ink2)"}}>
                  {tg} ×{n}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3-3. 訪問者のクチコミ一覧（スクロール可能なフィード） */}
      {reviews.length>0&&(
        <div style={{marginTop:16,marginBottom:18,borderTop:"1px solid var(--rule)",paddingTop:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontFamily:"Inter, sans-serif",fontSize:11,fontWeight:700,letterSpacing:"1px",color:"var(--teal)",margin:0}}>
              {lang==="en"?"VISITOR REVIEWS":"訪問者のクチコミ"}
            </p>
            {actionMessage&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--teal)"}}>{actionMessage}</span>}
          </div>
          
          <div style={{display:"flex",flexDirection:"column",gap:12,maxHeight:400,overflowY:"auto",paddingRight:4,
                        scrollbarWidth:"thin"}}>
            {reviews.map(r=>{
              const isEditing = editingReview && editingReview.id === r.id;
              if (isEditing) {
                return (
                  <div key={r.id} style={{padding:"16px",background:"var(--surface)",border:"1.5px solid var(--teal)",borderRadius:12,marginBottom:2}}>
                    <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"1px",color:"var(--teal)",marginBottom:12}}>
                      {lang === "en" ? "EDIT YOUR REVIEW" : "レビューの編集"}
                    </p>
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                      {t.ratingLabels.map((lbl,i)=>(
                        <div key={lbl} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontFamily:"Inter, 'Noto Sans JP', sans-serif",fontSize:10,color:"var(--muted)",width:80,flexShrink:0}}>{lbl}</span>
                          <StarInput 
                            value={editingReview.stars[i] || 0} 
                            onChange={v => setEditingReview(prev => {
                              const s = [...prev.stars];
                              s[i] = v;
                              return { ...prev, stars: s };
                            })}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Visitor Purpose selection inside Edit review */}
                    <div style={{marginBottom:10}}>
                      <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:5}}>
                        {lang === "en" ? "VISIT PURPOSE" : "訪問目的"}
                      </p>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {["作業", "勉強", "ミーティング"].map(p=>(
                          <button key={p} onClick={()=>setEditingReview(prev => ({...prev, purpose: prev.purpose === p ? "" : p}))}
                            style={{padding:"5px 10px",border:`1.5px solid ${editingReview.purpose===p?"var(--teal)":"var(--rule)"}`,
                                    borderRadius:6,background:editingReview.purpose===p?"var(--teal)":"var(--surface)",
                                    color:editingReview.purpose===p?"white":"var(--ink2)",
                                    fontFamily:"Inter, sans-serif",fontSize:11,fontWeight:500,cursor:"pointer",transition:"all .15s"}}>
                            {p === "作業" ? <><i className="fa-solid fa-laptop"></i> 作業</> : p === "勉強" ? <><i className="fa-solid fa-book"></i> 勉強</> : <><i className="fa-solid fa-handshake"></i> ミーティング</>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{marginBottom:10}}>
                      <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:5}}>{t.crowdLabel}</p>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {t.crowdOpts.map(opt=>(
                          <button key={opt} onClick={()=>setEditingReview(prev => ({...prev, crowd: prev.crowd === opt ? "" : opt}))}
                            style={{padding:"4px 10px",border:`1.5px solid ${editingReview.crowd===opt?"var(--teal)":"var(--rule)"}`,
                                    borderRadius:3,background:editingReview.crowd===opt?"var(--teal)":"var(--surface)",
                                    color:editingReview.crowd===opt?"white":"var(--ink2)",
                                    fontFamily:"'DM Mono',monospace",fontSize:9,cursor:"pointer",transition:"all .15s"}}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:5}}>{t.tagLabel}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {t.reviewTags.map(tg=>{
                          const tags = editingReview.tags || [];
                          const on = tags.includes(tg);
                          return(
                            <button key={tg} onClick={()=>toggleEditTag(tg)}
                              style={{padding:"3px 8px",border:`1.5px solid ${on?"var(--ink)":"var(--rule)"}`,
                                      borderRadius:3,background:on?"var(--ink)":"var(--surface)",
                                      color:on?"var(--base)":"var(--ink2)",
                                      fontFamily:"'DM Mono',monospace",fontSize:8,cursor:"pointer",transition:"all .15s"}}>
                                {tg}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:5}}>{t.commentLabel}</p>
                      <textarea 
                        value={editingReview.comment || ""} 
                        onChange={e => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder={t.commentPlaceholder}
                        rows={3}
                        style={{
                          width:"100%",padding:"6px 10px",background:"var(--surface)",
                          border:"1px solid var(--rule)",borderRadius:6,color:"var(--ink)",
                          fontFamily:"inherit",fontSize:11,outline:"none",resize:"vertical"
                        }}
                      />
                    </div>
                    <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                      <button onClick={()=>setEditingReview(null)}
                        style={{padding:"4px 10px",background:"var(--surface)",border:"1px solid var(--rule)",borderRadius:3,
                                color:"var(--ink2)",fontFamily:"'DM Mono',monospace",fontSize:9,cursor:"pointer"}}>
                        {t.reviewCancel}
                      </button>
                      <button onClick={submitEdit}
                        style={{padding:"4px 12px",background:"var(--ink)",border:"none",borderRadius:3,
                                color:"var(--base)",fontFamily:"'DM Mono',monospace",fontSize:9,cursor:"pointer",fontWeight:700}}>
                        {t.reviewSave}
                      </button>
                    </div>
                  </div>
                );
              }

              const reviewAvg=r.stars && Array.isArray(r.stars)
                ? (r.stars.filter(s=>s>0).reduce((a,b)=>a+b,0)/Math.max(1,r.stars.filter(s=>s>0).length)).toFixed(1)
                : null;
              const dateStr=r.created_at ? new Date(r.created_at).toLocaleDateString(lang==="en"?"en-US":"ja-JP",{
                year:"numeric",month:"short",day:"numeric"
              }) : "";
              return(
                <div key={r.id||Math.random()}
                  style={{padding:"16px",background:"var(--surface)",border:"0.5px solid var(--rule)",borderRadius:12}}>
                  {/* Row 1: 投稿者行 */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      {/* Avatar */}
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#E1F5EE",
                        color: "#085041",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif"
                      }}>
                        {getInitials(r.user_name)}
                      </div>
                      
                      {/* Nickname & Purpose Tag */}
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontFamily:"Inter, 'Noto Sans JP', sans-serif",fontSize:13,fontWeight:500,color:"var(--ink)"}}>
                          {r.user_name}
                        </span>
                        <UserBadge badge={r.user_badge} />
                        {r.purpose && (
                          <span style={{
                            background: "var(--surface2)",
                            border: "1px solid var(--rule)",
                            borderRadius: 6,
                            padding: "3px 8px",
                            fontSize: 11,
                            color: "var(--ink2)",
                            fontWeight: 500,
                            display: "inline-flex",
                            alignItems: "center"
                          }}>
                            {r.purpose === "作業" ? <><i className="fa-solid fa-laptop"></i> 作業</> : r.purpose === "勉強" ? <><i className="fa-solid fa-book"></i> 勉強</> : r.purpose === "ミーティング" ? <><i className="fa-solid fa-handshake"></i> ミーティング</> : r.purpose}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Date */}
                    <span style={{fontFamily:"Inter, sans-serif",fontSize:12,color:"var(--muted)"}}>
                      {dateStr}
                    </span>
                  </div>

                  {/* Row 2: 星評価 */}
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    {reviewAvg&&<StarDisplay value={parseFloat(reviewAvg)} size={14} fill="#EF9F27" empty="var(--muted)"/>}
                  </div>

                  {r.crowd&&(
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--teal)",marginBottom:4,display:"flex",alignItems:"center",gap:4}}>
                      <span><i className="fa-solid fa-circle"></i></span>
                      <span>{lang==="en"?`Crowd: ${r.crowd}`:`混雑度: ${r.crowd}`}</span>
                    </div>
                  )}
                  {r.tags && Array.isArray(r.tags) && r.tags.length>0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                      {r.tags.map(tg=>(
                        <span key={tg} style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 6px",
                          borderRadius:3,background:"var(--surface2)",border:"1px solid var(--rule)",color:"var(--ink2)"}}>
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Row 3: コメント */}
                  {r.comment && (
                    <p style={{fontFamily:"inherit",fontSize:14,color:"var(--ink)",margin:"10px 0 0",
                               whiteSpace:"pre-wrap",lineHeight:"1.7"}}>
                      {r.comment}
                    </p>
                  )}

                  {authUser && r.user_id === authUser.id && (
                    <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8,borderTop:"1px dotted var(--rule)",paddingTop:6}}>
                      <button onClick={() => setEditingReview({ id: r.id, stars: r.stars && Array.isArray(r.stars) ? [...r.stars] : [0,0,0,0,0], crowd: r.crowd || "", tags: r.tags && Array.isArray(r.tags) ? [...r.tags] : [], comment: r.comment || "", purpose: r.purpose || "" })}
                        style={{background:"none",border:"none",color:"var(--teal)",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:9,padding:0}}>
                        <i className="fa-solid fa-pencil"></i> {t.reviewEdit}
                      </button>
                      <button onClick={() => deleteReview(r.id)}
                        style={{background:"none",border:"none",color:"#E05A5A",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:9,padding:0}}>
                        🗑 {t.reviewDelete}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* レビューフォーム or ログイン促進 */}
      {authUser?(
        <div style={{padding:"16px",background:"var(--surface)",border:"1px solid var(--rule)",borderRadius:12,boxShadow:"var(--card-shadow)"}}>
          <p style={{fontFamily:"Inter, sans-serif",fontSize:12,fontWeight:700,letterSpacing:"1px",color:"var(--teal)",marginBottom:14}}>{t.reviewTitle}</p>
          
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            {t.ratingLabels.map((lbl,i)=>(
              <div key={lbl} style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontFamily:"Inter, 'Noto Sans JP', sans-serif",fontSize:11,color:"var(--muted)",width:80,flexShrink:0}}>{lbl}</span>
                <StarInput value={form.stars[i]} onChange={v=>setForm(f=>{const s=[...f.stars];s[i]=v;return{...f,stars:s};})}/>
              </div>
            ))}
          </div>

          {/* Visitor Purpose selection inside Review creation */}
          <div style={{marginBottom: 14}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:7}}>
              {lang === "en" ? "VISIT PURPOSE" : "訪問目的"}
            </p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["作業", "勉強", "ミーティング"].map(p => {
                const label = p === "作業" ? <><i className="fa-solid fa-laptop"></i> 作業</> : p === "勉強" ? <><i className="fa-solid fa-book"></i> 勉強</> : <><i className="fa-solid fa-handshake"></i> ミーティング</>;
                const isSelected = form.purpose === p;
                return (
                  <button key={p} onClick={() => setForm(f => ({ ...f, purpose: f.purpose === p ? "" : p }))}
                    style={{
                      padding: "6px 12px",
                      border: `1.5px solid ${isSelected ? "var(--teal)" : "var(--rule)"}`,
                      borderRadius: 6,
                      background: isSelected ? "var(--teal)" : "var(--surface)",
                      color: isSelected ? "white" : "var(--ink2)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all .15s"
                    }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:7}}>{t.crowdLabel}</p>
            <div style={{display:"flex",gap:6}}>
              {t.crowdOpts.map(opt=>(
                <button key={opt} onClick={()=>setForm(f=>({...f,crowd:f.crowd===opt?"":opt}))}
                  style={{padding:"5px 12px",border:`1.5px solid ${form.crowd===opt?"var(--teal)":"var(--rule)"}`,
                          borderRadius:6,background:form.crowd===opt?"var(--teal)":"var(--surface)",
                          color:form.crowd===opt?"white":"var(--ink2)",
                          fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer",transition:"all .15s"}}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:7}}>{t.tagLabel}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {t.reviewTags.map(tg=>{
                const on=form.tags.includes(tg);
                return(
                  <button key={tg} onClick={()=>toggleTag(tg)}
                    style={{padding:"4px 10px",border:`1.5px solid ${on?"var(--ink)":"var(--rule)"}`,
                            borderRadius:6,background:on?"var(--ink)":"var(--surface)",
                            color:on?"var(--base)":"var(--ink2)",
                            fontFamily:"'DM Mono',monospace",fontSize:9,cursor:"pointer",transition:"all .15s"}}>
                    {tg}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",marginBottom:7}}>{t.commentLabel}</p>
            <textarea 
              value={form.comment || ""} 
              onChange={e=>setForm(f=>({...f,comment:e.target.value}))}
              placeholder={t.commentPlaceholder}
              rows={4}
              style={{
                width:"100%",padding:"8px 12px",background:"var(--surface)",
                border:"1.5px solid var(--rule)",borderRadius:6,color:"var(--ink)",
                fontFamily:"inherit",fontSize:12,outline:"none",resize:"vertical",
                transition:"border-color .15s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--teal)"}
              onBlur={e => e.target.style.borderColor = "var(--rule)"}
            />
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={submit}
              style={{padding:"8px 20px",background:canSubmit?"var(--ink)":"var(--rule)",
                      border:"none",borderRadius:6,color:canSubmit?"var(--base)":"var(--muted)",
                      fontFamily:"'DM Mono',monospace",fontSize:11,cursor:canSubmit?"pointer":"default",
                      letterSpacing:".5px",transition:"all .15s"}}>
              {t.reviewSubmit}
            </button>
            <button onClick={onClose}
              style={{padding:"8px 16px",background:"var(--surface)",
                      border:"1px solid var(--rule)",borderRadius:6,color:"var(--ink2)",
                      fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer",
                      transition:"all .15s",marginLeft:"auto"}}>
              {lang==="en"?"← Close":"← 戻る"}
            </button>
            {saved&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--teal)"}}>{t.reviewDone}</span>}
          </div>
          {error&&<p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#E05A5A",marginTop:10,marginBottom:0,padding:"8px 12px",background:"#FFF0F0",borderRadius:4}}>{error}</p>}
        </div>
      ):(
        <div style={{padding:"16px",background:"var(--surface)",border:"1px solid var(--rule)",borderRadius:12,textAlign:"center",boxShadow:"var(--card-shadow)"}}>
          <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:13,color:"var(--ink)",marginBottom:8}}>
            {lang==="en"?"Login to write a review":"ログインしてレビューを投稿"}
          </p>
          <button onClick={onShowAuth}
            style={{padding:"8px 24px",background:"var(--teal)",color:"white",border:"none",borderRadius:6,
                    cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,transition:"all .15s"}}>
            {lang==="en"?"Login / Register":"ログイン / 新規登録"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Quiz ── */
const QJ=[
  {q:"今、何時ごろ？",opts:[{label:<><i className="fa-solid fa-sun"></i> 朝・午前中</>,val:"morning"},{label:<><i className="fa-solid fa-cloud-sun"></i> 昼・午後</>,val:"anytime"},{label:<><i className="fa-solid fa-moon"></i> 夜・深夜</>,val:"late"},{label:<><i className="fa-solid fa-city"></i> 夕方</>,val:"evening"}]},
  {q:"今日の気分は？",opts:[{label:<><i className="fa-solid fa-laptop"></i> ガチで作業したい</>,val:"work"},{label:<><i className="fa-solid fa-mug-hot"></i> まったりしたい</>,val:"chill"}]},
  {q:"誰と行く？",opts:[{label:<><i className="fa-solid fa-user"></i> ひとりで</>,val:"solo"},{label:<><i className="fa-solid fa-laptop"></i> 作業仲間と</>,val:"buddy"},{label:<><i className="fa-solid fa-users"></i> グループで</>,val:"group"}]},
];
const QE=[
  {q:"What time is it?",opts:[{label:<><i className="fa-solid fa-sun"></i> Morning</>,val:"morning"},{label:<><i className="fa-solid fa-cloud-sun"></i> Afternoon</>,val:"anytime"},{label:<><i className="fa-solid fa-moon"></i> Late night</>,val:"late"},{label:<><i className="fa-solid fa-city"></i> Evening</>,val:"evening"}]},
  {q:"What's your vibe today?",opts:[{label:<><i className="fa-solid fa-laptop"></i> Serious work mode</>,val:"work"},{label:<><i className="fa-solid fa-mug-hot"></i> Relaxed & casual</>,val:"chill"}]},
  {q:"Who are you going with?",opts:[{label:<><i className="fa-solid fa-user"></i> Solo</>,val:"solo"},{label:<><i className="fa-solid fa-laptop"></i> Study Buddy</>,val:"buddy"},{label:<><i className="fa-solid fa-users"></i> Group</>,val:"group"}]},
];

function scoreCafe(cafe,answers){
  let s=0;
  const is24 = cafe.is24h || cafe.is_24h;
  if(answers[0]==="late"&&is24)s+=3;
  if(answers[0]==="morning"&&cafe.quiz?.time==="morning")s+=2;
  if(answers[0]==="evening"&&cafe.quiz?.time==="evening")s+=2;
  if(answers[0]==="anytime")s+=1;
  if(answers[1]==="work"&&cafe.quiz?.vibe==="work")s+=3;
  if(answers[1]==="chill"&&cafe.quiz?.vibe==="chill")s+=3;
  if(answers[2]==="buddy"&&cafe.tags.includes("会話OK"))s+=3;
  if(answers[2]==="group"&&cafe.tags.includes("大人数OK"))s+=3;
  if(answers[2]==="solo"&&cafe.quiz?.group==="solo")s+=2;
  if(answers[0]==="late"&&!is24)s-=5;
  return s;
}


/* ── Map ── */
function MapView({cafes,onSelect,favorites,selectedCafe,lang}){
  const t=lang==="en"?T.en:T.ja;
  const cebuITPark=[10.3290, 123.9061]; // マップの中心 (IT Park Cebu)

  // カスタムマーカーの作成（カフェのアクセントカラーに合わせた丸いドットピン）
  const createCustomIcon = (accentColor, isSelected) => {
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div style="
          width: ${isSelected ? '24px' : '16px'}; 
          height: ${isSelected ? '24px' : '16px'}; 
          background: ${accentColor}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          transform: translate(-15%, -15%);
          transition: all 0.2s ease-in-out;
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // マップのビューポート制御（選択中のカフェにカメラを滑らかに移動させるヘルパー）
  function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 17, { animate: true, duration: 0.8 });
      }
    }, [center]);
    return null;
  }

  const activeCenter = selectedCafe ? [parseFloat(selectedCafe.lat), parseFloat(selectedCafe.lng)] : null;

  return (
    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--rule)", position: "relative" }}>
      <MapContainer 
        center={cebuITPark} 
        zoom={16} 
        style={{ height: 380, width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // プレミアムなホワイトマップタイル
        />
        
        {activeCenter && <ChangeView center={activeCenter} />}

        {cafes.map(c => {
          const isSelected = selectedCafe?.id === c.id;
          if (!c.lat || !c.lng) return null;
          return (
            <Marker 
              key={c.id} 
              position={[parseFloat(c.lat), parseFloat(c.lng)]}
              icon={createCustomIcon(c.accent, isSelected)}
              eventHandlers={{
                click: () => {
                  onSelect(c);
                }
              }}
            >
              <Popup>
                <div style={{ color: '#111', fontFamily: 'sans-serif', padding: '2px' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>{c.name}</h4>
                  <p style={{ margin: 0, fontSize: 10, color: '#666' }}>
                    {c.wifi} Wi-Fi · {c.price}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 9, color: c.is24h ? 'green' : '#333', fontWeight: 600 }}>
                    {c.is24h ? '24時間営業' : c.hours}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* 選択中のカフェ詳細バー */}
      {selectedCafe && (
        <div style={{ padding: "10px 14px", background: "var(--surface)", borderTop: "1px solid var(--rule)",
                     display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1000 }}>
          <div>
            <p style={{ fontFamily: "'Noto Serif JP',serif", fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{selectedCafe.name}</p>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)" }}>{selectedCafe.wifi} Wi-Fi · {selectedCafe.price}</p>
          </div>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(selectedCafe.name + " IT Park Cebu")}`}
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "6px 12px", background: "var(--teal)", color: "white", borderRadius: 4,
                    fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700, textDecoration: "none" }}>
            Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Chip ── */
function Chip({label,active,onClick}){
  return(
    <button onClick={onClick} className={`chip${active?" on":""}`}
      style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".5px",
              padding:"5px 13px",border:"1px solid var(--chip-border)",borderRadius:3,
              background:active?"var(--ink)":"var(--chip-bg)",
              color:active?"var(--base)":"var(--chip-color)",
              cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
      {label}
    </button>
  );
}

/* ── CafeCard ── */
/* ── SpecsDropdown ── */
function SpecsDropdown({cafe,lang}){
  const t=lang==="en"?T.en:T.ja;
  const[open,setOpen]=useState(false);

  // Specs data and fallback
  const s = cafe.specs || {
    atmosphere: cafe.wifi === "EXCELLENT" ? (lang === "en" ? "Quiet" : "落ち着いた") : (lang === "en" ? "Lively" : "にぎやか"),
    bgm: lang === "en" ? "Yes (Low)" : "あり（小さめ）",
    call: cafe.wifi === "EXCELLENT" ? (lang === "en" ? "Earphones recommended" : "イヤホン推奨") : (lang === "en" ? "Allowed" : "OK"),
    seats_total: cafe.wifi === "EXCELLENT" ? 50 : 30,
    seat_types: cafe.outlet === "YES" ? (lang === "en" ? ["Counter", "Table"] : ["カウンター", "テーブル"]) : (lang === "en" ? ["Table"] : ["テーブル"]),
    solo_seat: cafe.outlet !== "NO",
    toilet: true,
    wifi_available: cafe.wifi !== "AVERAGE" && cafe.wifi !== "NOT_EXIST",
    wifi_limit: "",
    cashless_available: true,
    outlet_detail: cafe.outlet === "YES" ? (lang === "en" ? "All seats" : "全席対応") : cafe.outlet === "LIMITED" ? (lang === "en" ? "Some seats" : "一部席のみ") : (lang === "en" ? "None" : "なし")
  };

  const isPositive = (val) => {
    if (typeof val === "boolean") return val;
    const pos = ["あり", "全席対応", "OK", "爆速", "十分", "落ち着いた", "おしゃれ", "Yes", "Allowed", "All seats", "Quiet", "Chic", "Available", "Plenty"];
    return pos.some(p => String(val).toLowerCase().includes(p.toLowerCase()));
  };

  const valColor = (val) => {
    return isPositive(val) ? "var(--teal)" : "var(--ink)";
  };

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0"
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "Inter, sans-serif",
    fontSize: 11,
    color: "var(--muted)"
  };

  const valStyle = (val) => ({
    fontFamily: "Inter, 'Noto Sans JP', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: valColor(val)
  });

  const sectionHeaderStyle = {
    fontSize: 12,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 8
  };

  return(
    <div style={{background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}}>
      <button onClick={()=>setOpen(!open)}
              style={{width:"100%",padding:"14px 18px",border:"none",
              background:"var(--surface2)",cursor:"pointer",fontFamily:"Inter, 'Noto Sans JP', sans-serif",
              fontSize:14,fontWeight:700,color: "var(--teal)", textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .15s"}}>
        <span><i className="fa-solid fa-clipboard-list"></i> Specs</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
             style={{transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease"}}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      
      {open && (
        <div style={{padding: "4px 18px 18px", display: "flex", flexDirection: "column", animation: "fadeUp .2s ease"}}>
          {/* 2-1. 環境セクション */}
          <div style={{borderBottom: "1px solid var(--rule)", paddingBottom: 12, marginBottom: 8}}>
            <h4 style={sectionHeaderStyle}>{lang === "en" ? "Environment" : "環境"}</h4>
            
            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                {lang === "en" ? "Vibe" : "雰囲気"}
              </span>
              <span style={valStyle(s.atmosphere)}>{s.atmosphere}</span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                BGM
              </span>
              <span style={valStyle(s.bgm)}>{s.bgm}</span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {lang === "en" ? "Calls" : "通話"}
              </span>
              <span style={valStyle(s.call)}>{s.call}</span>
            </div>
          </div>

          {/* 2-2. 席セクション */}
          <div style={{borderBottom: "1px solid var(--rule)", paddingBottom: 12, marginBottom: 8}}>
            <h4 style={sectionHeaderStyle}>{lang === "en" ? "Seating" : "席"}</h4>
            
            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M5 18v2M19 18v2"/></svg>
                {lang === "en" ? "Total Seats" : "総席数"}
              </span>
              <span style={valStyle(`${s.seats_total}${lang === "en" ? " seats" : "席"}`)}>
                {lang === "en" ? `Approx. ${s.seats_total}` : `約${s.seats_total}席`}
              </span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                {lang === "en" ? "Seat Types" : "席タイプ"}
              </span>
              <span style={valStyle(Array.isArray(s.seat_types) ? s.seat_types.join(", ") : s.seat_types)}>
                {Array.isArray(s.seat_types) ? s.seat_types.join(lang === "en" ? ", " : "・") : s.seat_types}
              </span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {lang === "en" ? "Solo Seat" : "一人席"}
              </span>
              <span style={valStyle(s.solo_seat ? (lang === "en" ? "Yes" : "あり") : (lang === "en" ? "No" : "なし"))}>
                {s.solo_seat ? (lang === "en" ? "Yes" : "あり") : (lang === "en" ? "No" : "なし")}
              </span>
            </div>
          </div>

          {/* 2-3. 設備セクション */}
          <div style={{paddingBottom: 4}}>
            <h4 style={sectionHeaderStyle}>{lang === "en" ? "Facilities" : "設備"}</h4>
            
            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M6 14v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/></svg>
                {lang === "en" ? "Restroom" : "トイレ"}
              </span>
              <span style={valStyle(s.toilet ? (lang === "en" ? "Yes" : "あり") : (lang === "en" ? "No" : "なし"))}>
                {s.toilet ? (lang === "en" ? "Yes" : "あり") : (lang === "en" ? "No" : "なし")}
              </span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2"/></svg>
                Wi-Fi
              </span>
              <span style={valStyle(s.wifi_available ? (lang === "en" ? "Available" : "あり") : (lang === "en" ? "None" : "なし"))}>
                {s.wifi_available ? (lang === "en" ? "Available" : "あり") : (lang === "en" ? "None" : "なし")}
                {s.wifi_limit ? ` (${s.wifi_limit})` : ""}
              </span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                {lang === "en" ? "Cashless" : "キャッシュレス"}
              </span>
              <span style={valStyle(s.cashless_available ? (lang === "en" ? "Available" : "利用可") : (lang === "en" ? "None" : "不可"))}>
                {s.cashless_available ? (lang === "en" ? "Available" : "利用可") : (lang === "en" ? "None" : "不可")}
              </span>
            </div>

            <div style={itemStyle}>
              <span style={labelStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6M9 8h6M18 12a6 6 0 0 1-6 6H9M6 12h12M12 18v4"/></svg>
                {lang === "en" ? "Power Outlets" : "コンセント"}
              </span>
              <span style={valStyle(s.outlet_detail)}>{s.outlet_detail}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ShareLinksDropdown ── */
function ShareLinksDropdown({cafe,lang}){
  const[open,setOpen]=useState(false);
  const[copiedMap,setCopiedMap]=useState(false);
  const[copiedPage,setCopiedPage]=useState(false);
  const mapsUrl=`https://www.google.com/maps/search/${encodeURIComponent(cafe.name+" IT Park Cebu")}`;
  const pageUrl=typeof window!=="undefined"?window.location.origin+window.location.pathname+`?cafe=${cafe.id}`:"";

  const copyLink=async(url,setter)=>{
    try{await navigator.clipboard.writeText(url);}catch{}
    setter(true);setTimeout(()=>setter(false),2000);
  };

  return(
    <div>
      <button onClick={()=>setOpen(!open)}
              style={{
                width:"100%",
                height:48,
                padding:"0 18px",
                border:"1px solid var(--rule)",
                background:"var(--surface2)",
                borderRadius:12,
                cursor:"pointer",
                fontFamily:"Inter, 'Noto Sans JP', sans-serif",
                fontSize:14,
                fontWeight:700,
                textAlign:"left",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                transition:"all .15s ease",
                boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                color:"var(--ink)",
                boxSizing:"border-box"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal)"; e.currentTarget.style.color = "var(--teal)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.color = "var(--ink)"; }}>
        <span><i className="fa-solid fa-link"></i> {lang==="en"?"Share & Open Maps":"共有・マップで開く"}</span>
        <span style={{fontSize:10,color:"var(--muted)"}}>{open?"▼":"▶"}</span>
      </button>
      {open&&(
        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:8,animation:"fadeUp .2s ease"}}>
          {/* Google Mapsで直接開く */}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="share-btn">
            <span><i className="fa-solid fa-map"></i> {lang==="en"?"Open Google Maps":"Google Mapsで開く"}</span>
            <span style={{fontSize:9,color:"var(--teal)",fontWeight:600}}>
              {lang==="en"?"Open →":"開く →"}
            </span>
          </a>
          
          {/* Google Maps リンクコピー */}
          <button onClick={()=>copyLink(mapsUrl,setCopiedMap)} className="share-btn">
            <span><i className="fa-solid fa-location-dot"></i> {lang==="en"?"Copy Maps URL":"Google Mapsリンクをコピー"}</span>
            <span style={{fontSize:9,color:copiedMap?"var(--teal)":"var(--muted)",fontWeight:600}}>
              {copiedMap?(lang==="en"?<><i className="fa-solid fa-check"></i> Copied!</>:<><i className="fa-solid fa-check"></i> コピー済み</>):(lang==="en"?"Copy":"コピー")}
            </span>
          </button>
          
          {/* URL表示 */}
          <div style={{padding:"8px 12px",background:"var(--surface)",border:"1px solid var(--rule)",
                       borderRadius:8,overflow:"hidden"}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"var(--muted)",
                       whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{mapsUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
}


/* ── QuizModal (Cafe Recommendation) ── */
function QuizModal({cafes,onClose,onSelect,lang}){
  const t=lang==="en"?T.en:T.ja;
  const[q,setQ]=useState(0);
  const[answers,setAnswers]=useState([]);
  const questions=[
    {q:lang==="en"?"What's your vibe?":"今日の気分は？",
     a:[{label:lang==="en"?<><i className="fa-solid fa-bullseye"></i> Focus</>:<><i className="fa-solid fa-bullseye"></i>集中</>,val:"focus"},
        {label:lang==="en"?<><i className="fa-solid fa-face-smile"></i> Social</>:<><i className="fa-solid fa-face-smile"></i>社交</>,val:"social"},
        {label:lang==="en"?<><i className="fa-solid fa-palette"></i> Creative</>:<><i className="fa-solid fa-palette"></i>創作</>,val:"creative"}]},
    {q:lang==="en"?"Wi-Fi needed?":"Wi-Fi必須？",
     a:[{label:lang==="en"?<><i className="fa-solid fa-bolt"></i> Yes</>:<><i className="fa-solid fa-bolt"></i>必須</>,val:"yes"},
        {label:lang==="en"?"OK average":"OK普通",val:"average"},
        {label:lang==="en"?"No":"不要",val:"no"}]},
    {q:lang==="en"?"Budget?":"予算は？",
     a:[{label:lang==="en"?<><i className="fa-solid fa-money-bill-wave"></i> Low</>:<><i className="fa-solid fa-money-bill-wave"></i>安い</>,val:"low"},
        {label:lang==="en"?<><i className="fa-solid fa-dollar-sign"></i> Mid</>:<><i className="fa-solid fa-dollar-sign"></i>標準</>,val:"mid"},
        {label:lang==="en"?<><i className="fa-solid fa-gem"></i> High</>:<><i className="fa-solid fa-gem"></i>高い</>,val:"high"}]},
  ];
  const q_data=questions[q];

  const calculateScore=(c, ansList)=>{
    let score = 0;
    const tags = c.tags || [];
    const priceNum = parseInt((c.price || "").replace(/[^0-9]/g, "")) || 150;

    // 1. Vibe Matching
    const userVibe = ansList[0];
    if (userVibe === "focus") {
      if (tags.includes("作業向き")) score += 4;
      if (c.wifi === "EXCELLENT") score += 3;
      if (c.wifi === "GOOD") score += 1;
      if (tags.includes("一人作業")) score += 2;
    } else if (userVibe === "social") {
      if (tags.includes("会話OK")) score += 4;
      if (tags.includes("大人数OK")) score += 3;
      const isLively = (c.specs?.atmosphere === "にぎやか" || c.specs?.atmosphere === "Lively");
      if (isLively) score += 2;
    } else if (userVibe === "creative") {
      if (tags.includes("一人作業")) score += 4;
      if (!tags.includes("作業向き")) score += 2;
      const isChic = (c.specs?.atmosphere === "おしゃれ" || c.specs?.atmosphere === "Chic");
      if (isChic) score += 2;
    }

    // 2. Wi-Fi Matching
    const userWifi = ansList[1];
    if (userWifi === "yes") {
      if (c.wifi === "EXCELLENT") score += 5;
      else if (c.wifi === "GOOD") score += 3;
      else if (c.wifi === "AVERAGE") score += 1;
      else if (c.wifi === "NOT_EXIST") score -= 5;
    } else if (userWifi === "average") {
      if (c.wifi === "GOOD" || c.wifi === "AVERAGE") score += 5;
      else if (c.wifi === "EXCELLENT") score += 3;
      else score += 1;
    } else if (userWifi === "no") {
      score += 3;
    }

    // 3. Budget Matching
    const userBudget = ansList[2];
    if (userBudget === "low") {
      if (priceNum <= 150) score += 4;
      else if (priceNum <= 200) score += 2;
      else score -= 2;
    } else if (userBudget === "mid") {
      if (priceNum > 150 && priceNum <= 220) score += 4;
      else if (priceNum <= 150) score += 2;
      else score += 1;
    } else if (userBudget === "high") {
      if (priceNum > 200) score += 4;
      else if (priceNum > 150) score += 2;
      else score += 0;
    }

    return score;
  };

  const handleAnswer=(ans)=>{
    const newAnswers=[...answers,ans.val];
    setAnswers(newAnswers);
    if(q===questions.length-1){
      const scoredCafes = cafes.map(c => ({ cafe: c, score: calculateScore(c, newAnswers) }));
      scoredCafes.sort((a, b) => b.score - a.score);
      
      const highestScore = scoredCafes[0]?.score || 0;
      const bestMatches = scoredCafes.filter(x => x.score === highestScore).map(x => x.cafe);
      const chosen = bestMatches[Math.floor(Math.random() * bestMatches.length)];
      
      onClose();
      setTimeout(()=>onSelect(chosen||cafes[0]),100);
    }else{
      setQ(q+1);
    }
  };
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.6)",
                 display:"flex",alignItems:"center",justifyContent:"center",zIndex:2100}}>
      <div style={{background:"var(--surface)",padding:"24px",borderRadius:8,maxWidth:340,
                   boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
        <h3 style={{fontFamily:"'Noto Serif JP',serif",fontSize:18,fontWeight:700,marginBottom:16}}>
          {t.quizTitle} • {q+1}/{questions.length}
        </h3>
        <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:14,marginBottom:16}}>{q_data.q}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {q_data.a.map((ans,i)=>(
            <button key={i} onClick={()=>handleAnswer(ans)}
              style={{padding:"12px",background:"var(--ink)",color:"white",border:"none",
                      borderRadius:4,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:12}}>
              {ans.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{width:"100%",padding:"10px",background:"var(--rule)",
                border:"none",borderRadius:4,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:11}}>
          {lang==="en"?"Skip":"スキップ"}
        </button>
      </div>
    </div>
  );
}

/* ── Auth Helper ── */
const csrfToken=()=>document.querySelector('meta[name="csrf-token"]')?.content||"";
async function authFetch(url,opts={}){
  const headers = {
    "Accept": "application/json",
    "X-CSRF-TOKEN": csrfToken(),
    ...(opts.headers || {})
  };
  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res=await fetch(url,{
    ...opts,
    headers,
    credentials:"same-origin",
  });
  return res;
}

/* ── AuthModal ── */
function AuthModal({onClose,onLogin,lang,initialMode="login"}){
  const[mode,setMode]=useState(initialMode);
  const[f,setF]=useState({name:"",email:"",password:""});
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(false);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const lbl=(ja,en)=>lang==="en"?en:ja;

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setErr("");setLoading(true);
    try{
      const url=mode==="login"?"/api/login":"/api/register";
      const body=mode==="login"?{email:f.email,password:f.password}:{name:f.name,email:f.email,password:f.password};
      const res=await authFetch(url,{method:"POST",body:JSON.stringify(body)});
      const data=await res.json();
      if(!res.ok){
        const msg=data.errors?Object.values(data.errors).flat().join(" "):(data.message||"");
        setErr(msg||lbl("エラーが発生しました","An error occurred"));
      }else{
        onLogin(data.user);
        onClose();
      }
    }catch{setErr(lbl("通信エラー","Network error"));}
    setLoading(false);
  };

  const inputStyle={width:"100%",padding:"11px 14px",border:"1px solid var(--rule)",borderRadius:6,
    fontFamily:"'DM Mono',monospace",fontSize:12,background:"var(--surface2)",color:"var(--ink)",outline:"none"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",
                 display:"flex",alignItems:"center",justifyContent:"center",zIndex:2100}}
         onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"var(--surface)",borderRadius:12,maxWidth:380,width:"90vw",
                boxShadow:"0 8px 32px rgba(0,0,0,.25)",overflow:"hidden"}}>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid var(--rule)"}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}}
              style={{flex:1,padding:"14px",border:"none",cursor:"pointer",
                      fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:mode===m?700:400,
                      background:mode===m?"var(--surface)":"var(--surface2)",
                      color:mode===m?"var(--teal)":"var(--muted)",
                      borderBottom:mode===m?"2px solid var(--teal)":"2px solid transparent",
                      transition:"all .15s"}}>
              {m==="login"?lbl("ログイン","Login"):lbl("新規登録","Register")}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{padding:"22px"}}>
          <h3 style={{fontFamily:"'Noto Serif JP',serif",fontSize:18,fontWeight:700,color:"var(--ink)",marginBottom:4}}>
            {mode==="login"?lbl(<><i className="fa-solid fa-mug-hot"></i> おかえりなさい</>,<><i className="fa-solid fa-mug-hot"></i> Welcome Back</>):lbl(<><i className="fa-solid fa-mug-hot"></i> はじめまして</>,<><i className="fa-solid fa-mug-hot"></i> Join Us</>)}
          </h3>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",marginBottom:18}}>
            {mode==="login"?lbl("メールとパスワードでログイン","Sign in with your email"):lbl("アカウントを作成してカフェを投稿","Create an account to post cafes")}
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
            {mode==="register"&&(
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:5}}>
                  <i className="fa-solid fa-user"></i> {lbl("名前","NAME")}
                </label>
                <input value={f.name} onChange={e=>u("name",e.target.value)} placeholder={lbl("あなたの名前","Your name")} required style={inputStyle}/>
              </div>
            )}
            <div>
              <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:5}}>
                <i className="fa-solid fa-envelope"></i> {lbl("メール","EMAIL")}
              </label>
              <input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@example.com" required style={inputStyle}/>
            </div>
            <div>
              <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:5}}>
                <i className="fa-solid fa-lock"></i> {lbl("パスワード","PASSWORD")}
              </label>
              <input type="password" value={f.password} onChange={e=>u("password",e.target.value)}
                placeholder={mode==="register"?lbl("6文字以上","Min 6 characters"):"••••••"} required minLength={6} style={inputStyle}/>
            </div>
          </div>
          {err&&<p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#E05A5A",marginBottom:12,padding:"8px 12px",background:"#FFF0F0",borderRadius:4}}>{err}</p>}
          <button type="submit" disabled={loading}
            style={{width:"100%",padding:"12px",background:"var(--teal)",color:"white",border:"none",
                    borderRadius:6,cursor:loading?"wait":"pointer",fontFamily:"'DM Mono',monospace",
                    fontSize:13,fontWeight:700,transition:"all .15s",opacity:loading?.7:1,
                    boxShadow:"0 0 0 3px rgba(42,191,191,.15)"}}>
            {loading?"...":(mode==="login"?lbl("ログイン","Login"):lbl("アカウント作成","Create Account"))}
          </button>
          
          <div style={{marginTop:16,textAlign:"center"}}>
            <button type="button" onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}} style={{background:"none",border:"none",color:"var(--teal)",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer",textDecoration:"underline"}}>
              {mode==="login" 
                ? lbl("アカウントをお持ちでない方はこちら（新規登録）", "Don't have an account? Register") 
                : lbl("既にアカウントをお持ちの方はこちら（ログイン）", "Already have an account? Login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── LocationPickerMap for AddCafeModal ── */
function LocationPickerMap({ lat, lng, onChange }) {
  const cebuITPark = [10.3290, 123.9061];
  
  function MapEvents() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      }
    });
    return null;
  }

  const pickerIcon = L.divIcon({
    className: 'custom-picker-icon',
    html: `
      <div style="
        width: 18px; 
        height: 18px; 
        background: #2ABFBF; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 8px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  return (
    <div style={{ height: 180, width: "100%", borderRadius: 6, overflow: "hidden", border: "1px solid var(--rule)", marginTop: 6, position: "relative" }}>
      <MapContainer
        center={cebuITPark}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapEvents />
        <Marker position={[lat, lng]} icon={pickerIcon} />
      </MapContainer>
    </div>
  );
}

/* ── AddCafeModal (Step Wizard + Photo Upload) ── */
const AddCafeModal = ({onClose,onAdd,lang,setAuthUser})=>{
  const[step,setStep]=useState(0);
  const[f,setF]=useState({
    name:"",area:"",desc:"",hours:"",wifi:"GOOD",outlet:"YES",price:"",vibe:"",
    photos:[],rawPhotos:[],lat:10.3290,lng:123.9061,
    specs: {
      atmosphere: lang === "en" ? "Quiet" : "落ち着いた",
      bgm: lang === "en" ? "Yes (Low)" : "あり（小さめ）",
      call: lang === "en" ? "Earphones recommended" : "イヤホン推奨",
      seats_total: 30,
      seat_types: lang === "en" ? ["Table"] : ["テーブル"],
      solo_seat: true,
      toilet: true,
      wifi_available: true,
      wifi_limit: "",
      cashless_available: true,
      outlet_detail: lang === "en" ? "Some seats" : "一部席のみ"
    }
  });
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const uSpecs=(k,v)=>setF(p=>({
    ...p,
    specs: {
      ...p.specs,
      [k]: v
    }
  }));
  const fileRef=useRef(null);
  const lbl=(ja,en)=>lang==="en"?en:ja;

  const handlePhoto=(e)=>{
    /* 
      【カフェ新規追加モーダルでの写真アップロード処理】
      - 最大3枚までの画像ファイルを選択し、プレビュー用にBase64データに変換（FileReader）して `f.photos` に格納します。
      - 元のファイルオブジェクトは `f.rawPhotos` に格納され、APIリクエスト時に FormData としてサーバーへ送信されます。
    */
    const files=Array.from(e.target.files||[]);
    if(files.length===0)return;
    
    const invalidFiles = files.filter(file => file.size > 3 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError(lang === "en" ? "Each photo must be under 3MB." : "画像のサイズは各3MB以下にしてください。");
      e.target.value = "";
      return;
    }
    setError("");

    const remaining=3-f.photos.length;
    const filesToUpload = files.slice(0,remaining);
    
    setF(p => ({
      ...p,
      rawPhotos: [...p.rawPhotos, ...filesToUpload].slice(0,3)
    }));

    filesToUpload.forEach(file=>{
      const reader=new FileReader();
      reader.onload=(ev)=>{
        setF(p=>({...p,photos:[...p.photos,ev.target.result].slice(0,3)}));
      };
      reader.readAsDataURL(file);
    });
    e.target.value="";
  };
  const removePhoto=(idx)=>setF(p=>({
    ...p,
    photos: p.photos.filter((_,i)=>i!==idx),
    rawPhotos: p.rawPhotos.filter((_,i)=>i!==idx)
  }));

  const submit=async()=>{
    if(!f.name.trim())return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", f.name);
      formData.append("area", f.area || "IT Park");
      formData.append("desc", f.desc || "");
      formData.append("tips", "");
      formData.append("hours", f.hours || "不明");
      formData.append("wifi", f.wifi);
      formData.append("outlet", f.outlet);
      formData.append("price", f.price || "₱???〜");
      formData.append("vibe", f.vibe || "");
      formData.append("lat", f.lat);
      formData.append("lng", f.lng);
      formData.append("specs", JSON.stringify(f.specs));

      f.rawPhotos.forEach((file) => {
        formData.append("photos[]", file);
      });

      const res = await authFetch("/api/cafes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        let errorList = data.errors ? Object.values(data.errors).flat() : [];
        if (lang === "ja") {
           errorList = errorList.map(m => {
             if (m.includes("greater than 3072")) return "画像サイズは各3MB以下にしてください。";
             if (m.includes("numeric")) return "位置情報（マップのピン）を正しく設定してください。";
             if (m.includes("required")) return "必須項目が入力されていません。";
             if (m.includes("The photos must not have more than 3 items")) return "画像は最大3枚までです。";
             return m;
           });
        }
        const msg = errorList.join("\n") || (data.message || lbl("エラーが発生しました", "An error occurred"));
        setError(msg);
      } else {
        onAdd(data.cafe);
        onClose();
        if (data.ranked_up && setAuthUser) {
          setAuthUser(prev => ({...prev, badge: data.new_badge}));
          const bName = data.new_badge.charAt(0).toUpperCase() + data.new_badge.slice(1);
          alert(lang === "en" ? `Rank Up! You are now a ${bName} Master!` : `ランクアップしました！\nあなたは ${bName} マスターになりました！`);
        }
      }
    } catch (err) {
      setError(lbl("通信エラーが発生しました", "Network error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const canNext=step===0?f.name.trim().length>0:true;
  const totalSteps=4;

  const inputStyle={width:"100%",padding:"10px 14px",border:"1px solid var(--rule)",borderRadius:6,
    fontFamily:"'DM Mono',monospace",fontSize:12,background:"var(--surface2)",color:"var(--ink)",
    transition:"border-color .2s",outline:"none"};

  const selBtn=(val,cur,setter)=>({
    padding:"8px 14px",border:val===cur?"2px solid var(--teal)":"1.5px solid var(--rule)",
    borderRadius:6,background:val===cur?"rgba(42,191,191,.1)":"var(--surface2)",
    color:val===cur?"var(--teal)":"var(--ink2)",cursor:"pointer",fontFamily:"'DM Mono',monospace",
    fontSize:11,fontWeight:val===cur?700:400,transition:"all .15s",flex:1,textAlign:"center"
  });

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",
                 display:"flex",alignItems:"center",justifyContent:"center",zIndex:2100}}
         onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"var(--surface)",borderRadius:12,maxWidth:440,width:"92vw",
                boxShadow:"0 8px 32px rgba(0,0,0,.25)",maxHeight:"88vh",overflow:"hidden",
                display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{padding:"20px 22px 0",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <h3 style={{fontFamily:"'Noto Serif JP',serif",fontSize:18,fontWeight:700,color:"var(--ink)",margin:0}}>
              <i className="fa-solid fa-mug-hot"></i> {lbl("カフェを投稿","Post a Cafe")}
            </h3>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,color:"var(--muted)",
                    cursor:"pointer",padding:4,lineHeight:1}}>✕</button>
          </div>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",marginBottom:14}}>
            {lbl("みんなにシェアしよう！","Share with everyone!")} — {lbl(`ステップ ${step+1}/${totalSteps}`,`Step ${step+1}/${totalSteps}`)}
          </p>
          {/* Progress bar */}
          <div style={{display:"flex",gap:4,marginBottom:16}}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?"var(--teal)":"var(--rule)",transition:"background .3s"}}/>
            ))}
          </div>
        </div>

        {/* Body - scrollable */}
        <div style={{padding:"0 22px 20px",overflowY:"auto",flex:1}}>
          {error&&<p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#E05A5A",marginBottom:12,padding:"8px 12px",background:"#FFF0F0",borderRadius:4}}>{error}</p>}

          {/* ── Step 0: 基本情報 + 写真 ── */}
          {step===0&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                  <i className="fa-solid fa-note-sticky"></i> {lbl("カフェ名","CAFE NAME")} <span style={{color:"#E05A5A"}}>*</span>
                </label>
                <input value={f.name} onChange={e=>u("name",e.target.value)}
                  placeholder={lbl("カフェの名前を入力...","Enter cafe name...")}
                  style={{...inputStyle,fontSize:14,fontWeight:600,fontFamily:"'Noto Serif JP',serif"}}/>
              </div>
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                  <i className="fa-solid fa-location-dot"></i> {lbl("エリア","AREA")}
                </label>
                <input value={f.area} onChange={e=>u("area",e.target.value)}
                  placeholder={lbl("例: IT Park内, Lahug...","e.g. Inside IT Park, Lahug...")}
                  style={inputStyle}/>
              </div>
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                  <i className="fa-regular fa-comment-dots"></i> {lbl("おすすめポイント","WHAT'S GREAT?")}
                </label>
                <textarea value={f.desc} onChange={e=>u("desc",e.target.value)} rows={2}
                  placeholder={lbl("このカフェの好きなところを教えてください！","What do you love about this cafe?")}
                  style={{...inputStyle,resize:"vertical",lineHeight:1.6}}/>
              </div>
              {/* 写真アップロード */}
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                  <i className="fa-solid fa-camera"></i> {lbl("店内の写真","PHOTOS")} <span style={{fontSize:8,color:"var(--muted)"}}>{lbl("最大3枚","max 3")}</span>
                </label>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhoto}
                  style={{display:"none"}}/>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {f.photos.map((src,i)=>(
                    <div key={i} style={{position:"relative",width:80,height:60,borderRadius:6,overflow:"hidden",
                                         border:"1px solid var(--rule)"}}>
                      <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <button onClick={()=>removePhoto(i)}
                        style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",
                                background:"rgba(0,0,0,.6)",border:"none",color:"white",fontSize:10,
                                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  ))}
                  {f.photos.length<3&&(
                    <button onClick={()=>fileRef.current?.click()}
                      style={{width:80,height:60,borderRadius:6,border:"2px dashed var(--rule)",
                              background:"var(--surface2)",cursor:"pointer",display:"flex",flexDirection:"column",
                              alignItems:"center",justifyContent:"center",gap:2,transition:"border-color .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="var(--teal)"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="var(--rule)"}>
                      <span style={{fontSize:18,color:"var(--muted)"}}>+</span>
                      <span style={{fontSize:7,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>{lbl("追加","Add")}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: スペック ── */}
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:8}}>
                  <i className="fa-solid fa-wifi"></i> Wi-Fi
                </label>
                <div style={{display:"flex",gap:6}}>
                  {["EXCELLENT","GOOD","AVERAGE","NOT_EXIST"].map(v=>(
                    <button key={v} onClick={()=>u("wifi",v)} style={selBtn(v,f.wifi)}>
                      {v==="EXCELLENT"?<><i className="fa-solid fa-bolt"></i></>:v==="GOOD"?<><i className="fa-solid fa-thumbs-up"></i></>:v==="AVERAGE"?<><i className="fa-solid fa-hand-holding-heart"></i></>:<><i className="fa-solid fa-ban"></i></>} {v==="NOT_EXIST"?"NONE":v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:8}}>
                  <i className="fa-solid fa-plug"></i> {lbl("電源","OUTLET")}
                </label>
                <div style={{display:"flex",gap:6}}>
                  {["YES","LIMITED","NO"].map(v=>(
                    <button key={v} onClick={()=>u("outlet",v)} style={selBtn(v,f.outlet)}>
                      {v==="YES"?<><i className="fa-solid fa-check-circle"></i></>:v==="LIMITED"?<><i className="fa-solid fa-triangle-exclamation"></i></>:<><i className="fa-solid fa-xmark"></i></>} {v}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                    <i className="fa-regular fa-clock"></i> {lbl("営業時間","HOURS")}
                  </label>
                  <input value={f.hours} onChange={e=>u("hours",e.target.value)} placeholder="8:00–22:00" style={inputStyle}/>
                </div>
                <div>
                  <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                    <i className="fa-solid fa-coins"></i> {lbl("予算","PRICE")}
                  </label>
                  <input value={f.price} onChange={e=>u("price",e.target.value)} placeholder="₱150〜" style={inputStyle}/>
                </div>
              </div>
              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                  # {lbl("ハッシュタグ","HASHTAGS")}
                </label>
                <input value={f.vibe} onChange={e=>u("vibe",e.target.value)}
                  placeholder={lbl("#静か #穴場 #おしゃれ","#Quiet #Hidden #Stylish")} style={inputStyle}/>
              </div>

              <div>
                <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px",display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                  <i className="fa-solid fa-location-dot"></i> {lbl("位置情報（マップをクリックしてピンを配置）","LOCATION (Click map to drop pin)")}
                </label>
                <LocationPickerMap lat={f.lat} lng={f.lng} onChange={(lat,lng)=>{
                  u("lat",lat);
                  u("lng",lng);
                }}/>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"var(--muted)",marginTop:4}}>
                  {lbl(`緯度: ${f.lat.toFixed(6)}, 経度: ${f.lng.toFixed(6)}`, `Lat: ${f.lat.toFixed(6)}, Lng: ${f.lng.toFixed(6)}`)}
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: 詳細スペック ── */}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* カテゴリ: 環境 */}
              <div style={{borderBottom:"1px solid var(--rule)",paddingBottom:12}}>
                <h4 style={{fontSize:11,color:"var(--teal)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:10}}>
                  <i className="fa-solid fa-leaf"></i> {lbl("環境","ENVIRONMENT")}
                </h4>
                
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div>
                    <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                      {lbl("雰囲気","VIBE")}
                    </label>
                    <div style={{display:"flex",gap:6}}>
                      {(lang==="en"?["Quiet","Chic","Lively"]:["落ち着いた","おしゃれ","にぎやか"]).map(v=>(
                        <button key={v} type="button" onClick={()=>uSpecs("atmosphere",v)} style={selBtn(v,f.specs.atmosphere)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                      BGM
                    </label>
                    <div style={{display:"flex",gap:6}}>
                      {(lang==="en"?["Yes (Low)","Yes (Loud)","None"]:["あり（小さめ）","あり（大きめ）","なし"]).map(v=>(
                        <button key={v} type="button" onClick={()=>uSpecs("bgm",v)} style={selBtn(v,f.specs.bgm)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                      {lbl("通話","CALLS")}
                    </label>
                    <div style={{display:"flex",gap:6}}>
                      {(lang==="en"?["Earphones recommended","Allowed","Not allowed"]:["イヤホン推奨","OK","不可"]).map(v=>(
                        <button key={v} type="button" onClick={()=>uSpecs("call",v)} style={selBtn(v,f.specs.call)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* カテゴリ: 席 */}
              <div style={{borderBottom:"1px solid var(--rule)",paddingBottom:12}}>
                <h4 style={{fontSize:11,color:"var(--teal)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:10}}>
                  <i className="fa-solid fa-chair"></i> {lbl("席","SEATING")}
                </h4>
                
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                        {lbl("総席数","TOTAL SEATS")}
                      </label>
                      <input type="number" min="1" value={f.specs.seats_total} onChange={e=>uSpecs("seats_total",parseInt(e.target.value)||0)} style={inputStyle}/>
                    </div>
                    <div>
                      <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                        {lbl("一人席","SOLO SEAT")}
                      </label>
                      <div style={{display:"flex",gap:6}}>
                        {[true,false].map(v=>(
                          <button key={String(v)} type="button" onClick={()=>uSpecs("solo_seat",v)} style={selBtn(v,f.specs.solo_seat)}>
                            {v?(lang==="en"?"Yes":"あり"):(lang==="en"?"No":"なし")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                      {lbl("席タイプ (複数選択可)","SEAT TYPES (Multiple)")}
                    </label>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {(lang==="en"?["Counter","Table","Sofa","Terrace"]:["カウンター","テーブル","ソファ","テラス"]).map(v=>{
                        const seatTypes = f.specs.seat_types || [];
                        const has = seatTypes.includes(v);
                        const toggleSeat=()=>{
                          if(has){
                            uSpecs("seat_types", seatTypes.filter(x=>x!==v));
                          }else{
                            uSpecs("seat_types", [...seatTypes, v]);
                          }
                        };
                        return (
                          <button key={v} type="button" onClick={toggleSeat} style={selBtn(has, true)}>
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* カテゴリ: 設備 */}
              <div>
                <h4 style={{fontSize:11,color:"var(--teal)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:10}}>
                  <i className="fa-solid fa-screwdriver-wrench"></i> {lbl("設備","FACILITIES")}
                </h4>
                
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                        {lbl("トイレ","RESTROOM")}
                      </label>
                      <div style={{display:"flex",gap:6}}>
                        {[true,false].map(v=>(
                          <button key={String(v)} type="button" onClick={()=>uSpecs("toilet",v)} style={selBtn(v,f.specs.toilet)}>
                            {v?(lang==="en"?"Yes":"あり"):(lang==="en"?"No":"なし")}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                        Wi-Fi
                      </label>
                      <div style={{display:"flex",gap:6}}>
                        {[true,false].map(v=>(
                          <button key={String(v)} type="button" onClick={()=>uSpecs("wifi_available",v)} style={selBtn(v,f.specs.wifi_available)}>
                            {v?(lang==="en"?"Yes":"あり"):(lang==="en"?"No":"なし")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                        {lbl("Wi-Fi利用制限","WIFI LIMIT")}
                      </label>
                      <input type="text" value={f.specs.wifi_limit||""} onChange={e=>uSpecs("wifi_limit",e.target.value)} placeholder={lbl("例: 120分, なし","e.g., 120min, None")} style={{width:"100%",padding:"7px 10px",border:"1px solid var(--rule)",borderRadius:6,background:"var(--surface2)",color:"var(--ink)",fontFamily:"'DM Mono',monospace",fontSize:11,outline:"none"}}/>
                    </div>
                    <div>
                      <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                        {lbl("キャッシュレス","CASHLESS")}
                      </label>
                      <div style={{display:"flex",gap:6}}>
                        {[true,false].map(v=>(
                          <button key={String(v)} type="button" onClick={()=>uSpecs("cashless_available",v)} style={selBtn(v,f.specs.cashless_available)}>
                            {v?(lang==="en"?"Yes":"利用可"):(lang==="en"?"No":"不可")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px",display:"block",marginBottom:4}}>
                      {lbl("コンセント詳細","OUTLETS DETAIL")}
                    </label>
                    <div style={{display:"flex",gap:6}}>
                      {(lang==="en"?["All seats","Some seats","None"]:["全席対応","一部席のみ","なし"]).map(v=>(
                        <button key={v} type="button" onClick={()=>uSpecs("outlet_detail",v)} style={selBtn(v,f.specs.outlet_detail)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: プレビュー ── */}
          {step===3&&(
            <div>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--teal)",letterSpacing:"1px",marginBottom:12}}>
                {lbl(<><i className="fa-solid fa-check-circle"></i> 内容を確認してください</>,<><i className="fa-solid fa-check-circle"></i> REVIEW YOUR SUBMISSION</>)}
              </p>
              <div style={{border:"1px solid var(--rule)",borderRadius:8,overflow:"hidden",marginBottom:12}}>
                {f.photos.length>0?(
                  <div style={{display:"flex",height:100,gap:1}}>
                    {f.photos.map((src,i)=>(
                      <div key={i} style={{flex:1,overflow:"hidden"}}>
                        <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{height:60,background:"linear-gradient(135deg,#888,#aaa)",display:"flex",
                               alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:10,color:"rgba(255,255,255,.7)",fontFamily:"'DM Mono',monospace"}}>
                      {lbl("写真なし","No photos")}
                    </span>
                  </div>
                )}
                <div style={{padding:"12px 14px"}}>
                  <h4 style={{fontFamily:"'Noto Serif JP',serif",fontSize:15,fontWeight:700,color:"var(--ink)",marginBottom:2}}>{f.name}</h4>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",marginBottom:6}}><i className="fa-solid fa-location-dot"></i> {f.area||"IT Park"}</p>
                  {f.desc&&<p style={{fontFamily:"'Noto Serif JP',serif",fontSize:11,color:"var(--ink2)",lineHeight:1.6,marginBottom:8}}>{f.desc}</p>}
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                    <span style={{fontSize:8,padding:"2px 6px",borderRadius:2,background:"#E3F2FD",color:"#1565C0",fontFamily:"'DM Mono',monospace"}}><i className="fa-solid fa-wifi"></i> {f.wifi}</span>
                    <span style={{fontSize:8,padding:"2px 6px",borderRadius:2,background:"var(--surface2)",color:"var(--ink2)",fontFamily:"'DM Mono',monospace"}}><i className="fa-solid fa-plug"></i> {f.outlet}</span>
                    {f.hours&&<span style={{fontSize:8,padding:"2px 6px",borderRadius:2,background:"var(--surface2)",color:"var(--ink2)",fontFamily:"'DM Mono',monospace"}}><i className="fa-regular fa-clock"></i> {f.hours}</span>}
                    {f.price&&<span style={{fontSize:8,padding:"2px 6px",borderRadius:2,background:"var(--surface2)",color:"var(--ink2)",fontFamily:"'DM Mono',monospace"}}><i className="fa-solid fa-coins"></i> {f.price}</span>}
                  </div>
                  
                  {/* Detailed Specs in Preview */}
                  <div style={{borderTop:"1px dashed var(--rule)",marginTop:10,paddingTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 12px"}}>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-leaf"></i> {lbl("雰囲気","Vibe")}: <strong style={{color:"var(--ink2)"}}>{f.specs.atmosphere}</strong>
                    </span>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-music"></i> BGM: <strong style={{color:"var(--ink2)"}}>{f.specs.bgm}</strong>
                    </span>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-phone"></i> {lbl("通話","Calls")}: <strong style={{color:"var(--ink2)"}}>{f.specs.call}</strong>
                    </span>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-chair"></i> {lbl("総席数","Seats")}: <strong style={{color:"var(--ink2)"}}>{f.specs.seats_total}</strong>
                    </span>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-plug"></i> {lbl("コンセント","Outlet")}: <strong style={{color:"var(--ink2)"}}>{f.specs.outlet_detail}</strong>
                    </span>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-wifi"></i> Wi-Fi: <strong style={{color:"var(--ink2)"}}>{f.specs.wifi_available?(lang==="en"?"Yes":"あり"):(lang==="en"?"No":"なし")}{f.specs.wifi_limit?` (${f.specs.wifi_limit})`:""}</strong>
                    </span>
                    <span style={{fontSize:9,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}>
                      <i className="fa-solid fa-credit-card"></i> {lbl("キャッシュレス","Cashless")}: <strong style={{color:"var(--ink2)"}}>{f.specs.cashless_available?(lang==="en"?"Yes":"利用可"):(lang==="en"?"No":"不可")}</strong>
                    </span>
                  </div>

                  {f.vibe&&<p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--teal)",marginTop:6}}>{f.vibe}</p>}

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{padding:"0 22px 18px",display:"flex",gap:8,flexShrink:0}}>
          {step>0&&(
            <button onClick={()=>setStep(s=>s-1)} disabled={loading}
              style={{padding:"11px 16px",background:"var(--surface2)",color:"var(--ink2)",
                      border:"1px solid var(--rule)",borderRadius:6,cursor:"pointer",
                      fontFamily:"'DM Mono',monospace",fontSize:12,opacity:loading?0.5:1}}>
              ← {lbl("戻る","Back")}
            </button>
          )}
          {step<3?(
            <button onClick={()=>canNext&&setStep(s=>s+1)}
              style={{flex:1,padding:"11px",background:canNext?"var(--teal)":"var(--rule)",
                      color:canNext?"white":"var(--muted)",border:"none",borderRadius:6,
                      cursor:canNext?"pointer":"default",fontFamily:"'DM Mono',monospace",
                      fontSize:12,fontWeight:700,transition:"all .15s"}}>
              {lbl("次へ →","Next →")}
            </button>
          ):(
            <button onClick={submit} disabled={loading}
              style={{flex:1,padding:"11px",background:"var(--teal)",color:"white",border:"none",
                      borderRadius:6,cursor:loading?"wait":"pointer",fontFamily:"'DM Mono',monospace",
                      fontSize:13,fontWeight:700,transition:"all .15s",opacity:loading?0.7:1,
                      boxShadow:"0 0 0 3px rgba(42,191,191,.2)"}}>
              {loading ? lbl("投稿中...","Posting...") : lbl(<><i className="fa-solid fa-rocket"></i> 投稿する！</>,"Post it!")}
            </button>
          )}
          {step===0&&(
            <button onClick={onClose} disabled={loading}
              style={{padding:"11px 16px",background:"var(--rule)",color:"var(--ink2)",
                      border:"none",borderRadius:6,cursor:"pointer",
                      fontFamily:"'DM Mono',monospace",fontSize:12,opacity:loading?0.5:1}}>
              {lbl("やめる","Cancel")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const getWifiLabel = (level, l) => {
  if (l === "en") {
    if (level === "EXCELLENT") return "Very Fast";
    if (level === "GOOD") return "Good";
    if (level === "AVERAGE") return "Average";
    if (level === "NOT_EXIST") return "No WiFi";
    return "None";
  } else {
    if (level === "EXCELLENT") return "爆速";
    if (level === "GOOD") return "普通";
    if (level === "AVERAGE") return "弱め";
    if (level === "NOT_EXIST") return "なし";
    return "なし";
  }
};

const getOutletLabel = (level, l) => {
  if (l === "en") {
    if (level === "YES") return "Plenty";
    if (level === "LIMITED") return "Limited";
    return "None";
  } else {
    if (level === "YES") return "十分";
    if (level === "LIMITED") return "少なめ";
    return "なし";
  }
};

function CafeCard({cafe,index,favorites,toggleFav,expandedId,setExpandedId,lang,authUser,onShowAuth,setAuthUser,reviewCounts,onRefreshCounts}){
  const t=lang==="en"?T.en:T.ja;
  const open=isOpen(cafe),isFav=favorites.includes(cafe.id),isExp=expandedId===cafe.id;
  const heartRef=useRef(null);
  const cardRef=useRef(null);

  useEffect(() => {
    if (isExp && cardRef.current) {
      setTimeout(() => {
        const y = cardRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
        cardRef.current.focus({ preventScroll: true });
      }, 150);
    }
  }, [isExp]);

  const handleFav=e=>{
    e.stopPropagation();toggleFav(cafe.id);
    heartRef.current?.classList.remove("heart-pop");
    void heartRef.current?.offsetWidth;
    heartRef.current?.classList.add("heart-pop");
  };

  const reviewData = reviewCounts?.[cafe.id];
  const count = reviewData?.count || 0;
  const avg = reviewData?.avg_rating ? parseFloat(reviewData.avg_rating).toFixed(1) : null;
  const hasReviews = count > 0 && avg;
  const displayAvg = avg ? avg : "0.0";
  const displayCount = count;

  return(
    <article ref={cardRef} className="fade-up" tabIndex={isExp ? 0 : -1}
      style={{animationDelay:`${index*.07}s`,background:"var(--surface)",
              border:`3px solid ${cafe.accent}`,
              borderRadius:24,boxShadow:"var(--card-shadow)",overflow:"hidden",
              outline: "none"}}>
      {!isExp ? (
        <>
          <div style={{position: "relative"}}>
            <div onClick={()=>setExpandedId(cafe.id)} style={{cursor:"pointer"}}>
              <PhotoSlider cafe={cafe} expanded={false} lang={lang}/>
            </div>
            <button ref={heartRef} onClick={handleFav}
              style={{position: "absolute", top: 12, right: 12, zIndex: 10,
                      background: "rgba(255,255,255,0.9)", border: "none",
                      borderRadius: "50%", width: 32, height: 32,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: 18, color: isFav ? "#E05A5A" : "#888",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)", transition: "all .15s"}}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
              {isFav ? <><i className="fa-solid fa-heart"></i></> : <><i className="fa-regular fa-heart"></i></>}
            </button>
          </div>
          <div onClick={()=>setExpandedId(cafe.id)} style={{padding:"20px 24px 24px",cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
              <h2 style={{
                fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--ink)",
                letterSpacing: "-0.5px",
                lineHeight: 1.25,
                margin: 0
              }}>{cafe.name}</h2>
              <div style={{display: "flex", alignItems: "center", gap: 6, flexShrink: 0, paddingTop: 4}}>
                {hasReviews ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C68B2C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", transform: "translateY(-1px)"}}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span style={{fontWeight: 800, fontSize: 16, color: "var(--ink)"}}>{avg}</span>
                    <span style={{color: "var(--teal)", fontSize: 14, fontWeight: 600}}>({count})</span>
                  </>
                ) : (
                  <span style={{fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace",
                                padding: "3px 8px", background: "var(--surface2)", borderRadius: 4,
                                border: "1px solid var(--rule)"}}>
                    {lang === "en" ? "No reviews" : "レビューなし"}
                  </span>
                )}
              </div>
            </div>
            <p style={{
              fontFamily: "Inter, 'Noto Sans JP', sans-serif",
              fontSize: 14,
              color: "var(--muted)",
              marginTop: 6,
              marginBottom: 16
            }}>
              {lang === "en" ? (cafe.area_en || "IT Park") : (cafe.area_ja || "IT Park")} · Lahug
            </p>
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              {(() => {
                const statusInfo = getStatus(cafe.hours, cafe.is24h || cafe.is_24h, lang);
                const isOpenStatus = statusInfo.status === "open" || statusInfo.status === "closing";
                const isClosing = statusInfo.status === "closing";
                return (
                  <span style={{
                    fontSize: 12,
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontWeight: 600,
                    background: isOpenStatus ? (isClosing ? "#FFE0B2" : "#E8F5E9") : "#FFEBEE",
                    color: isOpenStatus ? (isClosing ? "#E65100" : "#2E7D32") : "#C62828",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                    <span style={{color: isOpenStatus ? (isClosing ? "#FF9800" : "#4CAF50") : "#F44336", fontSize: 10, marginRight: 2}}><i className="fa-solid fa-circle"></i></span>
                    {statusInfo.text}
                  </span>
                );
              })()}
              <span style={{fontSize: 14, color: "var(--ink)", fontWeight: 500}}>
                {cafe.hours}
              </span>
              <span style={{marginLeft: "auto", fontSize: 17, fontWeight: 700, color: "var(--ink)"}}>
                {cafe.price}
              </span>
            </div>
            <hr style={{border: "none", borderTop: "1px solid var(--rule)", margin: "16px 0 16px"}} />
            <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
              {cafe.tags && cafe.tags.map(tg => (
                <span key={tg} style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 8,
                  background: "var(--surface2)", color: "var(--teal)",
                  border: "1.5px solid var(--rule)", fontWeight: 600,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  #{tg}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setExpandedId(null)} style={{padding: "20px 24px 16px", cursor: "pointer", position: "relative", borderBottom: "1px solid var(--rule)"}}>
            {/* Close Button / Chevron */}
            <div style={{position: "absolute", top: 20, right: 24, display: "flex", alignItems: "center", gap: 12}}>
              <button ref={heartRef} onClick={handleFav}
                style={{background: "none", border: "none", cursor: "pointer", fontSize: 24,
                        color: isFav ? "#E05A5A" : "var(--rule)", padding: 0, transition: "transform .15s"}}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                {isFav ? <><i className="fa-solid fa-heart"></i></> : <><i className="fa-regular fa-heart"></i></>}
              </button>
              <div style={{width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--rule)"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </div>
            </div>
            
            <div style={{paddingRight: 64}}>
              {/* Tags */}
              <div style={{display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6}}>
                {(lang === "en" ? cafe.vibe_en : cafe.vibe_ja).split(/\s+/).map((tag, idx) => tag && (
                  <span key={idx} style={{fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--teal)", fontWeight: 600}}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Name */}
              <h2 style={{
                fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                fontSize: 24,
                fontWeight: 800,
                color: "var(--ink)",
                letterSpacing: "-0.5px",
                lineHeight: 1.25,
                margin: 0
              }}>{cafe.name}</h2>
              <p style={{
                fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                fontSize: 13,
                color: "var(--muted)",
                marginTop: 4,
                marginBottom: 0
              }}>
                {lang === "en" ? (cafe.area_en || "IT Park") : (cafe.area_ja || "IT Park")} · Lahug
              </p>

              {/* Badge Row */}
              <div style={{display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12}} onClick={e => e.stopPropagation()}>
                {/* 1. 営業状況 */}
                {(() => {
                  const statusInfo = getStatus(cafe.hours, cafe.is24h || cafe.is_24h, lang);
                  const isOpenStatus = statusInfo.status === "open" || statusInfo.status === "closing";
                  const isClosing = statusInfo.status === "closing";
                  
                  // Premium color configurations
                  const bg = isOpenStatus ? (isClosing ? "#FFE0B2" : "#E1F5EE") : "#FFEBEE";
                  const border = isOpenStatus ? (isClosing ? "1px solid #FF9800" : "1px solid #0F6E56") : "1px solid #EF5350";
                  const textCol = isOpenStatus ? (isClosing ? "#E65100" : "#085041") : "#C62828";
                  const dotBg = isOpenStatus ? (isClosing ? "#FF9800" : "#0F6E56") : "#F44336";

                  return (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                      background: bg,
                      border: border,
                      color: textCol
                    }}>
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: dotBg,
                        display: "inline-block"
                      }} />
                      {statusInfo.text}
                    </span>
                  );
                })()}

                {/* 2. WiFi */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                  background: "var(--surface2)",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--muted)"}}>
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3.5" />
                  </svg>
                  WiFi: {getWifiLabel(cafe.wifi, lang)}
                  {cafe.specs?.wifi_limit ? <span style={{fontSize: 11, color: "var(--muted)", marginLeft: 2}}>({cafe.specs.wifi_limit})</span> : ""}
                </span>

                {cafe.specs?.cashless_available !== undefined && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                    background: "var(--surface2)",
                    border: "1px solid var(--rule)",
                    color: "var(--ink)"
                  }}>
                    <i className="fa-solid fa-credit-card"></i> {lang === "en" ? "Cashless" : "キャッシュレス"}: <span style={{color: cafe.specs.cashless_available ? "var(--teal)" : "var(--muted)"}}>{cafe.specs.cashless_available ? (lang === "en" ? "OK" : "可") : (lang === "en" ? "No" : "不可")}</span>
                  </span>
                )}

                {/* 3. コンセント */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                  background: "var(--surface2)",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--muted)"}}>
                    <rect x="5" y="2" width="14" height="14" rx="2" ry="2" />
                    <line x1="9" y1="22" x2="9" y2="16" />
                    <line x1="15" y1="22" x2="15" y2="16" />
                    <line x1="12" y1="2" x2="12" y2="5" />
                  </svg>
                  {lang === "en" ? "Plug" : "コンセント"}: {getOutletLabel(cafe.outlet, lang)}
                </span>

                {/* 4. 価格帯 */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                  background: "var(--surface2)",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)"
                }}>
                  <span style={{color: "var(--muted)", fontWeight: 700}}>₱</span>
                  {cafe.price}
                </span>

                {/* 5. 評価 */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                  background: "var(--surface2)",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF9F27" stroke="#EF9F27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{displayAvg}</span>
                  <span style={{fontSize: 11, color: "var(--teal)", fontWeight: 600}}>({displayCount})</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{borderTop:"1px solid var(--rule)",animation:"fadeUp .25s ease"}}>
            {/* Photo Area */}
            <div style={{padding:"24px 24px 0"}}>
              <PhotoSlider cafe={cafe} expanded={true} lang={lang}/>
            </div>

            {/* Description & Basic Info */}
            <div style={{padding:"20px 24px 20px", borderBottom:"1px solid var(--rule)"}}>
              <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:14,fontWeight:300,color:"var(--ink)",lineHeight:2.0,marginBottom:20}}>
                {lang==="en"?cafe.desc_en:cafe.desc_ja}
              </p>
              
              {/* Basic Info Grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"16px 24px"}}>
                <div>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"1.5px",color:"var(--muted)",textTransform:"uppercase",marginBottom:4}}>
                    {lang==="en"?"RECOMMEND":"おすすめ"}
                  </p>
                  <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:13,color:"var(--ink)",fontWeight:500,lineHeight:1.6}}>
                    <i className="fa-solid fa-mug-hot"></i> {lang==="en"?cafe.menu_en:cafe.menu_ja}
                  </p>
                </div>
                <div>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"1.5px",color:"var(--muted)",textTransform:"uppercase",marginBottom:4}}>
                    {lang==="en"?"SEATS":"席数"}
                  </p>
                  <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:13,color:"var(--ink)",fontWeight:500,lineHeight:1.6}}>
                    <i className="fa-solid fa-chair"></i> {lang==="en"?cafe.seats_en:cafe.seats_ja}
                  </p>
                </div>
                <div>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"1.5px",color:"var(--muted)",textTransform:"uppercase",marginBottom:4}}>
                    {lang==="en"?"AMBIANCE":"雰囲気"}
                  </p>
                  <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:13,color:"var(--ink)",fontWeight:500,lineHeight:1.6}}>
                    <i className="fa-solid fa-volume-high"></i> {lang==="en"?cafe.noise_en:cafe.noise_ja}
                  </p>
                </div>
                <div>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"1.5px",color:"var(--muted)",textTransform:"uppercase",marginBottom:4}}>
                    {lang==="en"?"BEST FOR":"こんな時に"}
                  </p>
                  <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:13,color:"var(--ink)",fontWeight:500,lineHeight:1.6}}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i> {lang==="en"?cafe.best_en:cafe.best_ja}
                  </p>
                </div>
              </div>

              <TipsToggle cafe={cafe} lang={lang} />
            </div>

            {/* Two-Column Specs & Actions Layout */}
            <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"24px",padding:"24px"}}>
              {/* Left Column: Specs Dropdown */}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <SpecsDropdown cafe={cafe} lang={lang}/>
                <div style={{
                  background: "var(--surface)",
                  border: "1px solid var(--rule)",
                  borderRadius: 12,
                  height: 48,
                  padding: "0 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  boxSizing: "border-box"
                }}>
                  <span style={{
                    fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--ink2)"
                  }}>
                    {lang === "en" ? "Overall Rating" : "総合評価"}
                  </span>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <StarDisplay value={parseFloat(displayAvg)} size={16} fill="#EF9F27" empty="var(--muted)"/>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--ink)"
                    }}>
                      {displayAvg}
                    </span>
                    <span style={{
                      fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                      fontSize: 11,
                      color: "var(--teal)",
                      fontWeight: 600
                    }}>
                      ({displayCount}{lang === "en" ? " reviews" : "件"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions Sidebar */}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <ShareLinksDropdown cafe={cafe} lang={lang}/>
                
                <button onClick={handleFav}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    height: 48,
                    padding: 0,
                    border: "1px solid transparent",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontFamily: "Inter, 'Noto Sans JP', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    background: isFav ? "#E05A5A" : "var(--ink)",
                    color: "white",
                    transition: "all .15s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    boxSizing: "border-box"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                  {isFav ? t.savedFav : t.saveFav}
                </button>
              </div>
            </div>

            {/* Review Panel */}
            <ReviewPanel cafeId={cafe.id} lang={lang} authUser={authUser} onShowAuth={onShowAuth} onClose={()=>setExpandedId(null)} onRefreshCounts={onRefreshCounts} setAuthUser={setAuthUser} />
            
            <div style={{padding: "0 24px 24px"}}>
              <CrowdStatusReport cafe={cafe} lang={lang} authUser={authUser} onShowAuth={onShowAuth} setAuthUser={setAuthUser} />
            </div>
          </div>
        </>
      )}
    </article>
  );
}

/* ── Main ── */
export default function CafeFinderV8(){
  const init=readURL();
  const[lang,setLang]=useState(init.lang);
  const[dark,setDark]=useState(init.dark);
  const[search,setSearch]=useState(init.q);
  const[activeTag,setActiveTag]=useState(init.tag);
  const[showOpen,setShowOpen]=useState(init.open);
  const[viewMode,setViewMode]=useState("list");
  const[expandedId,setExpandedId]=useState(null);
  const[showFavs,setShowFavs]=useState(false);
  const[showQuiz,setShowQuiz]=useState(false);
  const[showMenu,setShowMenu]=useState(false);
  const[shareCopied,setShareCopied]=useState(false);
  const[showAddCafe,setShowAddCafe]=useState(false);
  const[showAuth,setShowAuth]=useState(null);
  const[authUser,setAuthUser]=useState(null);
  const[cafes,setCafes]=useState([]);
  const[loadingCafes,setLoadingCafes]=useState(true);
  const[favorites,setFavorites]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("itpark_favs_v8")||"[]");}catch{return[];}
  });
  const t=lang==="en"?T.en:T.ja;
  const allCafes=cafes;
  const selectedCafe=allCafes.find(c=>c.id===expandedId);
  const[reviewCounts,setReviewCounts]=useState({});

  const fetchCafes=useCallback(()=>{
    setLoadingCafes(true);
    fetch("/api/cafes")
      .then(r=>r.json())
      .then(d=>{
        if(d.cafes) setCafes(d.cafes);
      })
      .catch(()=>{})
      .finally(()=>setLoadingCafes(false));
  },[]);

  // レビュー件数一括取得
  const fetchReviewCounts=useCallback(()=>{
    fetch("/api/review-counts").then(r=>r.json()).then(d=>setReviewCounts(d.counts||{})).catch(()=>{});
  },[]);

  // 認証チェック + カフェデータ + レビュー件数取得
  useEffect(()=>{
    authFetch("/api/user").then(r=>r.json()).then(d=>{if(d.user)setAuthUser(d.user);}).catch(()=>{});
    fetchCafes();
    fetchReviewCounts();
  },[fetchCafes, fetchReviewCounts]);

  const handleLogout=async()=>{
    await authFetch("/api/logout",{method:"POST"});
    setAuthUser(null);
  };

  const handleAddClick=()=>{
    if(authUser){setShowAddCafe(true);}
    else{setShowAuth("register");}
  };

  const handleHomeClick=()=>{
    setSearch("");
    setActiveTag("");
    setShowOpen(false);
    setViewMode("list");
    setExpandedId(null);
    setShowFavs(false);
  };

  useEffect(()=>{document.documentElement.setAttribute("data-theme",dark?"dark":"light");},[dark]);
  useEffect(()=>{writeURL({tag:activeTag,open:showOpen,q:search,lang,dark});},[activeTag,showOpen,search,lang,dark]);
  useEffect(()=>{
    if(!showMenu)return;
    const handler=(e)=>{
      if(!e.target.closest('[data-menu]'))setShowMenu(false);
    };
    document.addEventListener('mousedown',handler);
    return()=>document.removeEventListener('mousedown',handler);
  },[showMenu]);

  const toggleFav=useCallback(id=>{
    setFavorites(prev=>{
      const next=prev.includes(id)?prev.filter(f=>f!==id):[...prev,id];
      try{localStorage.setItem("itpark_favs_v8",JSON.stringify(next));}catch{}
      return next;
    });
  },[]);

  const handleShare=async()=>{
    const url=writeURL({tag:activeTag,open:showOpen,q:search,lang,dark});
    try{
      if(navigator.share)await navigator.share({title:t.title,url});
      else await navigator.clipboard.writeText(url);
    }catch{}
    setShareCopied(true);setTimeout(()=>setShareCopied(false),2000);
  };

  const handleMapSelect=cafe=>{
    setViewMode("list");setExpandedId(cafe.id);
    setTimeout(()=>document.getElementById(`card-${cafe.id}`)?.scrollIntoView({behavior:"smooth",block:"start"}),80);
  };
  const handleQuizSelect=cafe=>{
    setExpandedId(cafe.id);
    setTimeout(()=>document.getElementById(`card-${cafe.id}`)?.scrollIntoView({behavior:"smooth",block:"start"}),80);
  };

  const handleAddCafe=(newCafe)=>{
    setCafes(prev=>[...prev,newCafe]);
  };

  const TAGS=["作業向き","会話OK","24時間","大人数OK","キャッシュレス","レビュー順"];
  const filtered=allCafes.filter(c=>{
    if(showFavs&&!favorites.includes(c.id))return false;
    if(showOpen&&!isOpen(c))return false;
    if(activeTag&&activeTag!=="レビュー順"&&!c.tags.includes(activeTag))return false;
    if(search){
      const q=search.toLowerCase();
      const nameMatch = c.name && c.name.toLowerCase().includes(q);
      const descJaMatch = c.desc_ja && c.desc_ja.toLowerCase().includes(q);
      const descEnMatch = c.desc_en && c.desc_en.toLowerCase().includes(q);
      const vibeJaMatch = c.vibe_ja && c.vibe_ja.toLowerCase().includes(q);
      const vibeEnMatch = c.vibe_en && c.vibe_en.toLowerCase().includes(q);
      const tagsMatch = c.tags && c.tags.some(tag => tag && tag.toLowerCase().includes(q));
      
      if(!nameMatch && !descJaMatch && !descEnMatch && !vibeJaMatch && !vibeEnMatch && !tagsMatch) return false;
    }
    return true;
  });
  // レビュー順ソート（平均評価値の高い順）
  if(activeTag==="レビュー順"){
    filtered.sort((a,b)=>{
      const ra=reviewCounts[a.id]?.avg_rating||0;
      const rb=reviewCounts[b.id]?.avg_rating||0;
      if(rb!==ra)return rb-ra;
      return (reviewCounts[b.id]?.count||0)-(reviewCounts[a.id]?.count||0);
    });
  }

  return(
    <div style={{minHeight:"100vh",background:"var(--base)",fontFamily:"'Noto Serif JP',serif",transition:"background .3s"}}>
      {showQuiz&&<QuizModal cafes={cafes} lang={lang} onClose={()=>setShowQuiz(false)} onSelect={handleQuizSelect}/>}
      {showAddCafe&&<AddCafeModal lang={lang} onClose={()=>setShowAddCafe(false)} onAdd={handleAddCafe} setAuthUser={setAuthUser}/>}
      {showAuth&&<AuthModal initialMode={showAuth} lang={lang} onClose={()=>setShowAuth(null)} onLogin={(u)=>{if(u.email==='admin@cafefinder.com'){const appUrl = document.querySelector('meta[name="app-url"]')?.content || 'http://localhost:8000'; window.location.href=`${appUrl}/admin`;return;}setAuthUser(u);setShowAuth(null);}}/>}

      {/* HEADER */}
      <header style={{borderBottom:"1px solid var(--rule)",padding:"12px 20px 10px",
                      background:"var(--surface)",position:"sticky",top:0,zIndex:1100,
                      boxShadow:"0 1px 6px rgba(0,0,0,.05)",transition:"background .3s"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>

          {/* ── PC レイアウト: タイトル行 + ボタン群 同じ行 ── */}
          <div className="header-top-row" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:10}}>
            {/* 左: タイトル */}
            <div onClick={handleHomeClick} style={{flexShrink:0, cursor:"pointer"}} className="header-title-container" title={lang==="en"?"Go to home":"ホームに戻る"}>
              <h1 style={{fontFamily:"'Noto Serif JP',serif",fontSize:"clamp(16px,3.5vw,26px)",fontWeight:700,color:"var(--ink)",letterSpacing:"-.5px",lineHeight:1.1, transition: "opacity 0.15s"}}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 0.8; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 1; }}>
                IT Park Cafe <span style={{color:"var(--teal)"}}>Finder</span>
              </h1>
            </div>

            {/* 右: アクションボタン群 */}
            <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
              {/* ＋ カフェ新規登録ボタン（認証チェック付き） */}
              <button onClick={handleAddClick}
                style={{width:34,height:34,border:"1.5px solid var(--teal)",borderRadius:"50%",
                        background:"transparent",color:"var(--teal)",
                        fontFamily:"'DM Mono',monospace",fontSize:18,cursor:"pointer",fontWeight:700,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        transition:"all .15s",flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--teal)";e.currentTarget.style.color="white";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--teal)";}}
                title={lang==="en"?(authUser?"Add new cafe":"Login to post"):(authUser?"カフェを新規登録":"ログインして投稿")}>+</button>
              {/* ユーザー表示 / ログインボタン */}
              {authUser?(
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--ink2)",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {authUser.name}
                  </span>
                  <UserBadge badge={authUser.badge} />
                  <button onClick={handleLogout}
                    style={{padding:"4px 8px",border:"1px solid var(--rule)",borderRadius:3,
                            background:"var(--surface2)",color:"var(--muted)",cursor:"pointer",
                            fontFamily:"'DM Mono',monospace",fontSize:8,transition:"all .15s"}}>
                    {lang==="en"?"Logout":"ログアウト"}
                  </button>
                </div>
              ):(
                <button onClick={()=>setShowAuth("login")}
                  style={{padding:"6px 12px",border:"1px solid var(--rule)",borderRadius:4,
                          background:"var(--surface2)",color:"var(--ink2)",cursor:"pointer",
                          fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:600,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="var(--ink)";e.currentTarget.style.color="var(--base)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="var(--surface2)";e.currentTarget.style.color="var(--ink2)";}}>
                  {lang==="en"?"Login":"ログイン"}
                </button>
              )}
              <button onClick={()=>setShowQuiz(true)}
                style={{padding:"7px 14px",border:"1.5px solid var(--rule)",borderRadius:4,
                        background:"transparent",color:"var(--ink2)",
                        fontFamily:"'DM Mono',monospace",fontSize:"clamp(9px,1.5vw,11px)",cursor:"pointer",fontWeight:600,
                        transition:"all .15s",whiteSpace:"nowrap"}}
                onMouseEnter={e=>{
                  e.currentTarget.style.background="rgba(42,191,191,.08)";
                  e.currentTarget.style.border="1.5px solid var(--teal)";
                  e.currentTarget.style.color="var(--teal)";
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background="transparent";
                  e.currentTarget.style.border="1.5px solid var(--rule)";
                  e.currentTarget.style.color="var(--ink2)";
                }}>
                {t.quizBtn}
              </button>
              {/* 言語切り替えトグルボタン */}
              <button onClick={() => setLang(lang === "ja" ? "en" : "ja")}
                style={{
                  height: 34,
                  padding: "0 10px",
                  border: "1.5px solid var(--rule)",
                  borderRadius: 4,
                  background: "transparent",
                  color: "var(--ink2)",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: "clamp(9px,1.5vw,11px)",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(42,191,191,.08)";
                  e.currentTarget.style.border = "1.5px solid var(--teal)";
                  e.currentTarget.style.color = "var(--teal)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = "1.5px solid var(--rule)";
                  e.currentTarget.style.color = "var(--ink2)";
                }}
                title={lang === "en" ? "日本語に切り替え" : "Switch to English"}>
                <i className="fa-solid fa-globe"></i> {lang === "en" ? "JP" : "EN"}
              </button>
              <div data-menu style={{position:"relative"}}>
                <button onClick={()=>setShowMenu(v=>!v)}
                  style={{padding:"7px 11px",border:"1px solid var(--rule)",borderRadius:4,
                          background:showMenu?"var(--ink)":"var(--chip-bg)",
                          color:showMenu?"var(--base)":"var(--ink2)",
                          fontFamily:"'DM Mono',monospace",fontSize:13,cursor:"pointer",
                          display:"flex",alignItems:"center",gap:5,transition:"all .15s"}}>
                  ☰ <span style={{fontSize:9}}>{showMenu?"▲":"▼"}</span>
                </button>
                {showMenu&&(
                  <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,
                               background:"var(--surface)",border:"1px solid var(--rule)",
                               borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,.15)",
                               minWidth:200,zIndex:999,overflow:"hidden",
                               animation:"fadeUp .18s ease"}}>
                    {/* Lang */}
                    <div style={{padding:"10px 14px",borderBottom:"1px solid var(--rule)"}}>
                      <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"1.5px",color:"var(--muted)",marginBottom:7}}>LANGUAGE</p>
                      <div style={{display:"flex",gap:5}}>
                        {["ja","en"].map(l=>(
                          <button key={l} onClick={()=>setLang(l)}
                            style={{flex:1,padding:"6px 0",border:`1px solid ${lang===l?"var(--teal)":"var(--rule)"}`,
                                    borderRadius:3,cursor:"pointer",background:lang===l?"var(--teal)":"var(--surface2)",
                                    color:lang===l?"white":"var(--ink2)",
                                    fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:700,transition:"all .15s"}}>
                            {l.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* View */}
                    <div style={{padding:"10px 14px",borderBottom:"1px solid var(--rule)"}}>
                      <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"1.5px",color:"var(--muted)",marginBottom:7}}>VIEW</p>
                      <div style={{display:"flex",gap:5}}>
                        {[["list","☰ "+t.listView],["map","🗺 "+t.mapView]].map(([m,l])=>(
                          <button key={m} onClick={()=>{setViewMode(m);setShowMenu(false);}}
                            style={{flex:1,padding:"6px 0",border:`1px solid ${viewMode===m?"var(--ink)":"var(--rule)"}`,
                                    borderRadius:3,cursor:"pointer",background:viewMode===m?"var(--ink)":"var(--surface2)",
                                    color:viewMode===m?"var(--base)":"var(--ink2)",
                                    fontFamily:"'DM Mono',monospace",fontSize:10,transition:"all .15s"}}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Favs */}
                    <button onClick={()=>{setShowFavs(v=>!v);setShowMenu(false);}}
                      style={{width:"100%",padding:"11px 14px",border:"none",borderBottom:"1px solid var(--rule)",
                              background:showFavs?"#FFF0F0":"transparent",cursor:"pointer",
                              display:"flex",justifyContent:"space-between",alignItems:"center",
                              fontFamily:"'DM Mono',monospace",fontSize:11,
                              color:showFavs?"#E05A5A":"var(--ink)",transition:"background .15s"}}>
                      <span><i className="fa-solid fa-heart"></i> {t.saved}</span>
                      {favorites.length>0&&<span style={{background:"#E05A5A",color:"white",borderRadius:"99px",padding:"1px 7px",fontSize:9}}>{favorites.length}</span>}
                    </button>
                    {/* Dark */}
                    <button onClick={()=>setDark(v=>!v)}
                      style={{width:"100%",padding:"11px 14px",border:"none",borderBottom:"1px solid var(--rule)",
                              background:"transparent",cursor:"pointer",
                              display:"flex",justifyContent:"space-between",alignItems:"center",
                              fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--ink)",transition:"background .15s"}}>
                      <span>{dark?"ライトモード":"ダークモード"}</span>
                      <span>{dark?t.darkOff:t.darkOn}</span>
                    </button>
                    {/* Share */}
                    <button onClick={()=>{handleShare();setShowMenu(false);}}
                      style={{width:"100%",padding:"11px 14px",border:"none",
                              background:"transparent",cursor:"pointer",
                              display:"flex",justifyContent:"space-between",alignItems:"center",
                              fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--ink)",transition:"background .15s"}}>
                      <span>{shareCopied?t.shareCopied:t.shareBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── フィルター行 + 検索バー ── */}
          <div className="header-filter-row" style={{display:"flex",alignItems:"center",gap:10}}>
            {/* フィルターチップ */}
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",flex:1}}>
              {TAGS.map(tg=>(
                <Chip key={tg} label={`#${tg}`} active={activeTag===tg} onClick={()=>setActiveTag(activeTag===tg?"":tg)}/>
              ))}
              <Chip label={t.openNow} active={showOpen} onClick={()=>setShowOpen(v=>!v)}/>
            </div>
            
            {/* 管理者用 Adminページ遷移ボタン */}
            {authUser && authUser.email === 'admin@cafefinder.com' && (
              <button onClick={() => {
                const appUrl = document.querySelector('meta[name="app-url"]')?.content || 'http://localhost:8000';
                window.location.href=`${appUrl}/admin`;
              }} 
                      style={{padding:"8px 12px", background:"var(--ink)", color:"var(--base)", border:"none", borderRadius:3, fontFamily:"'DM Mono',monospace", fontSize:"clamp(11px,2vw,13px)", cursor:"pointer", flexShrink:0, transition:"opacity .15s"}}
                      onMouseOver={e=>e.currentTarget.style.opacity=0.8}
                      onMouseOut={e=>e.currentTarget.style.opacity=1}
                      title="Go to Admin Panel">
                Admin Panel
              </button>
            )}

            {/* 検索バー */}
            <div className="header-search" style={{position:"relative",flexShrink:0}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"var(--muted)"}}><i className="fa-solid fa-magnifying-glass"></i></span>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{padding:"8px 12px 8px 32px",border:"1px solid var(--rule)",borderRadius:3,
                        fontFamily:"'DM Mono',monospace",fontSize:"clamp(11px,2vw,13px)",
                        background:"var(--surface2)",color:"var(--ink)",transition:"border-color .15s",
                        width:"100%"}}/>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main style={{maxWidth:1200,margin:"0 auto",padding:"18px 16px 0"}}>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",letterSpacing:".5px",marginBottom:14}}>
          {filtered.length} {t.cafesFound}
          {showFavs&&` · ${t.savedOnly}`}{activeTag&&` · #${activeTag}`}{showOpen&&` · ${t.openOnly}`}
        </p>
        {viewMode==="map"&&(
          <div style={{marginBottom:20}}>
            <MapView cafes={filtered} onSelect={handleMapSelect} favorites={favorites} selectedCafe={selectedCafe} lang={lang}/>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",textAlign:"center",marginTop:7}}>{t.mapNote}</p>
            {/* ── マップ下のカフェ横並びスクロール ── */}
            <div style={{marginTop:14,overflowX:"auto",paddingBottom:8,WebkitOverflowScrolling:"touch"}}>
              <div style={{display:"flex",gap:12,minWidth:"max-content"}}>
                {filtered.map(c=>{
                  const op=isOpen(c);
                  const hasP=c.photos&&c.photos.length>0;
                  return(
                    <div key={c.id} onClick={()=>handleMapSelect(c)}
                      style={{width:200,flexShrink:0,background:"var(--surface)",border:"1px solid var(--rule)",
                              borderRadius:8,overflow:"hidden",cursor:"pointer",boxShadow:"var(--card-shadow)",
                              transition:"transform .15s,box-shadow .15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.12)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="var(--card-shadow)";}}>
                      {/* UPDATE: カフェ写真サムネイル */}
                      <div style={{height:80,background:hasP?"#000":`linear-gradient(135deg,${c.accent}88,${c.accent})`,overflow:"hidden"}}>
                        {hasP?<img src={c.photos[0]} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:null}
                      </div>
                      <div style={{padding:"8px 10px"}}>
                        <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:12,fontWeight:700,color:"var(--ink)",lineHeight:1.2,marginBottom:3}}>{c.name}</p>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          <span style={{fontSize:8,padding:"1px 5px",borderRadius:2,fontFamily:"'DM Mono',monospace",fontWeight:600,
                                        background:op?"#E8F5E9":"#FFF3E0",color:op?"#2E7D32":"#E65100"}}>
                            {op?"OPEN":"CLOSED"}
                          </span>
                          <span style={{fontSize:8,padding:"1px 5px",borderRadius:2,background:"#E3F2FD",color:"#1565C0",
                                        fontFamily:"'DM Mono',monospace"}}>{c.wifi}</span>
                          <span style={{fontSize:8,padding:"1px 5px",borderRadius:2,background:"var(--surface2)",color:"var(--ink2)",
                                        fontFamily:"'DM Mono',monospace"}}>{c.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {viewMode==="list"&&(
          filtered.length===0?(
            <div style={{textAlign:"center",padding:"56px 0",color:"var(--muted)"}}>
              <div style={{fontSize:32,marginBottom:10}}><i className="fa-solid fa-mug-hot"></i></div>
              <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:14}}>{t.noResult}</p>
            </div>
          ):( 
            <div className="cafe-grid" style={{display:"grid",gap:16}}>
              {filtered.map((cafe,i)=>(
                <div key={cafe.id} id={`card-${cafe.id}`}
                  className={expandedId===cafe.id?"cafe-grid-expanded":""}>
                  <CafeCard cafe={cafe} index={i} favorites={favorites} toggleFav={toggleFav}
                    expandedId={expandedId} setExpandedId={setExpandedId} lang={lang}
                    authUser={authUser} onShowAuth={()=>setShowAuth("login")} setAuthUser={setAuthUser}
                    reviewCounts={reviewCounts} onRefreshCounts={fetchReviewCounts}/>
                </div>
              ))}
            </div>
          )
        )}
        {/* Profile */}
        <div style={{position:"relative",margin:"36px 0 0"}}>
          <div style={{position:"absolute",top:-9,left:20,background:"var(--base)",padding:"0 10px",
                       fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"2px",color:"var(--teal)",fontWeight:500}}>
            {t.compiledBy}
          </div>
          <div style={{border:"1px solid var(--ink)",borderRadius:3,padding:"20px 20px 18px",
                       display:"flex",gap:16,alignItems:"flex-start",background:"var(--surface)"}}>
            <div style={{width:48,height:48,borderRadius:"50%",flexShrink:0,
                         background:"linear-gradient(135deg,#2ABFBF,#1B4F8A)",
                         display:"flex",alignItems:"center",justifyContent:"center",
                         fontSize:18,color:"white",fontWeight:700}}>N</div>
            <div style={{flex:1}}>
              <p style={{fontFamily:"'Noto Serif JP',serif",fontSize:14,fontWeight:700,color:"var(--ink)",marginBottom:5}}>Nissy</p>
              {lang==="ja"
                ?<p style={{fontFamily:"'Noto Serif JP',serif",fontSize:12,fontWeight:300,color:"var(--ink)",lineHeight:1.8}}>
                   セブ島でITと英語を学ぶ23歳。「自習室以外に、もっと快適に集中できる場所がほしい」という自身の切実な思いから、ITパーク内のカフェを1軒ずつ足で巡り、独自の作業カフェリストを作成しました。ここが、あなたの生産性を高める「最高の居場所」を見つけるきっかけになれば嬉しいです。
                 </p>
                :<p style={{fontFamily:"'DM Mono',monospace",fontStyle:"italic",fontSize:11,color:"var(--ink2)",lineHeight:1.8}}>
                   A 23-year-old studying IT and English in Cebu. Driven by a strong desire to find 'a more comfortable and focused place to work outside the study room', I personally visited cafes around IT Park one by one and created this curated work cafe list. I hope this platform helps you discover your 'perfect spot' to boost your productivity.
                 </p>
              }
            </div>
          </div>
        </div>
        <div style={{height:48}}/>
      </main>

      <footer style={{borderTop:"1px solid var(--rule)",padding:"32px 20px 24px",textAlign:"center",background:"var(--surface)", display:"flex", flexDirection:"column", alignItems:"center", gap:20}}>
        
        {/* Contact / Request Form */}
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdnSfqFdwPO6SuLvNI3lzLqLvSrW7IODiguQa9igtr8jmVEOA/viewform" target="_blank" rel="noopener noreferrer" 
           style={{display:"inline-flex", alignItems:"center", gap:8, color:"var(--ink)", textDecoration:"none", fontSize:13, fontWeight:600, padding:"12px 20px", border:"1px solid var(--rule)", borderRadius:30, transition:"background .2s", boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}
           onMouseOver={e=>e.currentTarget.style.background="var(--surface2)"}
           onMouseOut={e=>e.currentTarget.style.background="transparent"}>
          <i className="fa-brands fa-google" style={{fontSize:16}}></i>
          {lang === "en" ? "Contact / Request a Cafe" : "お問い合わせ / 掲載リクエスト"}
        </a>

        {/* Social Links
        <div style={{display:"flex", gap:24, marginTop:4}}>
          <a href="#" target="_blank" rel="noopener noreferrer" style={{color:"var(--ink)", textDecoration:"none", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6, transition:"opacity .2s"}} onMouseOver={e=>e.currentTarget.style.opacity=0.7} onMouseOut={e=>e.currentTarget.style.opacity=1}>
            <span style={{fontSize:15}}><i className="fa-solid fa-note-sticky"></i></span> Note
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" style={{color:"var(--ink)", textDecoration:"none", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6, transition:"opacity .2s"}} onMouseOver={e=>e.currentTarget.style.opacity=0.7} onMouseOut={e=>e.currentTarget.style.opacity=1}>
            <span style={{fontSize:15}}><i className="fa-solid fa-camera"></i></span> Instagram
          </a>
        </div> */}

        {/* Copyright */}
        <div style={{marginTop:8}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",letterSpacing:"1px", margin:"0 0 6px 0"}}>
            &copy; 2026 Cafe Finder by Nissy. All Rights Reserved.
          </p>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"1px", margin:0}}>
            {t.footerNote}
          </p>
        </div>
      </footer>

      <style>{`
        /* ── PC（広い画面）── */
        .cafe-grid{
          grid-template-columns:1fr 1fr;
        }
        .cafe-grid-expanded{
          grid-column:1/-1;
        }
        .header-search{
          width:280px;
        }
        .header-filter-row{
          flex-wrap:nowrap;
        }

        /* ── レスポンシブ (タブレット) ── */
        @media(max-width:960px){
          .cafe-grid{
            grid-template-columns:1fr!important;
          }
          .header-search{
            width:100%!important;
          }
          .header-filter-row{
            flex-direction:column!important;
            align-items:stretch!important;
          }
          header{padding:12px 16px 10px!important;}
          main{padding:14px 14px 0!important;}
        }

        /* ── レスポンシブ (スマホ) ── */
        @media(max-width:600px){
          .cafe-grid{
            grid-template-columns:1fr!important;
            gap:10px!important;
          }
          /* カード展開時の2カラム → 1カラム */
          article [style*="grid-template-columns: 1.2fr"]{grid-template-columns:1fr!important;}
          article [style*="border-right"]{border-right:none!important;border-bottom:1px solid var(--rule)!important;}
          /* ヘッダーを縦積み */
          .header-top-row{
            flex-direction:column!important;
            align-items:flex-start!important;
            gap:8px!important;
          }
          .header-filter-row{
            flex-direction:column!important;
            align-items:stretch!important;
            gap:8px!important;
          }
          .header-search{
            width:100%!important;
          }
          /* メイン padding を縮小 */
          main{padding:12px 10px 0!important;}
          /* ヘッダー padding */
          header{padding:10px 12px 8px!important;}
          /* フッター */
          footer{padding:10px 12px!important;}
          /* チップサイズ縮小 */
          .chip{font-size:9px!important;padding:4px 9px!important;}
        }

        /* ── PC 最大幅 ── */
        @media(min-width:961px){
          header > div, main{max-width:1200px;margin-left:auto!important;margin-right:auto!important;}
        }
      `}</style>
    </div>
  );
}

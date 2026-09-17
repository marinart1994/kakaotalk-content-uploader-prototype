"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3, BatteryMedium, Bookmark, ChevronRight, Globe2, Heart, ImageIcon,
  Link2, MapPin, MessageCircle, MessageSquareQuote, Mic, MoreHorizontal, Music2,
  Check, Pencil, Plus, Repeat2, Search, Settings, Share2, ShoppingBag, Signal,
  SlidersHorizontal, Smile, Sparkles, SquareCheckBig, UserPlus,
  UserRound, Video, Wifi, X,
} from "lucide-react";

type View = "feed" | "composer";
type MediaType = "photo" | "video";
type MediaItem = { id: number; src: string; type: MediaType };
type SeriesItem = { id: number; text: string };
type Panel = "photo" | "photo-editor" | "video-editor" | "location" | "link" | "poll" | "quote" | "emoji" | "ai" | "publish" | "success" | null;

const photos = [
  "https://images.unsplash.com/photo-1590141187901-91517156b553?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1527249695314-c0282b39a126?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=900&q=85",
];

const galleryItems: MediaItem[] = [
  { id: 1, src: photos[0], type: "photo" },
  { id: 2, src: photos[1], type: "photo" },
  { id: 3, src: photos[2], type: "photo" },
  { id: 4, src: photos[3], type: "video" },
  { id: 5, src: photos[4], type: "photo" },
  { id: 6, src: photos[5], type: "photo" },
  { id: 7, src: photos[2], type: "video" },
  { id: 8, src: photos[0], type: "photo" },
  { id: 9, src: photos[4], type: "photo" },
  { id: 10, src: photos[5], type: "video" },
  { id: 11, src: photos[1], type: "photo" },
  { id: 12, src: photos[3], type: "photo" },
];

const quotePhotos = [
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=85",
];

const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function Avatar({ kind = "crew" }: { kind?: "crew" | "lion" | "leaf" }) {
  return <span className={`k-avatar ${kind}`}>{kind === "crew" ? "춘" : kind === "lion" ? "라" : "잎"}</span>;
}

function StatusBar() {
  return <div className="status-bar"><b>9:41</b><span className="island"/><span className="status-icons"><Signal/><Wifi/><BatteryMedium/></span></div>;
}

function ActionRow({ textPost = false }: { textPost?: boolean }) {
  return <div className="action-row"><button aria-label="댓글"><MessageCircle/></button><button aria-label="리포스트"><Repeat2/><small>{textPost ? "15" : "8"}</small></button><button aria-label="좋아요"><Heart/><small>{textPost ? "649" : "215"}</small></button><button aria-label="조회수"><BarChart3/><small>{textPost ? "3.1만" : "4.2천"}</small></button><span/><button aria-label="저장"><Bookmark/></button><button aria-label="공유"><Share2/></button></div>;
}

function QuotedPostCard({ removable = false, onRemove }: { removable?: boolean; onRemove?: () => void }) {
  return <aside className="quoted-post-card" aria-label="인용한 게시물">
    {removable && <button className="remove-quote" aria-label="인용 삭제" onClick={onRemove}><X/></button>}
    <div className="quoted-author"><span>서</span><div><b>서승자</b><small>30분 전</small></div></div>
    <p>시원한 빙수의 계절입니다!!<br/>직접 발품팔아온 서숭자 단독 할인 이벤트 가져왔어요🍧<br/>할인코드는 댓글에서 확인해주세요🙏</p>
    <div className="quoted-images">{quotePhotos.map((photo,index) => <img key={photo} src={photo} alt={`빙수 사진 ${index + 1}`}/>)}</div>
  </aside>;
}

export default function Home() {
  const [view, setView] = useState<View>("feed");
  const [panel, setPanel] = useState<Panel>(null);
  const [copy, setCopy] = useState("");
  const [seriesItems, setSeriesItems] = useState<SeriesItem[]>([]);
  const [activeSeriesId, setActiveSeriesId] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [pendingMedia, setPendingMedia] = useState<MediaItem[]>([]);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [photoEffect, setPhotoEffect] = useState<"ai" | "portrait">("ai");
  const [location, setLocation] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [poll, setPoll] = useState(false);
  const [quotedPost, setQuotedPost] = useState(false);
  const [quoteTab, setQuoteTab] = useState<"liked" | "saved" | "mine">("liked");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState(false);
  const [topicDraft, setTopicDraft] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [published, setPublished] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [selectionMenuPosition, setSelectionMenuPosition] = useState({ left: 0, top: 0 });
  const selectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorBodyRef = useRef<HTMLDivElement | null>(null);
  const seriesEditorRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const nextSeriesId = useRef(1);
  const isComposingRef = useRef(false);

  const combinedCopy = [copy, ...seriesItems.map(item => item.text)].filter(Boolean).join("\n\n");
  const activeCopy = activeSeriesId === 0 ? copy : seriesItems.find(item => item.id === activeSeriesId)?.text ?? "";
  const seriesCount = seriesItems.length + 1;

  const topicSuggestions = combinedCopy.includes("오디세이") || combinedCopy.includes("신화") || combinedCopy.includes("영화")
    ? ["오디세이", "고대 신화", "영화 후기"]
    : combinedCopy.includes("게임") || combinedCopy.includes("플레이")
      ? ["게임 추천", "플레이 후기", "모바일 게임"]
      : combinedCopy.includes("여행") || combinedCopy.includes("시드니")
        ? ["시드니 여행", "여행 기록", "도시 산책"]
        : ["오늘의 생각", "일상 기록", "콘텐츠 추천"];

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const setEditorText = (value: string) => {
    if (activeSeriesId === 0) setCopy(value);
    else setSeriesItems(current => current.map(item => item.id === activeSeriesId ? { ...item, text: value } : item));
    const editor = editorRef.current;
    if (!editor) return;
    editor.textContent = value;
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const addKey = (key: string) => setEditorText(`${editorRef.current?.textContent ?? activeCopy}${key}`);
  const removeLastCharacter = () => setEditorText(Array.from(editorRef.current?.textContent ?? activeCopy).slice(0, -1).join(""));

  const resetComposer = () => {
    setView("feed");
    setPanel(null);
  };

  const startComposer = () => {
    setCopy("");
    setSeriesItems([]);
    setActiveSeriesId(0);
    nextSeriesId.current = 1;
    seriesEditorRefs.current.clear();
    setSelectedMedia([]);
    setPendingMedia([]);
    setEditingMedia(null);
    setPhotoEffect("ai");
    setLocation(null);
    setLink(null);
    setPoll(false);
    setQuotedPost(false);
    setQuoteTab("liked");
    setSpoiler(false);
    setSelectedTopic(null);
    setEditingTopic(false);
    setTopicDraft("");
    setShowSelectionMenu(false);
    setView("composer");
  };

  const addSeriesContent = () => {
    if (seriesCount >= 10) {
      flash("시리즈는 최대 10개까지 작성할 수 있어요");
      return;
    }
    const id = nextSeriesId.current++;
    setSeriesItems(current => [...current, { id, text: "" }]);
    setActiveSeriesId(id);
    setShowSelectionMenu(false);
    requestAnimationFrame(() => {
      const editor = seriesEditorRefs.current.get(id);
      if (!editor) return;
      editorRef.current = editor;
      editorBodyRef.current = editor.parentElement as HTMLDivElement;
      editor.focus();
    });
  };

  const removeSeriesContent = (id: number) => {
    setSeriesItems(current => current.filter(item => item.id !== id));
    seriesEditorRefs.current.delete(id);
    if (activeSeriesId === id) {
      setActiveSeriesId(0);
      requestAnimationFrame(() => {
        const editor = seriesEditorRefs.current.get(0);
        if (!editor) return;
        editorRef.current = editor;
        editorBodyRef.current = editor.parentElement as HTMLDivElement;
        editor.focus();
      });
    }
  };

  useEffect(() => {
    if (view === "composer") requestAnimationFrame(() => editorRef.current?.focus());
  }, [view]);

  const handleEditorSelection = () => {
    if (selectionTimer.current) clearTimeout(selectionTimer.current);
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount || !editorRef.current?.contains(selection.anchorNode)) {
      setShowSelectionMenu(false);
      return;
    }
    selectionTimer.current = setTimeout(() => {
      const currentSelection = window.getSelection();
      if (!currentSelection || currentSelection.isCollapsed || !currentSelection.rangeCount || !editorRef.current || !editorBodyRef.current) return;
      const rangeRect = currentSelection.getRangeAt(0).getBoundingClientRect();
      const bodyRect = editorBodyRef.current.getBoundingClientRect();
      const menuWidth = Math.min(330, bodyRect.width);
      setSelectionMenuPosition({
        left: Math.max(0, Math.min(rangeRect.left - bodyRect.left, bodyRect.width - menuWidth)),
        top: Math.max(35, rangeRect.bottom - bodyRect.top + 8),
      });
      setShowSelectionMenu(true);
    }, 550);
  };

  const applySelectedMedia = () => {
    if (!pendingMedia.length) return;
    setSelectedMedia(pendingMedia);
    setLink(null);
    setPoll(false);
    setQuotedPost(false);
    setPanel(null);
    flash(`미디어 ${pendingMedia.length}개를 첨부했어요`);
  };

  const openMediaPicker = () => {
    setPendingMedia(selectedMedia);
    setEditingMedia(null);
    setPanel("photo");
  };

  const toggleMediaSelection = (item: MediaItem) => {
    const selected = pendingMedia.some(media => media.id === item.id);
    if (selected) {
      setPendingMedia(current => current.filter(media => media.id !== item.id));
      return;
    }
    if (pendingMedia.length >= 10) {
      flash("미디어는 최대 10개까지 선택할 수 있어요");
      return;
    }
    setPendingMedia(current => [...current, item]);
  };

  const openMediaEditor = (item: MediaItem) => {
    const selected = pendingMedia.some(media => media.id === item.id);
    if (!selected && pendingMedia.length >= 10) {
      flash("미디어는 최대 10개까지 선택할 수 있어요");
      return;
    }
    if (!selected) setPendingMedia(current => [...current, item]);
    setEditingMedia(item);
    setPanel(item.type === "video" ? "video-editor" : "photo-editor");
  };

  return (
    <main className="demo-stage">
      <section className="demo-note" aria-label="시연 안내">
        <span>CLICK PROTOTYPE</span>
        <h1>카카오톡 3탭에서<br/>콘텐츠를 시작해보세요.</h1>
        <p>피드의 <b>＋</b> 버튼을 누르면<br/>콘텐츠 작성 화면으로 전환됩니다.</p>
        <div className="demo-flow"><i className={view === "feed" ? "active" : "done"}>1</i><span/><i className={view === "composer" ? "active" : ""}>2</i><div><small>피드</small><small>작성</small></div></div>
      </section>

      <section className="phone" aria-label="모바일 카카오톡 콘텐츠 시연">
        <StatusBar/>

        {view === "feed" ? <div className="screen feed-screen">
          <header className="now-header">
            <h2>지금</h2>
            <div><button aria-label="검색"><Search/></button><button aria-label="친구 추가"><UserPlus/></button><button aria-label="설정"><Settings/></button></div>
          </header>
          <div className="feed-tabs"><button>오픈채팅</button><button className="active">피드</button></div>
          <button className="interest-row"><Avatar/><span><b>춘식크루</b><small>당신의 관심사를 올려주세요</small></span><ChevronRight/></button>
          <div className="hairline"/>
          <div className="mobile-feed-scroll">
            {published && <article className="k-post fresh-post">
              <div className="post-head"><Avatar/><span><b>춘식크루</b><small>방금 전 · 판교</small></span><button aria-label="더보기"><MoreHorizontal/></button></div>
              {combinedCopy && <div className={`published-series ${spoiler ? "spoiler-copy" : ""}`}>{[copy, ...seriesItems.map(item => item.text)].filter(Boolean).map((text,index) => <p key={`${index}-${text}`}><b>{index + 1}</b><span>{text}</span></p>)}</div>}
              {selectedMedia.length > 0 && <div className={`post-media-grid count-${Math.min(selectedMedia.length, 4)}`}>{selectedMedia.map(media => <div className="post-media" key={media.id}><img className="post-image" src={media.src} alt={media.type === "video" ? "새로 올린 영상" : "새로 올린 사진"}/>{media.type === "video" && <span><Video/> 영상</span>}</div>)}</div>}
              {location && <div className="post-location"><MapPin/> {location}</div>}
              {link && <div className="post-link"><span><Link2/></span><div><b>시드니 여행 공식 가이드</b><small>{link}</small></div></div>}
              {poll && <div className="post-poll"><b>다음 영화 후기 주제는?</b><button>오디세이 세계관</button><button>고대 신화 속 영웅</button></div>}
              {quotedPost && <QuotedPostCard/>}
              {selectedTopic && <div className="tag-line"><span>#{selectedTopic}</span></div>}
              <ActionRow/>
            </article>}
            <article className="k-post">
              <div className="post-head"><Avatar kind="lion"/><span><b>수상한 라이언 <em><MapPin/> 판교</em></b><small>1시간 전</small></span><button>팔로우</button><button aria-label="더보기"><MoreHorizontal/></button></div>
              <p>라이언 게임, 귀여운 캐릭터만 보고 가볍게 시작했는데 생각보다 몰입감이 꽤 좋다. 조작은 어렵지 않지만 스테이지를 거듭할수록 전략적인 플레이가 필요하고, 라이언 특유의 매력을 살린 연출도 보는 재미가 있다. 다만 콘텐츠 업데이트와 보상 흐름에 따라 이용자들의 평가는 조금 더 지켜봐야 할 듯하다.<br/>당분간은 새로운 이벤트와 운영 방향을 확인하며 천천히 즐겨볼 생각! 🦁🎮</p>
              <div className="tag-line"><span>#라이언게임</span><span>#게임추천</span><span>#모바일게임</span><span>#게임일상</span></div>
              <ActionRow textPost/>
            </article>
            <article className="k-post visual-post">
              <div className="post-head"><Avatar kind="leaf"/><span><b>이니스프리</b><small>1시간 전</small></span><button>팔로우</button><button aria-label="더보기"><MoreHorizontal/></button></div>
              <img src={photos[5]} alt="맑은 하늘과 바다"/>
              <div className="media-badges"><Music2/><Video/></div>
              <ActionRow/>
            </article>
          </div>
          <button className="floating-create" aria-label="새 콘텐츠 만들기" onClick={startComposer}><Plus/></button>
          <nav className="bottom-nav" aria-label="카카오톡 탭"><button aria-label="친구"><UserRound/></button><button aria-label="채팅"><MessageCircle/><b>40</b></button><button className="active" aria-label="피드"><span><Smile/></span></button><button aria-label="쇼핑"><ShoppingBag/></button><button aria-label="더보기"><MoreHorizontal/></button></nav>
        </div> : <div className="screen composer-screen">
          <header className="composer-top"><button className="close-compose" aria-label="작성 취소" onClick={resetComposer}><X/></button><span/><button className="draft-icon" aria-label="발행 옵션" onClick={() => setPanel("publish")}><SlidersHorizontal/></button><button className="upload-button" disabled={!combinedCopy.trim() && selectedMedia.length === 0} onClick={() => setPanel("success")}>{seriesCount > 1 ? `${seriesCount}개 올리기` : "올리기"}</button></header>
          <div className="composer-scroll">
            <article className="editor-block">
              <div className="editor-line"><Avatar/><small>1</small><i/><button aria-label="콘텐츠 추가" onClick={addSeriesContent}><Plus/></button></div>
              <div className="editor-body" ref={editorBodyRef}>
                <b>춘식크루</b>
                <div
                  ref={node => { if (node) { seriesEditorRefs.current.set(0, node); if (activeSeriesId === 0) editorRef.current = node; } }}
                  className={`text-editor ${quotedPost ? "with-quote" : ""}`}
                  role="textbox"
                  aria-label="게시글 내용"
                  aria-multiline="true"
                  contentEditable
                  suppressContentEditableWarning
                  onCompositionStart={() => { isComposingRef.current = true; }}
                  onCompositionEnd={event => { isComposingRef.current = false; setCopy(event.currentTarget.textContent || ""); }}
                  onInput={event => { if (!isComposingRef.current) setCopy(event.currentTarget.textContent || ""); setShowSelectionMenu(false); }}
                  onFocus={event => { setActiveSeriesId(0); editorRef.current = event.currentTarget; editorBodyRef.current = event.currentTarget.parentElement as HTMLDivElement; }}
                  onMouseUp={handleEditorSelection}
                  onTouchEnd={handleEditorSelection}
                  onKeyUp={() => { if (!isComposingRef.current) handleEditorSelection(); }}
                  onBlur={() => window.setTimeout(() => setShowSelectionMenu(false), 160)}
                />
                {showSelectionMenu && activeSeriesId === 0 && <div className="selection-tools" style={{ left: selectionMenuPosition.left, top: selectionMenuPosition.top }}><button onMouseDown={event => event.preventDefault()} onClick={() => flash("내용을 오려냈어요")}>오려두기</button><button onMouseDown={event => event.preventDefault()} onClick={() => navigator.clipboard?.writeText(window.getSelection()?.toString() || activeCopy)}>복사하기</button><button onMouseDown={event => event.preventDefault()} onClick={() => flash("클립보드 내용을 붙여넣었어요")}>붙여넣기</button><button onMouseDown={event => event.preventDefault()} className={spoiler ? "active" : ""} onClick={() => setSpoiler(!spoiler)}>스포방지로 표시</button><button><ChevronRight/></button></div>}
                {quotedPost && <QuotedPostCard removable onRemove={() => setQuotedPost(false)}/>}
                {selectedMedia.length > 0 && <div className="editor-media-grid">
                  {selectedMedia.map(media => <div className={`editor-photo ${media.type}`} key={media.id}>
                    <button className="media-edit" aria-label={`${media.type === "video" ? "영상" : "사진"} 편집`} onClick={() => { setPendingMedia(selectedMedia); setEditingMedia(media); setPanel(media.type === "video" ? "video-editor" : "photo-editor"); }}><img src={media.src} alt={media.type === "video" ? "첨부한 영상" : "첨부한 사진"}/><span>편집</span></button>
                    {media.type === "video" && <em><Video/>{media.id % 2 ? "0:05" : "0:04"}</em>}
                    <button className="media-remove" aria-label="첨부 미디어 삭제" onClick={() => setSelectedMedia(current => current.filter(selected => selected.id !== media.id))}><X/></button>
                  </div>)}
                  {selectedMedia.length < 10 && <button className="editor-media-add" aria-label="미디어 더 추가" onClick={openMediaPicker}><Plus/></button>}
                </div>}
                {location && <div className="editor-attachment"><span>⌖</span><div><small>위치</small><b>{location}</b></div><button onClick={() => setLocation(null)}>×</button></div>}
                {link && <div className="editor-attachment"><span>↗</span><div><small>링크</small><b>{link}</b></div><button onClick={() => setLink(null)}>×</button></div>}
                {poll && <div className="mini-poll"><b>다음 영화 후기 주제는?</b><span>오디세이 세계관</span><span>고대 신화 속 영웅</span></div>}
                {combinedCopy && <div className="recommended">
                  <small>추천 주제</small>
                  {!selectedTopic ? <div>{topicSuggestions.map(topic => <button key={topic} onClick={() => { setSelectedTopic(topic); setTopicDraft(topic); }}>＋ {topic}</button>)}</div> :
                    <div className="selected-topic-card">
                      {editingTopic ? <><input aria-label="선택한 토픽 수정" value={topicDraft} autoFocus onChange={event => setTopicDraft(event.target.value)} /><button aria-label="토픽 수정 완료" onClick={() => { if (topicDraft.trim()) setSelectedTopic(topicDraft.trim()); setEditingTopic(false); }}><Check/></button></> : <><strong>{selectedTopic}</strong><button aria-label="토픽 수정" onClick={() => { setTopicDraft(selectedTopic); setEditingTopic(true); }}><Pencil/></button></>}
                      <button aria-label="토픽 삭제" className="delete-topic" onClick={() => { setSelectedTopic(null); setEditingTopic(false); }}><X/></button>
                    </div>}
                </div>}
              </div>
            </article>
            {seriesItems.map((item,index) => <article className="editor-block series-editor-block" key={item.id}>
              <div className="editor-line"><Avatar/><small>{index + 2}</small><i/></div>
              <div className="editor-body series-editor-body">
                <button className="remove-series" aria-label={`${index + 2}번째 콘텐츠 삭제`} onClick={() => removeSeriesContent(item.id)}><X/></button>
                <div
                  ref={node => { if (node) seriesEditorRefs.current.set(item.id, node); }}
                  className="text-editor series-text-editor"
                  role="textbox"
                  aria-label={`${index + 2}번째 게시글 내용`}
                  aria-multiline="true"
                  data-placeholder="다른 콘텐츠 추가"
                  contentEditable
                  suppressContentEditableWarning
                  onCompositionStart={() => { isComposingRef.current = true; }}
                  onCompositionEnd={event => { isComposingRef.current = false; setSeriesItems(current => current.map(series => series.id === item.id ? { ...series, text: event.currentTarget.textContent || "" } : series)); }}
                  onInput={event => { if (!isComposingRef.current) setSeriesItems(current => current.map(series => series.id === item.id ? { ...series, text: event.currentTarget.textContent || "" } : series)); setShowSelectionMenu(false); }}
                  onFocus={event => { setActiveSeriesId(item.id); editorRef.current = event.currentTarget; editorBodyRef.current = event.currentTarget.parentElement as HTMLDivElement; }}
                  onMouseUp={handleEditorSelection}
                  onTouchEnd={handleEditorSelection}
                  onKeyUp={() => { if (!isComposingRef.current) handleEditorSelection(); }}
                  onBlur={() => window.setTimeout(() => setShowSelectionMenu(false), 160)}
                />
                {showSelectionMenu && activeSeriesId === item.id && <div className="selection-tools" style={{ left: selectionMenuPosition.left, top: selectionMenuPosition.top }}><button onMouseDown={event => event.preventDefault()} onClick={() => flash("내용을 오려냈어요")}>오려두기</button><button onMouseDown={event => event.preventDefault()} onClick={() => navigator.clipboard?.writeText(window.getSelection()?.toString() || activeCopy)}>복사하기</button><button onMouseDown={event => event.preventDefault()} onClick={() => flash("클립보드 내용을 붙여넣었어요")}>붙여넣기</button><button onMouseDown={event => event.preventDefault()} className={spoiler ? "active" : ""} onClick={() => setSpoiler(!spoiler)}>스포방지로 표시</button><button><ChevronRight/></button></div>}
              </div>
            </article>)}
            {seriesItems.length > 0 && <div className="series-comment-note"><MessageCircle/> 각 콘텐츠에 댓글이 따로 달려요</div>}
          </div>
          <div className="composer-bottom">
            <div className="tool-bar">
              <button aria-label="사진 또는 영상 추가" onClick={openMediaPicker}><ImageIcon/></button>
              <button aria-label="위치 추가" onClick={() => setPanel("location")}><MapPin/></button>
              <button aria-label="링크 추가" disabled={selectedMedia.length > 0} onClick={() => setPanel("link")}><Link2/></button>
              <button aria-label="투표 추가" disabled={selectedMedia.length > 0} onClick={() => setPanel("poll")}><SquareCheckBig/></button>
              <button className="quote-tool" aria-label="게시물 인용" disabled={selectedMedia.length > 0} onClick={() => setPanel("quote")}><MessageSquareQuote/></button>
              <button aria-label="이모티콘" onClick={() => setPanel("emoji")}><Smile/></button>
              <i/>
              <button className="ai-button" aria-label="AI 추천" onClick={() => setPanel("ai")}><Sparkles/><b>AI</b></button>
            </div>
            <div className="fake-keyboard">
              <div className="suggestions"><span>I</span><span>The</span><span>I’m</span></div>
              {keyboardRows.map((row, rowIndex) => <div className={`key-row row-${rowIndex}`} key={row}>{rowIndex === 2 && <button className="wide-key" onClick={() => addKey("⇧")}>⬆</button>}{[...row].map(key => <button key={key} onClick={() => addKey(key)}>{key}</button>)}{rowIndex === 2 && <button className="wide-key" onClick={removeLastCharacter}>⌫</button>}</div>)}
              <div className="key-row utility-row"><button>123</button><button onClick={() => setPanel("emoji")}>☺</button><button className="space" onClick={() => addKey(" ")}>space <small>EN</small></button><button onClick={() => addKey("\n")}>↵</button></div>
              <div className="keyboard-foot"><button aria-label="키보드 언어"><Globe2/></button><button aria-label="음성 입력"><Mic/></button></div>
            </div>
          </div>
        </div>}

        {panel === "photo" && <div className="phone-overlay solid photo-picker-overlay">
          <section className="photo-picker-screen" role="dialog" aria-modal="true" aria-label="사진 또는 영상 선택">
            <StatusBar/>
            <header><button aria-label="사진 선택 취소" onClick={() => { setPendingMedia(selectedMedia); setEditingMedia(null); setPanel(null); }}><X/></button><b>최근 항목⌄</b><button className={pendingMedia.length ? "ready" : ""} disabled={!pendingMedia.length} onClick={applySelectedMedia}>{pendingMedia.length ? `${pendingMedia.length} 확인` : "확인"}</button></header>
            {pendingMedia.length > 0 && <div className="selection-strip" aria-label={`선택한 미디어 ${pendingMedia.length}개`}>
              {pendingMedia.map((media,index) => <div key={media.id}><img src={media.src} alt={`선택 ${index + 1}`}/><b>{index + 1}</b><button aria-label={`선택 ${index + 1} 삭제`} onClick={() => setPendingMedia(current => current.filter(selected => selected.id !== media.id))}><X/></button></div>)}
            </div>}
            <div className={`gallery-grid ${pendingMedia.length ? "has-selection" : ""}`}>
              <button className="camera-tile" aria-label="카메라 열기" onClick={() => flash("카메라 시연입니다")}><ImageIcon/><small>카메라</small></button>
              {galleryItems.map((item,index) => {
                const selectedIndex = pendingMedia.findIndex(media => media.id === item.id);
                return <div key={item.id} className={`gallery-item ${selectedIndex >= 0 ? "selected" : ""}`}>
                  <button className="gallery-preview" aria-label={`${item.type === "video" ? "영상" : "사진"} ${index + 1} 상세 편집`} onClick={() => openMediaEditor(item)}>
                    <img src={item.src} alt=""/>
                    {item.type === "video" && <span className="gallery-video"><Video/>0:05</span>}
                  </button>
                  <button className="gallery-select" aria-label={`${item.type === "video" ? "영상" : "사진"} ${index + 1} ${selectedIndex >= 0 ? "선택 해제" : "바로 선택"}`} onClick={() => toggleMediaSelection(item)}>{selectedIndex >= 0 ? selectedIndex + 1 : ""}</button>
                </div>;
              })}
            </div>
          </section>
        </div>}

        {(panel === "photo-editor" || panel === "video-editor") && editingMedia && <div className="phone-overlay solid media-editor-overlay">
          <section className={`media-editor-screen ${panel === "video-editor" ? "video-mode" : "photo-mode"}`} role="dialog" aria-modal="true" aria-label={panel === "video-editor" ? "영상 편집" : "사진 편집"}>
            <StatusBar/>
            <header><button aria-label="갤러리로 돌아가기" onClick={() => setPanel("photo")}>‹</button><b>{panel === "video-editor" ? "영상 편집" : "사진 편집"}</b><button onClick={() => setPanel("photo")}>확인</button></header>
            <div className="media-editor-canvas"><img src={editingMedia.src} alt="편집 중인 미디어"/>{panel === "video-editor" && <button className="video-play" aria-label="영상 재생">▶</button>}</div>
            {panel === "photo-editor" ? <div className="photo-edit-card"><small>AI 편집</small><p>사진을 더 자연스럽게 정리해보세요.</p><div><button className={photoEffect === "ai" ? "active" : ""} onClick={() => setPhotoEffect("ai")}><Sparkles/>배경 인물 지우기</button><button className={photoEffect === "portrait" ? "active" : ""} onClick={() => setPhotoEffect("portrait")}><UserRound/>추천 인물 필터</button></div></div> : <div className="video-edit-panel"><div className="video-time">0:00 / 0:05</div><div className="video-timeline">{[0,1,2,3,4].map(frame => <img key={frame} src={editingMedia.src} alt=""/>)}<i/></div><button><Plus/> 오디오 추가</button></div>}
            <footer className="media-editor-tools"><button aria-label="현재 미디어 선택 취소" onClick={() => { setPendingMedia(current => current.filter(media => media.id !== editingMedia.id)); setEditingMedia(null); setPanel("photo"); }}>×</button><button><Sparkles/></button><button>□</button><button>T</button><button>◎</button><button>〰</button><button aria-label="편집 적용" onClick={() => setPanel("photo")}><Check/></button></footer>
          </section>
        </div>}

        {panel === "quote" && <div className="phone-overlay quote-overlay" onMouseDown={() => setPanel(null)}>
          <section className="quote-picker" role="dialog" aria-modal="true" aria-label="인용할 게시물 선택" onMouseDown={event => event.stopPropagation()}>
            <div className="quote-sheet-handle"/>
            <header><button onClick={() => setPanel(null)}>취소</button><b>인용할 게시물을 선택하세요</b><span/></header>
            <nav className="quote-tabs" aria-label="인용 게시물 분류">
              <button className={quoteTab === "liked" ? "active" : ""} onClick={() => setQuoteTab("liked")}><Heart/>좋아요</button>
              <button className={quoteTab === "saved" ? "active" : ""} onClick={() => setQuoteTab("saved")}><Bookmark/>저장</button>
              <button className={quoteTab === "mine" ? "active" : ""} onClick={() => setQuoteTab("mine")}>내 게시물</button>
            </nav>
            <button className="quote-source-card" onClick={() => { setQuotedPost(true); setPanel(null); flash("인용을 추가했어요"); requestAnimationFrame(() => editorRef.current?.focus()); }}>
              <div className="quote-source-author"><span>서</span><div><b>{quoteTab === "mine" ? "춘식크루" : "서승자"}</b><small>{quoteTab === "mine" ? "방금 전" : "30분 전"}</small></div></div>
              <p>시원한 빙수의 계절입니다!!<br/>직접 발품팔아온 서숭자 단독 할인 이벤트 가져왔어요🍧<br/>할인코드는 댓글에서 확인해주세요🙏</p>
              <div className="quote-source-images">{quotePhotos.map((photo,index) => <img key={photo} src={photo} alt={`인용할 빙수 사진 ${index + 1}`}/>)}</div>
              <div className="quote-source-meta"><span>❤️ 333</span><span>🥰 888</span><span>😮 1K</span><span>+222</span><i/><Share2/><Bookmark/></div>
            </button>
          </section>
        </div>}

        {panel && panel !== "quote" && panel !== "photo" && panel !== "photo-editor" && panel !== "video-editor" && <div className={`phone-overlay ${panel === "success" ? "solid" : ""}`} onMouseDown={() => panel !== "success" && setPanel(null)}>
          <section className={`mobile-sheet panel-${panel}`} role="dialog" aria-modal="true" aria-label="추가 설정" onMouseDown={event => event.stopPropagation()}>
            {panel !== "success" && <><div className="sheet-handle"/><button className="sheet-close" aria-label="닫기" onClick={() => setPanel(null)}><X/></button></>}
            {panel === "location" && <><h3>위치</h3><label className="sheet-search"><Search/><input placeholder="장소 검색" autoFocus/></label><div className="place-list">{["Sydney Opera House","판교역","Darling Harbour","The Rocks, Sydney"].map(place => <button key={place} onClick={() => {setLocation(place);setPanel(null);}}><span><MapPin/></span><div><b>{place}</b><small>추천 위치</small></div><i><Plus/></i></button>)}</div></>}
            {panel === "link" && <><h3>링크</h3><label className="sheet-input">URL 입력<input defaultValue="https://www.sydney.com/" autoFocus/></label><div className="link-preview"><span><Link2/></span><div><b>시드니 여행 공식 가이드</b><small>sydney.com</small></div></div><button className="sheet-primary" onClick={() => {setLink("https://www.sydney.com/");setPanel(null);}}>링크 추가</button></>}
            {panel === "poll" && <><h3>투표</h3><label className="sheet-input">투표 제목<input defaultValue="다음 영화 후기 주제는?"/></label><label className="sheet-input">선택지 1<input defaultValue="오디세이 세계관"/></label><label className="sheet-input">선택지 2<input defaultValue="고대 신화 속 영웅"/></label><button className="sheet-primary" onClick={() => {setPoll(true);setPanel(null);}}>투표 만들기</button></>}
            {panel === "emoji" && <><h3>이모티콘</h3><div className="emoji-grid">{["✈️","🌏","📸","🌅","☕","✨","💛","🌊","😎","🥰","👏","🎉"].map(emoji => <button key={emoji} onClick={() => {setEditorText(`${editorRef.current?.textContent ?? activeCopy}${emoji}`);setPanel(null);}}>{emoji}</button>)}</div></>}
            {panel === "ai" && <><div className="ai-head"><span><Sparkles/></span><div><h3>AI 추천 주제</h3><p>작성한 내용을 바탕으로 추천했어요. 하나만 선택할 수 있어요.</p></div></div><div className="ai-topics">{topicSuggestions.map(topic => <button key={topic} className={selectedTopic === topic ? "selected" : ""} onClick={() => { setSelectedTopic(topic); setTopicDraft(topic); }}>#{topic}<span>{selectedTopic === topic ? "✓" : "+"}</span></button>)}</div><button className="sheet-primary" onClick={() => setPanel(null)}>추천 주제 적용</button></>}
            {panel === "publish" && <><h3>발행 옵션</h3><p className="sheet-lead">콘텐츠를 누구에게 보여줄지 선택해주세요.</p><div className="publish-options"><div><b>공개 여부</b><span><button className="active">전체</button><button>팔로워</button></span></div><div><b>댓글 작성 대상</b><span><button className="active">전체</button><button>팔로워</button></span></div><label><span><b>리포스트 및 인용 허용</b><small>다른 사람이 콘텐츠를 공유할 수 있어요</small></span><input type="checkbox" defaultChecked/></label><label><span><b>AI 관련 표시</b><small>추천 기능을 사용한 콘텐츠로 표시해요</small></span><input type="checkbox" defaultChecked/></label></div><button className="sheet-primary publish-now" onClick={() => setPanel("success")}>피드에 올리기</button></>}
            {panel === "success" && <div className="success-panel"><span>✓</span><small>PUBLISHED</small><h3>피드에 올렸어요!</h3><p>작성한 콘텐츠가 카카오톡 3탭에<br/>새로운 이야기로 추가됐습니다.</p><button onClick={() => {setPublished(true);setPanel(null);setView("feed");flash("콘텐츠가 발행됐어요");}}>피드에서 보기</button></div>}
          </section>
        </div>}

        {toast && <div className="mobile-toast">✓ {toast}</div>}
        <div className="home-indicator"/>
      </section>
    </main>
  );
}

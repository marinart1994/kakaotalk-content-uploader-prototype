"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3, BatteryMedium, Bookmark, ChevronRight, Globe2, Heart, ImageIcon,
  Link2, MapPin, MessageCircle, MessageSquareQuote, Mic, MoreHorizontal, Music2,
  Check, Pencil, Plus, Repeat2, Search, Settings, Share2, ShoppingBag, Signal,
  SlidersHorizontal, Smile, Sparkles, SquareCheckBig, UserPlus,
  Trash2, UserRound, Video, Wifi, X,
} from "lucide-react";

type View = "feed" | "composer";
type MediaType = "photo" | "video";
type MediaItem = { id: number; src: string; type: MediaType };
type SeriesItem = { id: number; text: string; media: MediaItem[] };
type LightDetailSeriesItem = { id: number; text: string };
type LightCategory = "전체" | "고민" | "일상" | "질문";
type LightDetailTool = "photo" | "location" | "link" | "poll" | "quote" | "ai" | null;
type LightPost = {
  id: number;
  author: string;
  time: string;
  category: Exclude<LightCategory, "전체">;
  text: string;
  likes: number;
  comments: number;
  avatar: string;
  image?: string;
  location?: string;
  link?: string;
  poll?: boolean;
  quote?: boolean;
  series?: string[];
};
type Panel = "photo" | "photo-editor" | "video-editor" | "location" | "link" | "poll" | "quote" | "emoji" | "ai" | "publish" | "post-menu" | "success" | null;

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
const koreanKeyboardRows = ["ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ", "ㅁㄴㅇㄹㅎㅗㅓㅏㅣ", "ㅋㅌㅊㅍㅠㅜㅡ"];
const MINI_TOKEN_START = 0xe000;
const SPOILER_START = "\uE100";
const SPOILER_END = "\uE101";
const initialLightPosts: LightPost[] = [
  { id: 1, author: "버스 창가", time: "방금", category: "고민", text: "오늘 아침에 버스를 놓쳐서 학교에서 조금 떨어진 곳에 내려주는 버스를 탔는데, 몇 년 전 정말 좋아했던 사람이 있었어요. 그 친구가 항상 그 버스를 탄다고 들었는데 앞으로 같은 버스를 타면 너무 티가 날까요? ㅠㅠ", likes: 12, comments: 4, avatar: "🚌" },
  { id: 2, author: "연애 300일", time: "2분 전", category: "고민", text: "여자친구와 300일 정도 만났어요. 서로의 과거 연애와 상처를 잘 알고 있어서 주변 이성 문제에 더 조심해왔는데요.\n\n여러 명이 함께 만나는 건 괜찮지만 단둘이 만나는 건 피하자고 이야기했어요. 그런데 여자친구가 제 남자인 친구와 둘이 공부하는 정도는 괜찮다고 생각한다네요. 제가 과거 때문에 예민한 걸까요, 아니면 서로 조금 더 배려해야 할까요?", likes: 31, comments: 18, avatar: "💭" },
  { id: 3, author: "고1 진로고민", time: "6분 전", category: "질문", text: "고등학교 1학년이고 치위생학과를 희망하고 있어요. 내신 평균이 5등급제 기준 2.59 정도인데 어떤 대학교를 목표로 하면 좋을까요? 공부를 더 해서 성적을 올릴 생각입니다. 비슷한 경험이 있다면 알려주세요!", likes: 7, comments: 11, avatar: "📚" },
  { id: 4, author: "또로롱", time: "9분 전", category: "일상", text: "오늘의 데일리룩이에요. 편하게 입어봤는데 어떤가요?", likes: 24, comments: 9, avatar: "🌿", image: photos[4] },
  { id: 5, author: "Pearl", time: "12분 전", category: "질문", text: "초6인데 한 달 용돈으로 4만 원을 받고 있어요. 다들 보통 얼마 정도 받나요?", likes: 5, comments: 13, avatar: "🫧" },
  { id: 6, author: "소담한 오후", time: "18분 전", category: "일상", text: "요즘 별일 아닌데도 괜히 지칠 때가 있어요. 잠깐 산책하고 따뜻한 음료를 마시니 조금 나아졌어요. 다들 기분 전환이 필요할 때 찾는 곳이 있나요?", likes: 16, comments: 6, avatar: "🐈" },
];
const stickerIndexes = Array.from({ length: 30 }, (_, index) => index);
const miniEmoticons = Array.from({ length: 17 }, (_, index) => index);

function StickerSprite({ index, className = "" }: { index: number; className?: string }) {
  const column = index % 6;
  const row = Math.floor(index / 6);
  return <span className={`sticker-sprite ${className}`} style={{ backgroundImage: "url(emoticon-cat-sprite.png)", backgroundPosition: `${column * 20}% ${row * 25}%` }}/>
}

function MiniEmoticonSprite({ index, className = "" }: { index: number; className?: string }) {
  const column = index % 6;
  const row = Math.floor(index / 6);
  return <span className={`mini-emoticon-sprite ${className}`} data-mini={index} contentEditable={false} style={{ backgroundImage: "url(mini-emoticon-sprite.png)", backgroundPosition: `${column * 20}% ${row * 50}%` }}/>
}

const miniToken = (index: number) => String.fromCharCode(MINI_TOKEN_START + index);
const miniIndex = (character: string) => {
  const index = character.charCodeAt(0) - MINI_TOKEN_START;
  return index >= 0 && index < miniEmoticons.length ? index : -1;
};

function createInlineMini(index: number) {
  const span = document.createElement("span");
  span.className = "mini-emoticon-sprite inline-mini-emoticon";
  span.dataset.mini = String(index);
  span.contentEditable = "false";
  span.setAttribute("role", "img");
  span.setAttribute("aria-label", `미니 이모티콘 ${index + 1}`);
  span.style.backgroundImage = "url(mini-emoticon-sprite.png)";
  span.style.backgroundPosition = `${(index % 6) * 20}% ${Math.floor(index / 6) * 50}%`;
  return span;
}

function renderEditorValue(editor: HTMLDivElement, value: string) {
  editor.replaceChildren();
  let textBuffer = "";
  let currentParent: HTMLElement = editor;
  const flushText = () => {
    if (!textBuffer) return;
    currentParent.append(document.createTextNode(textBuffer));
    textBuffer = "";
  };
  for (const character of Array.from(value)) {
    const index = miniIndex(character);
    if (index >= 0) {
      flushText();
      currentParent.append(createInlineMini(index));
    } else if (character === SPOILER_START) {
      flushText();
      const spoiler = document.createElement("span");
      spoiler.className = "inline-spoiler-editor";
      spoiler.dataset.spoiler = "true";
      currentParent.append(spoiler);
      currentParent = spoiler;
    } else if (character === SPOILER_END) {
      flushText();
      currentParent = editor;
    } else if (character === "\n") {
      flushText();
      currentParent.append(document.createElement("br"));
    } else {
      textBuffer += character;
    }
  }
  flushText();
}

function serializeEditor(editor: HTMLDivElement) {
  const serializeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (!(node instanceof HTMLElement)) return "";
    if (node.dataset.mini !== undefined) return miniToken(Number(node.dataset.mini));
    if (node.tagName === "BR") return "\n";
    const contents = Array.from(node.childNodes).map(serializeNode).join("");
    if (node.dataset.spoiler !== undefined) return `${SPOILER_START}${contents}${SPOILER_END}`;
    return node.tagName === "DIV" && node.previousSibling ? `\n${contents}` : contents;
  };
  return Array.from(editor.childNodes).map(serializeNode).join("");
}

function renderInlineContent(value: string, keyPrefix: string) {
  return Array.from(value).map((character, index) => {
    const emoticonIndex = miniIndex(character);
    return emoticonIndex >= 0 ? <MiniEmoticonSprite key={`${keyPrefix}-mini-${index}`} index={emoticonIndex} className="published-mini-emoticon"/> : character;
  });
}

function SpoilerFragment({ value, fragmentKey }: { value: string; fragmentKey: string }) {
  const [revealed, setRevealed] = useState(false);
  return <button
    type="button"
    className={`published-spoiler ${revealed ? "revealed" : ""}`}
    aria-label={revealed ? "공개된 스포일러 내용" : "스포일러 내용 보기"}
    onClick={() => setRevealed(true)}
  >{renderInlineContent(value, fragmentKey)}</button>;
}

function RichTextContent({ value }: { value: string }) {
  const segments: { text: string; spoiler: boolean }[] = [];
  let text = "";
  let spoiler = false;
  const pushSegment = () => {
    if (text) segments.push({ text, spoiler });
    text = "";
  };
  for (const character of Array.from(value)) {
    if (character === SPOILER_START) {
      pushSegment();
      spoiler = true;
    } else if (character === SPOILER_END) {
      pushSegment();
      spoiler = false;
    } else {
      text += character;
    }
  }
  pushSegment();
  return <>{segments.map((segment, index) => segment.spoiler
    ? <SpoilerFragment key={`spoiler-${index}`} value={segment.text} fragmentKey={`spoiler-${index}`}/>
    : <span key={`plain-${index}`}>{renderInlineContent(segment.text, `plain-${index}`)}</span>)}</>;
}

function Avatar({ kind = "crew" }: { kind?: "crew" | "lion" | "leaf" }) {
  return <span className={`k-avatar ${kind}`}>{kind === "crew" ? "춘" : kind === "lion" ? "라" : "잎"}</span>;
}

function StatusBar() {
  return <div className="status-bar"><b>9:41</b><span className="island"/><span className="status-icons"><Signal/><Wifi/><BatteryMedium/></span></div>;
}

function DraftSaveDialog({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return <div className="draft-save-backdrop" role="presentation">
    <section className="draft-save-dialog" role="alertdialog" aria-modal="true" aria-labelledby="draft-save-title">
      <p id="draft-save-title">작성 중인 글을 저장할까요? 저장하면 다음에 이어서 작성할 수 있어요.</p>
      <div><button onClick={onCancel}>취소</button><button onClick={onSave}>저장</button></div>
    </section>
  </div>;
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
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null);
  const [emojiTab, setEmojiTab] = useState<"search" | "emoticon" | "mini" | "discover">("emoticon");
  const [photoEffect, setPhotoEffect] = useState<"ai" | "portrait">("ai");
  const [location, setLocation] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [poll, setPoll] = useState(false);
  const [quotedPost, setQuotedPost] = useState(false);
  const [quoteTab, setQuoteTab] = useState<"liked" | "saved" | "mine">("liked");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState(false);
  const [topicDraft, setTopicDraft] = useState("");
  const [published, setPublished] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [selectionMenuPosition, setSelectionMenuPosition] = useState({ left: 0, top: 0 });
  const [lightCategory, setLightCategory] = useState<LightCategory>("전체");
  const [lightPosts, setLightPosts] = useState<LightPost[]>(initialLightPosts);
  const [lightDraft, setLightDraft] = useState("");
  const [likedLightPosts, setLikedLightPosts] = useState<Set<number>>(new Set());
  const [lightDetailOpen, setLightDetailOpen] = useState(false);
  const [lightDetailTool, setLightDetailTool] = useState<LightDetailTool>(null);
  const [lightDetailText, setLightDetailText] = useState("");
  const [lightDetailPhoto, setLightDetailPhoto] = useState<string | null>(null);
  const [lightDetailLocation, setLightDetailLocation] = useState<string | null>(null);
  const [lightDetailLink, setLightDetailLink] = useState<string | null>(null);
  const [lightDetailPoll, setLightDetailPoll] = useState(false);
  const [lightDetailQuote, setLightDetailQuote] = useState(false);
  const [lightDetailSeries, setLightDetailSeries] = useState<LightDetailSeriesItem[]>([]);
  const [lightDetailActiveSeriesId, setLightDetailActiveSeriesId] = useState(0);
  const [exitPrompt, setExitPrompt] = useState<"full" | "light" | null>(null);
  const [fullDraftSaved, setFullDraftSaved] = useState(false);
  const [lightDetailDraftSaved, setLightDetailDraftSaved] = useState(false);
  const selectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorBodyRef = useRef<HTMLDivElement | null>(null);
  const seriesEditorRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const savedEditorRangeRef = useRef<Range | null>(null);
  const selectedTextRangeRef = useRef<Range | null>(null);
  const nextSeriesId = useRef(1);
  const nextLightDetailSeriesId = useRef(1);
  const isComposingRef = useRef(false);

  const combinedCopy = [copy, ...seriesItems.map(item => item.text)].filter(Boolean).join("\n\n");
  const allSeriesContent = [{ id: 0, text: copy, media: selectedMedia }, ...seriesItems];
  const activeCopy = activeSeriesId === 0 ? copy : seriesItems.find(item => item.id === activeSeriesId)?.text ?? "";
  const activeMedia = activeSeriesId === 0 ? selectedMedia : seriesItems.find(item => item.id === activeSeriesId)?.media ?? [];
  const seriesCount = seriesItems.length + 1;
  const lastSeriesText = seriesItems.length ? seriesItems[seriesItems.length - 1].text : copy;
  const canAddSeries = Boolean(lastSeriesText.trim());
  const hasComposerContent = Boolean(copy.trim() || selectedMedia.length || selectedSticker !== null || seriesItems.some(item => item.text.trim() || item.media.length));
  const hasLightDetailContent = Boolean(lightDetailText.trim() || lightDetailPhoto || lightDetailLocation || lightDetailLink || lightDetailPoll || lightDetailQuote || lightDetailSeries.some(item => item.text.trim()));
  const lastLightDetailText = lightDetailSeries.length ? lightDetailSeries[lightDetailSeries.length - 1].text : lightDetailText;
  const canAddLightDetailSeries = Boolean(lastLightDetailText.trim());

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
    renderEditorValue(editor, value);
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const addKey = (key: string) => setEditorText(`${activeCopy}${key}`);
  const removeLastCharacter = () => setEditorText(Array.from(activeCopy).slice(0, -1).join(""));

  const rememberEditorCaret = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = window.getSelection();
    if (selection?.rangeCount && editor.contains(selection.anchorNode)) {
      savedEditorRangeRef.current = selection.getRangeAt(0).cloneRange();
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    savedEditorRangeRef.current = range;
  };

  const openEmojiPicker = () => {
    if (!savedEditorRangeRef.current) rememberEditorCaret();
    setPanel("emoji");
  };

  const insertMiniEmoticon = (index: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = window.getSelection();
    const range = savedEditorRangeRef.current?.cloneRange() ?? document.createRange();
    if (!savedEditorRangeRef.current || !editor.contains(range.commonAncestorContainer)) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    const mini = createInlineMini(index);
    range.deleteContents();
    range.insertNode(mini);
    range.setStartAfter(mini);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedEditorRangeRef.current = range.cloneRange();
    const value = serializeEditor(editor);
    if (activeSeriesId === 0) setCopy(value);
    else setSeriesItems(current => current.map(item => item.id === activeSeriesId ? { ...item, text: value } : item));
  };

  const resetComposer = () => {
    setView("feed");
    setPanel(null);
    setExitPrompt(null);
  };

  const startComposer = () => {
    if (fullDraftSaved) {
      setFullDraftSaved(false);
      setExitPrompt(null);
      setView("composer");
      return;
    }
    setCopy("");
    setSeriesItems([]);
    setActiveSeriesId(0);
    nextSeriesId.current = 1;
    seriesEditorRefs.current.clear();
    setSelectedMedia([]);
    setPendingMedia([]);
    setEditingMedia(null);
    setSelectedSticker(null);
    setEmojiTab("emoticon");
    setPhotoEffect("ai");
    setLocation(null);
    setLink(null);
    setPoll(false);
    setQuotedPost(false);
    setQuoteTab("liked");
    setSelectedTopic(null);
    setEditingTopic(false);
    setTopicDraft("");
    setShowSelectionMenu(false);
    savedEditorRangeRef.current = null;
    selectedTextRangeRef.current = null;
    setView("composer");
  };

  const requestComposerClose = () => {
    if (hasComposerContent) setExitPrompt("full");
    else resetComposer();
  };

  const saveFullDraft = () => {
    setFullDraftSaved(true);
    resetComposer();
  };

  const addSeriesContent = () => {
    if (!canAddSeries) return;
    const id = nextSeriesId.current++;
    setSeriesItems(current => [...current, { id, text: "", media: [] }]);
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
    if (view !== "composer") return;
    requestAnimationFrame(() => {
      const rootEditor = seriesEditorRefs.current.get(0);
      if (rootEditor) renderEditorValue(rootEditor, copy);
      seriesItems.forEach(item => {
        const editor = seriesEditorRefs.current.get(item.id);
        if (editor) renderEditorValue(editor, item.text);
      });
      const activeEditor = seriesEditorRefs.current.get(activeSeriesId) ?? rootEditor;
      if (activeEditor) {
        editorRef.current = activeEditor;
        editorBodyRef.current = activeEditor.parentElement as HTMLDivElement;
        activeEditor.focus();
      }
    });
  }, [view]);

  const handleEditorSelection = () => {
    if (selectionTimer.current) clearTimeout(selectionTimer.current);
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount || !editorRef.current?.contains(selection.anchorNode)) {
      selectedTextRangeRef.current = null;
      setShowSelectionMenu(false);
      return;
    }
    selectionTimer.current = setTimeout(() => {
      const currentSelection = window.getSelection();
      if (!currentSelection || currentSelection.isCollapsed || !currentSelection.rangeCount || !editorRef.current || !editorBodyRef.current) return;
      const currentRange = currentSelection.getRangeAt(0);
      if (!editorRef.current.contains(currentRange.commonAncestorContainer)) return;
      selectedTextRangeRef.current = currentRange.cloneRange();
      const rangeRect = currentRange.getBoundingClientRect();
      const bodyRect = editorBodyRef.current.getBoundingClientRect();
      const menuWidth = Math.min(330, bodyRect.width);
      setSelectionMenuPosition({
        left: Math.max(0, Math.min(rangeRect.left - bodyRect.left, bodyRect.width - menuWidth)),
        top: Math.max(35, rangeRect.bottom - bodyRect.top + 8),
      });
      setShowSelectionMenu(true);
    }, 550);
  };

  const applySpoilerToSelection = () => {
    const editor = editorRef.current;
    const storedRange = selectedTextRangeRef.current;
    if (!editor || !storedRange || storedRange.collapsed || !editor.contains(storedRange.commonAncestorContainer)) return;
    const range = storedRange.cloneRange();
    const fragment = range.extractContents();
    const spoiler = document.createElement("span");
    spoiler.className = "inline-spoiler-editor";
    spoiler.dataset.spoiler = "true";
    spoiler.append(fragment);
    range.insertNode(spoiler);
    range.setStartAfter(spoiler);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedEditorRangeRef.current = range.cloneRange();
    selectedTextRangeRef.current = null;
    const value = serializeEditor(editor);
    if (activeSeriesId === 0) setCopy(value);
    else setSeriesItems(current => current.map(item => item.id === activeSeriesId ? { ...item, text: value } : item));
    setShowSelectionMenu(false);
    flash("선택한 글자를 스포일러로 표시했어요");
  };

  const applySelectedMedia = () => {
    if (!pendingMedia.length) return;
    if (activeSeriesId === 0) {
      setSelectedMedia(pendingMedia);
      setLink(null);
      setPoll(false);
      setQuotedPost(false);
    } else {
      setSeriesItems(current => current.map(item => item.id === activeSeriesId ? { ...item, media: pendingMedia } : item));
    }
    setPanel(null);
    flash(`미디어 ${pendingMedia.length}개를 첨부했어요`);
  };

  const openMediaPicker = (ownerId = activeSeriesId) => {
    const ownerMedia = ownerId === 0 ? selectedMedia : seriesItems.find(item => item.id === ownerId)?.media ?? [];
    setActiveSeriesId(ownerId);
    setPendingMedia(ownerMedia);
    setEditingMedia(null);
    setPanel("photo");
  };

  const openAttachedMediaEditor = (ownerId: number, media: MediaItem, ownerMedia: MediaItem[]) => {
    setActiveSeriesId(ownerId);
    setPendingMedia(ownerMedia);
    setEditingMedia(media);
    setPanel(media.type === "video" ? "video-editor" : "photo-editor");
  };

  const removeAttachedMedia = (ownerId: number, mediaId: number) => {
    if (ownerId === 0) setSelectedMedia(current => current.filter(media => media.id !== mediaId));
    else setSeriesItems(current => current.map(item => item.id === ownerId ? { ...item, media: item.media.filter(media => media.id !== mediaId) } : item));
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

  const filteredLightPosts = lightCategory === "전체"
    ? lightPosts
    : lightPosts.filter(post => post.category === lightCategory);

  const toggleLightLike = (id: number) => {
    setLikedLightPosts(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const publishLightPost = () => {
    const text = lightDraft.trim();
    if (!text) return;
    const category: Exclude<LightCategory, "전체"> = lightCategory === "전체" ? "일상" : lightCategory;
    setLightPosts(current => [{
      id: Date.now(), author: "춘식크루", time: "방금", category, text,
      likes: 0, comments: 0, avatar: "춘",
    }, ...current]);
    setLightDraft("");
    setLightCategory("전체");
  };

  const removeLightCharacter = () => {
    setLightDraft(current => Array.from(current).slice(0, -1).join(""));
  };

  const openLightDetailComposer = () => {
    if (lightDetailDraftSaved) {
      setLightDetailDraftSaved(false);
      setExitPrompt(null);
      setLightDetailTool(null);
      setLightDetailOpen(true);
      return;
    }
    setLightDetailText("");
    setLightDetailPhoto(null);
    setLightDetailLocation(null);
    setLightDetailLink(null);
    setLightDetailPoll(false);
    setLightDetailQuote(false);
    setLightDetailSeries([]);
    setLightDetailActiveSeriesId(0);
    nextLightDetailSeriesId.current = 1;
    setLightDetailTool(null);
    setLightDetailOpen(true);
  };

  const closeLightDetailComposer = () => {
    setLightDetailTool(null);
    setExitPrompt(null);
    setLightDetailOpen(false);
  };

  const requestLightDetailClose = () => {
    if (hasLightDetailContent) setExitPrompt("light");
    else closeLightDetailComposer();
  };

  const saveLightDetailDraft = () => {
    setLightDetailDraftSaved(true);
    closeLightDetailComposer();
  };

  const publishLightDetailPost = () => {
    if (!hasLightDetailContent) return;
    const category: Exclude<LightCategory, "전체"> = lightCategory === "전체" ? "일상" : lightCategory;
    const fallbackText = lightDetailPoll
      ? "오늘의 선택, 여러분의 생각은 어떤가요?"
      : lightDetailLink
        ? "같이 보고 싶은 링크를 공유해요."
        : lightDetailPhoto
          ? "오늘의 순간을 사진으로 남겨요."
          : lightDetailQuote
            ? "이 글에 제 생각을 더해봅니다."
            : "새로운 글감을 남겼어요.";
    setLightPosts(current => [{
      id: Date.now(), author: "춘식크루", time: "방금", category,
      text: lightDetailText.trim() || fallbackText, likes: 0, comments: 0, avatar: "춘",
      image: lightDetailPhoto ?? undefined,
      location: lightDetailLocation ?? undefined,
      link: lightDetailLink ?? undefined,
      poll: lightDetailPoll || undefined,
      quote: lightDetailQuote || undefined,
      series: lightDetailSeries.map(item => item.text.trim()).filter(Boolean),
    }, ...current]);
    setLightCategory("전체");
    setLightDetailDraftSaved(false);
    setLightDetailSeries([]);
    setLightDetailActiveSeriesId(0);
    closeLightDetailComposer();
  };

  const addLightDetailSeries = () => {
    if (!canAddLightDetailSeries) return;
    const id = nextLightDetailSeriesId.current++;
    setLightDetailSeries(current => [...current, { id, text: "" }]);
    setLightDetailActiveSeriesId(id);
  };

  const removeLightDetailSeries = (id: number) => {
    setLightDetailSeries(current => current.filter(item => item.id !== id));
    if (lightDetailActiveSeriesId === id) setLightDetailActiveSeriesId(0);
  };

  const addLightDetailKey = (key: string) => {
    if (lightDetailActiveSeriesId === 0) setLightDetailText(current => `${current}${key}`);
    else setLightDetailSeries(current => current.map(item => item.id === lightDetailActiveSeriesId ? { ...item, text: `${item.text}${key}` } : item));
  };
  const removeLightDetailCharacter = () => {
    if (lightDetailActiveSeriesId === 0) setLightDetailText(current => Array.from(current).slice(0, -1).join(""));
    else setLightDetailSeries(current => current.map(item => item.id === lightDetailActiveSeriesId ? { ...item, text: Array.from(item.text).slice(0, -1).join("") } : item));
  };

  return (
    <main className="prototype-page">
      <section className="demo-stage option-one">
      <section className="demo-note" aria-label="시연 안내">
        <span>OPTION 1 · FULL CREATOR</span>
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
              <div className="post-head"><Avatar/><span><b>춘식크루{selectedTopic && <em className="post-topic-badge">{selectedTopic}<ChevronRight/></em>}</b><small>방금 전 · 판교</small></span><button aria-label="내 게시물 더보기" onClick={() => setPanel("post-menu")}><MoreHorizontal/></button></div>
              {allSeriesContent.some(item => item.text.trim() || item.media.length) && <div className="published-series">{allSeriesContent.map((item,index) => (item.text.trim() || item.media.length) && <div className="published-series-item" key={item.id}>
                <b>{index + 1}</b>
                <div>{item.text && <p><RichTextContent value={item.text}/></p>}{item.media.length > 0 && <div className={`post-media-grid count-${Math.min(item.media.length, 4)}`}>{item.media.map(media => <div className="post-media" key={media.id}><img className="post-image" src={media.src} alt={media.type === "video" ? "새로 올린 영상" : "새로 올린 사진"}/>{media.type === "video" && <span><Video/> 영상</span>}</div>)}</div>}</div>
              </div>)}</div>}
              {selectedSticker !== null && <div className="post-sticker"><StickerSprite index={selectedSticker}/></div>}
              {location && <div className="post-location"><MapPin/> {location}</div>}
              {link && <div className="post-link"><span><Link2/></span><div><b>시드니 여행 공식 가이드</b><small>{link}</small></div></div>}
              {poll && <div className="post-poll"><b>다음 영화 후기 주제는?</b><button>오디세이 세계관</button><button>고대 신화 속 영웅</button></div>}
              {quotedPost && <QuotedPostCard/>}
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
          <header className="composer-top"><button className="close-compose" aria-label="작성 취소" onClick={requestComposerClose}><X/></button><span/><button className="draft-icon" aria-label="발행 옵션" onClick={() => setPanel("publish")}><SlidersHorizontal/></button><button className="upload-button" disabled={!hasComposerContent} onClick={() => setPanel("success")}>{seriesCount > 1 ? `${seriesCount}개 올리기` : "올리기"}</button></header>
          <div className="composer-scroll">
            <article className="editor-block">
              <div className="editor-line"><Avatar/><small>1</small><i/></div>
              <div className="editor-body" ref={editorBodyRef}>
                <b>춘식크루</b>
                <div
                  ref={node => { if (node) { seriesEditorRefs.current.set(0, node); if (activeSeriesId === 0) editorRef.current = node; } }}
                  className={`text-editor ${quotedPost ? "with-quote" : ""} ${selectedMedia.length > 0 || selectedSticker !== null ? "with-media" : ""}`}
                  role="textbox"
                  aria-label="게시글 내용"
                  aria-multiline="true"
                  contentEditable
                  suppressContentEditableWarning
                  onCompositionStart={() => { isComposingRef.current = true; }}
                  onCompositionEnd={event => { isComposingRef.current = false; setCopy(serializeEditor(event.currentTarget)); }}
                  onInput={event => { if (!isComposingRef.current) setCopy(serializeEditor(event.currentTarget)); setShowSelectionMenu(false); }}
                  onFocus={event => { setActiveSeriesId(0); editorRef.current = event.currentTarget; editorBodyRef.current = event.currentTarget.parentElement as HTMLDivElement; }}
                  onMouseUp={handleEditorSelection}
                  onTouchEnd={handleEditorSelection}
                  onKeyUp={() => { if (!isComposingRef.current) handleEditorSelection(); }}
                  onBlur={() => window.setTimeout(() => setShowSelectionMenu(false), 160)}
                />
                {showSelectionMenu && activeSeriesId === 0 && <div className="selection-tools" style={{ left: selectionMenuPosition.left, top: selectionMenuPosition.top }}><button onMouseDown={event => event.preventDefault()} onClick={() => flash("내용을 오려냈어요")}>오려두기</button><button onMouseDown={event => event.preventDefault()} onClick={() => navigator.clipboard?.writeText(window.getSelection()?.toString() || activeCopy)}>복사하기</button><button onMouseDown={event => event.preventDefault()} onClick={() => flash("클립보드 내용을 붙여넣었어요")}>붙여넣기</button><button onMouseDown={event => event.preventDefault()} onClick={applySpoilerToSelection}>스포방지로 표시</button><button><ChevronRight/></button></div>}
                {quotedPost && <QuotedPostCard removable onRemove={() => setQuotedPost(false)}/>}
                {selectedSticker !== null && <div className="editor-sticker-card"><StickerSprite index={selectedSticker}/><button aria-label="이모티콘 삭제" onClick={() => setSelectedSticker(null)}><X/></button></div>}
                {selectedMedia.length > 0 && <div className="editor-media-grid">
                  {selectedMedia.map(media => <div className={`editor-photo ${media.type}`} key={media.id}>
                    <button className="media-edit" aria-label={`${media.type === "video" ? "영상" : "사진"} 편집`} onClick={() => openAttachedMediaEditor(0, media, selectedMedia)}><img src={media.src} alt={media.type === "video" ? "첨부한 영상" : "첨부한 사진"}/><span>편집</span></button>
                    {media.type === "video" && <em><Video/>{media.id % 2 ? "0:05" : "0:04"}</em>}
                    <button className="media-remove" aria-label="첨부 미디어 삭제" onClick={() => removeAttachedMedia(0, media.id)}><X/></button>
                  </div>)}
                  {selectedMedia.length < 10 && <button className="editor-media-add" aria-label="미디어 더 추가" onClick={() => openMediaPicker(0)}><Plus/></button>}
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
                  onCompositionEnd={event => { isComposingRef.current = false; setSeriesItems(current => current.map(series => series.id === item.id ? { ...series, text: serializeEditor(event.currentTarget) } : series)); }}
                  onInput={event => { if (!isComposingRef.current) setSeriesItems(current => current.map(series => series.id === item.id ? { ...series, text: serializeEditor(event.currentTarget) } : series)); setShowSelectionMenu(false); }}
                  onFocus={event => { setActiveSeriesId(item.id); editorRef.current = event.currentTarget; editorBodyRef.current = event.currentTarget.parentElement as HTMLDivElement; }}
                  onMouseUp={handleEditorSelection}
                  onTouchEnd={handleEditorSelection}
                  onKeyUp={() => { if (!isComposingRef.current) handleEditorSelection(); }}
                  onBlur={() => window.setTimeout(() => setShowSelectionMenu(false), 160)}
                />
                {showSelectionMenu && activeSeriesId === item.id && <div className="selection-tools" style={{ left: selectionMenuPosition.left, top: selectionMenuPosition.top }}><button onMouseDown={event => event.preventDefault()} onClick={() => flash("내용을 오려냈어요")}>오려두기</button><button onMouseDown={event => event.preventDefault()} onClick={() => navigator.clipboard?.writeText(window.getSelection()?.toString() || activeCopy)}>복사하기</button><button onMouseDown={event => event.preventDefault()} onClick={() => flash("클립보드 내용을 붙여넣었어요")}>붙여넣기</button><button onMouseDown={event => event.preventDefault()} onClick={applySpoilerToSelection}>스포방지로 표시</button><button><ChevronRight/></button></div>}
                {item.media.length > 0 && <div className="editor-media-grid">
                  {item.media.map(media => <div className={`editor-photo ${media.type}`} key={media.id}>
                    <button className="media-edit" aria-label={`${index + 2}번째 콘텐츠 ${media.type === "video" ? "영상" : "사진"} 편집`} onClick={() => openAttachedMediaEditor(item.id, media, item.media)}><img src={media.src} alt={media.type === "video" ? "첨부한 영상" : "첨부한 사진"}/><span>편집</span></button>
                    {media.type === "video" && <em><Video/>{media.id % 2 ? "0:05" : "0:04"}</em>}
                    <button className="media-remove" aria-label={`${index + 2}번째 콘텐츠 첨부 미디어 삭제`} onClick={() => removeAttachedMedia(item.id, media.id)}><X/></button>
                  </div>)}
                  {item.media.length < 10 && <button className="editor-media-add" aria-label={`${index + 2}번째 콘텐츠 미디어 더 추가`} onClick={() => openMediaPicker(item.id)}><Plus/></button>}
                </div>}
              </div>
            </article>)}
            <div className="series-add-row">
              <div className="series-add-track"><i/><button aria-label="콘텐츠 추가" disabled={!canAddSeries} onClick={addSeriesContent}><Plus/></button></div>
              <small>{canAddSeries ? "다른 콘텐츠 추가" : "위 콘텐츠에 글자를 입력하면 추가할 수 있어요"}</small>
            </div>
            {seriesItems.length > 0 && <div className="series-comment-note"><MessageCircle/> 각 콘텐츠에 댓글이 따로 달려요</div>}
          </div>
          <div className="composer-bottom">
            <div className="tool-bar">
              <button aria-label="사진 또는 영상 추가" onClick={() => openMediaPicker(activeSeriesId)}><ImageIcon/></button>
              <button aria-label="위치 추가" disabled={activeSeriesId !== 0} onClick={() => setPanel("location")}><MapPin/></button>
              <button aria-label="링크 추가" disabled={activeSeriesId !== 0 || activeMedia.length > 0} onClick={() => setPanel("link")}><Link2/></button>
              <button aria-label="투표 추가" disabled={activeSeriesId !== 0 || activeMedia.length > 0} onClick={() => setPanel("poll")}><SquareCheckBig/></button>
              <button className="quote-tool" aria-label="게시물 인용" disabled={activeSeriesId !== 0 || activeMedia.length > 0} onClick={() => setPanel("quote")}><MessageSquareQuote/></button>
              <button aria-label="이모티콘" onMouseDown={rememberEditorCaret} onClick={openEmojiPicker}><Smile/></button>
              <i/>
              <button className="ai-button" aria-label="AI 추천" onClick={() => setPanel("ai")}><Sparkles/><b>AI</b></button>
            </div>
            <div className="fake-keyboard">
              <div className="suggestions"><span>I</span><span>The</span><span>I’m</span></div>
              {keyboardRows.map((row, rowIndex) => <div className={`key-row row-${rowIndex}`} key={row}>{rowIndex === 2 && <button className="wide-key" onClick={() => addKey("⇧")}>⬆</button>}{[...row].map(key => <button key={key} onClick={() => addKey(key)}>{key}</button>)}{rowIndex === 2 && <button className="wide-key" onClick={removeLastCharacter}>⌫</button>}</div>)}
              <div className="key-row utility-row"><button>123</button><button onMouseDown={rememberEditorCaret} onClick={openEmojiPicker}>☺</button><button className="space" onClick={() => addKey(" ")}>space <small>EN</small></button><button onClick={() => addKey("\n")}>↵</button></div>
              <div className="keyboard-foot"><button aria-label="키보드 언어"><Globe2/></button><button aria-label="음성 입력"><Mic/></button></div>
            </div>
          </div>
        </div>}

        {panel === "photo" && <div className="phone-overlay solid photo-picker-overlay">
          <section className="photo-picker-screen" role="dialog" aria-modal="true" aria-label="사진 또는 영상 선택">
            <StatusBar/>
            <header><button aria-label="사진 선택 취소" onClick={() => { setPendingMedia(activeMedia); setEditingMedia(null); setPanel(null); }}><X/></button><b>최근 항목⌄</b><button className={pendingMedia.length ? "ready" : ""} disabled={!pendingMedia.length} onClick={applySelectedMedia}>{pendingMedia.length ? `${pendingMedia.length} 확인` : "확인"}</button></header>
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
          <section className={`mobile-sheet panel-${panel} ${panel === "emoji" ? `emoji-tab-${emojiTab}` : ""}`} role="dialog" aria-modal="true" aria-label="추가 설정" onMouseDown={event => event.stopPropagation()}>
            {panel !== "success" && panel !== "emoji" && <><div className="sheet-handle"/><button className="sheet-close" aria-label="닫기" onClick={() => setPanel(null)}><X/></button></>}
            {panel === "location" && <><h3>위치</h3><label className="sheet-search"><Search/><input placeholder="장소 검색" autoFocus/></label><div className="place-list">{["Sydney Opera House","판교역","Darling Harbour","The Rocks, Sydney"].map(place => <button key={place} onClick={() => {setLocation(place);setPanel(null);}}><span><MapPin/></span><div><b>{place}</b><small>추천 위치</small></div><i><Plus/></i></button>)}</div></>}
            {panel === "link" && <><h3>링크</h3><label className="sheet-input">URL 입력<input defaultValue="https://www.sydney.com/" autoFocus/></label><div className="link-preview"><span><Link2/></span><div><b>시드니 여행 공식 가이드</b><small>sydney.com</small></div></div><button className="sheet-primary" onClick={() => {setLink("https://www.sydney.com/");setPanel(null);}}>링크 추가</button></>}
            {panel === "poll" && <><h3>투표</h3><label className="sheet-input">투표 제목<input defaultValue="다음 영화 후기 주제는?"/></label><label className="sheet-input">선택지 1<input defaultValue="오디세이 세계관"/></label><label className="sheet-input">선택지 2<input defaultValue="고대 신화 속 영웅"/></label><button className="sheet-primary" onClick={() => {setPoll(true);setPanel(null);}}>투표 만들기</button></>}
            {panel === "emoji" && <div className="emoticon-picker">
              <div className="emoticon-handle"/>
              <div className="emoticon-main-tabs">
                <button className={emojiTab === "search" ? "active" : ""} onClick={() => setEmojiTab("search")}>검색</button>
                <button className={emojiTab === "emoticon" ? "active" : ""} onClick={() => setEmojiTab("emoticon")}>이모티콘</button>
                <button className={emojiTab === "mini" ? "active" : ""} onClick={() => setEmojiTab("mini")}>미니</button>
                <button className={emojiTab === "discover" ? "active" : ""} onClick={() => setEmojiTab("discover")}>발견</button>
                <button className="emoticon-store" aria-label="이모티콘 스토어"><ShoppingBag/></button>
              </div>
              <div className="emoticon-packs" aria-label="이모티콘 팩">
                {[0,1,4,10,22].map((index,packIndex) => <button key={index} className={packIndex === 0 ? "active" : ""} onClick={() => setEmojiTab("emoticon")}><StickerSprite index={index}/>{packIndex === 0 && <i/>}</button>)}
                <button aria-label="팩 추가"><Plus/></button><button aria-label="팩 설정"><Settings/></button><button aria-label="닫기" onClick={() => setPanel(null)}><X/></button>
              </div>
              <div className="emoticon-content">
                {emojiTab === "search" && <><label className="emoticon-search"><Search/><input placeholder="이모티콘 검색" autoFocus/></label><div className="emoticon-title"><b>최근 사용</b></div><div className="sticker-grid compact">{stickerIndexes.slice(0,12).map(index => <button key={index} aria-label={`이모티콘 ${index + 1} 사용`} onClick={() => { setSelectedSticker(index); setPanel(null); flash("이모티콘을 추가했어요"); }}><StickerSprite index={index}/></button>)}</div></>}
                {emojiTab === "emoticon" && <><div className="emoticon-title"><b>몽글 회색 고양이</b><span>새 스티커 팩 ›</span></div><div className="sticker-grid">{stickerIndexes.map(index => <button key={index} aria-label={`고양이 이모티콘 ${index + 1} 사용`} onClick={() => { setSelectedSticker(index); setPanel(null); flash("이모티콘을 추가했어요"); }}><StickerSprite index={index}/></button>)}</div></>}
                {emojiTab === "mini" && <><div className="emoticon-title"><b>핑크핑크 어피치</b><span>텍스트 옆에 자유롭게 붙여보세요 ›</span></div><div className="mini-emoticon-grid">{miniEmoticons.map(index => <button key={index} aria-label={`미니 이모티콘 ${index + 1} 삽입`} onClick={() => insertMiniEmoticon(index)}><MiniEmoticonSprite index={index}/></button>)}</div><p className="mini-emoticon-hint">선택창을 닫지 않고 여러 개를 연속으로 넣을 수 있어요.</p><button className="friends-more">🐥 카카오프렌즈 더보기 <ChevronRight/></button></>}
                {emojiTab === "discover" && <><div className="emoticon-title"><b>추천 미니 이모티콘</b><span>취향을 발견해요 ›</span></div><div className="discover-emoticons">{[[0,4,8,12],[2,7,13,18],[5,11,17,23],[6,15,21,29]].map((group,index) => <button key={index} onClick={() => setEmojiTab("emoticon")}>{group.map(sticker => <StickerSprite index={sticker} key={sticker}/>)}</button>)}</div></>}
              </div>
            </div>}
            {panel === "ai" && <><div className="ai-head"><span><Sparkles/></span><div><h3>AI 추천 주제</h3><p>작성한 내용을 바탕으로 추천했어요. 하나만 선택할 수 있어요.</p></div></div><div className="ai-topics">{topicSuggestions.map(topic => <button key={topic} className={selectedTopic === topic ? "selected" : ""} onClick={() => { setSelectedTopic(topic); setTopicDraft(topic); }}>#{topic}<span>{selectedTopic === topic ? "✓" : "+"}</span></button>)}</div><button className="sheet-primary" onClick={() => setPanel(null)}>추천 주제 적용</button></>}
            {panel === "publish" && <><h3>발행 옵션</h3><p className="sheet-lead">콘텐츠를 누구에게 보여줄지 선택해주세요.</p><div className="publish-options"><div><b>공개 여부</b><span><button className="active">전체</button><button>팔로워</button></span></div><div><b>댓글 작성 대상</b><span><button className="active">전체</button><button>팔로워</button></span></div><label><span><b>리포스트 및 인용 허용</b><small>다른 사람이 콘텐츠를 공유할 수 있어요</small></span><input type="checkbox" defaultChecked/></label><label><span><b>AI 관련 표시</b><small>추천 기능을 사용한 콘텐츠로 표시해요</small></span><input type="checkbox" defaultChecked/></label></div><button className="sheet-primary publish-now" onClick={() => setPanel("success")}>피드에 올리기</button></>}
            {panel === "post-menu" && <><h3>게시물 관리</h3><button className="delete-post-action" onClick={() => { setPublished(false); setPanel(null); flash("게시물을 삭제했어요"); }}><span><Trash2/></span><div><b>삭제하기</b><small>이 게시물을 피드에서 삭제합니다</small></div><ChevronRight/></button></>}
            {panel === "success" && <div className="success-panel"><span>✓</span><small>PUBLISHED</small><h3>피드에 올렸어요!</h3><p>작성한 콘텐츠가 카카오톡 3탭에<br/>새로운 이야기로 추가됐습니다.</p><button onClick={() => {setPublished(true);setFullDraftSaved(false);setPanel(null);setView("feed");flash("콘텐츠가 발행됐어요");}}>피드에서 보기</button></div>}
          </section>
        </div>}

        {exitPrompt === "full" && <DraftSaveDialog onCancel={() => setExitPrompt(null)} onSave={saveFullDraft}/>}
        {toast && <div className="mobile-toast">✓ {toast}</div>}
        <div className="home-indicator"/>
      </section>
      </section>

      <section className="light-prototype-section" aria-labelledby="light-prototype-title">
        <div className="light-prototype-note">
          <span>OPTION 2 · LIGHT COMPOSER</span>
          <h2 id="light-prototype-title">채팅하듯 적고,<br/>전송하듯 올리는 피드</h2>
          <p>익숙한 채팅 입력 방식으로 작성 부담을 낮추고,<br/>짧은 글에 공감과 댓글이 자연스럽게 이어집니다.</p>
          <div className="light-points"><b>발행 대신 전송</b><b>짧고 가벼운 글</b><b>공감과 댓글 중심</b></div>
        </div>

        <section className="light-phone" aria-label="가벼운 글감 프로토타입">
          <StatusBar/>
          <div className="light-screen">
            <header className="light-now-header">
              <h2>지금</h2>
              <div><button aria-label="검색"><Search/></button><button aria-label="대화"><MessageCircle/></button><button aria-label="설정"><Settings/></button></div>
            </header>
            <div className="light-feed-tabs"><button>오픈채팅</button><button className="active">피드</button></div>
            <div className="light-intro"><h3>가벼운 글감</h3><p>짧게 쓰고, 편하게 나누는 커뮤니티</p></div>
            <nav className="light-categories" aria-label="글 카테고리">
              {(["전체", "고민", "일상", "질문"] as LightCategory[]).map(category => <button key={category} className={lightCategory === category ? "active" : ""} onClick={() => setLightCategory(category)}>{category}</button>)}
            </nav>
            <div className="light-post-list">
              {filteredLightPosts.map(post => {
                const liked = likedLightPosts.has(post.id);
                return <article className="light-post" key={post.id}>
                  <div className="light-post-head">
                    <span className="light-avatar">{post.avatar}</span>
                    <div><b>{post.author}</b><small>{post.time} · {post.category}</small></div>
                    <button aria-label="더보기"><MoreHorizontal/></button>
                  </div>
                  {post.series?.length ? <div className="light-post-series">{[post.text, ...post.series].map((text,index) => <div key={`${post.id}-series-${index}`}><b>{index + 1}</b><p>{text}</p></div>)}</div> : <p>{post.text}</p>}
                  {post.image && <img className="light-post-image" src={post.image} alt={`${post.author}님의 글감 사진`}/>}
                  {post.location && <div className="light-post-location"><MapPin/>{post.location}</div>}
                  {post.link && <div className="light-post-link"><span><Link2/></span><div><b>같이 보고 싶은 링크</b><small>{post.link}</small></div><ChevronRight/></div>}
                  {post.poll && <div className="light-post-poll"><b>오늘의 선택은?</b><button>천천히 더 생각해보기</button><button>지금 바로 도전하기</button></div>}
                  {post.quote && <div className="light-post-quote"><MessageSquareQuote/><div><b>인용한 글</b><small>“오늘 하루 중 가장 좋았던 순간은 언제였나요?”</small></div></div>}
                  <div className="light-reactions">
                    <button className={liked ? "active" : ""} onClick={() => toggleLightLike(post.id)}><Heart/> 공감 {post.likes + (liked ? 1 : 0)}</button>
                    <i>·</i>
                    <button><MessageCircle/> 댓글 {post.comments}</button>
                  </div>
                </article>;
              })}
            </div>
            <div className="light-compose">
              <div className="light-input-row">
                <button className="light-plus" aria-label="상세 글감 작성" onClick={openLightDetailComposer}><Plus/></button>
                <div className="light-text-field"><input value={lightDraft} onChange={event => setLightDraft(event.target.value)} placeholder="지금 떠오른 글감을 남겨보세요"/><button type="button" aria-label="이모티콘" onClick={() => setLightDraft(current => `${current}🙂`)}><Smile/></button></div>
                <button className="light-send" aria-label="전송" disabled={!lightDraft.trim()} onClick={publishLightPost}>↑</button>
              </div>
              <div className="light-keyboard">
                <div className="light-suggestions"><span>“갈나요?”</span><span>갈나요</span><span>갈나요ㅎㅎ</span></div>
                {koreanKeyboardRows.map((row, rowIndex) => <div className={`light-key-row row-${rowIndex}`} key={row}>
                  {rowIndex === 2 && <button className="utility">⇧</button>}
                  {[...row].map(key => <button key={key} onClick={() => setLightDraft(current => `${current}${key}`)}>{key}</button>)}
                  {rowIndex === 2 && <button className="utility" onClick={removeLightCharacter}>⌫</button>}
                </div>)}
                <div className="light-key-row light-utility-row">
                  <button>123</button><button onClick={() => setLightDraft(current => `${current}🙂`)}>☺</button><button className="light-space" onClick={() => setLightDraft(current => `${current} `)}>한글</button><button onClick={() => setLightDraft(current => `${current}\n`)}>↵</button>
                </div>
                <div className="light-keyboard-foot"><Globe2/><Mic/></div>
              </div>
            </div>
          </div>
          {lightDetailOpen && <div className="light-detail-overlay">
            <StatusBar/>
            <div className="screen composer-screen light-detail-screen">
              <header className="composer-top"><button className="close-compose" aria-label="상세 작성 닫기" onClick={requestLightDetailClose}><X/></button><span/><button className="draft-icon" aria-label="작성 옵션"><SlidersHorizontal/></button><button className="upload-button" disabled={!hasLightDetailContent} onClick={publishLightDetailPost}>올리기</button></header>
              <div className="composer-scroll light-detail-scroll">
                <article className="editor-block">
                  <div className="editor-line"><Avatar/><small>1</small><i/></div>
                  <div className="editor-body">
                    <b>춘식크루</b>
                    <textarea aria-label="상세 글감 내용" value={lightDetailText} autoFocus placeholder="더 자세한 이야기를 적어보세요" onFocus={() => setLightDetailActiveSeriesId(0)} onChange={event => setLightDetailText(event.target.value)}/>
                    {lightDetailPhoto && <div className="light-detail-media"><img src={lightDetailPhoto} alt="첨부한 사진"/><button aria-label="사진 삭제" onClick={() => setLightDetailPhoto(null)}><X/></button></div>}
                    {lightDetailLocation && <div className="editor-attachment"><span><MapPin/></span><div><small>위치</small><b>{lightDetailLocation}</b></div><button onClick={() => setLightDetailLocation(null)}>×</button></div>}
                    {lightDetailLink && <div className="editor-attachment"><span><Link2/></span><div><small>링크</small><b>{lightDetailLink}</b></div><button onClick={() => setLightDetailLink(null)}>×</button></div>}
                    {lightDetailPoll && <div className="mini-poll"><b>오늘의 선택은?</b><span>천천히 더 생각해보기</span><span>지금 바로 도전하기</span><button onClick={() => setLightDetailPoll(false)}>투표 삭제</button></div>}
                    {lightDetailQuote && <div className="light-detail-quote-preview"><MessageSquareQuote/><div><b>인용한 글</b><p>오늘 하루 중 가장 좋았던 순간은 언제였나요?</p></div><button onClick={() => setLightDetailQuote(false)}><X/></button></div>}
                  </div>
                </article>
                {lightDetailSeries.map((item,index) => <article className="editor-block light-detail-series-block" key={item.id}>
                  <div className="editor-line"><Avatar/><small>{index + 2}</small><i/></div>
                  <div className="editor-body light-detail-series-body">
                    <button className="remove-series" aria-label={`${index + 2}번째 글감 삭제`} onClick={() => removeLightDetailSeries(item.id)}><X/></button>
                    <textarea
                      aria-label={`${index + 2}번째 상세 글감 내용`}
                      value={item.text}
                      autoFocus={lightDetailActiveSeriesId === item.id}
                      placeholder="다른 콘텐츠 추가"
                      onFocus={() => setLightDetailActiveSeriesId(item.id)}
                      onChange={event => setLightDetailSeries(current => current.map(series => series.id === item.id ? { ...series, text: event.target.value } : series))}
                    />
                  </div>
                </article>)}
                <div className="series-add-row light-detail-add-row">
                  <div className="series-add-track"><i/><button aria-label="시리즈 글감 추가" disabled={!canAddLightDetailSeries} onClick={addLightDetailSeries}><Plus/></button></div>
                  <small>{canAddLightDetailSeries ? "다른 글감 추가" : "위 글감에 글자를 입력하면 추가할 수 있어요"}</small>
                </div>
              </div>
              <div className="composer-bottom">
                <div className="tool-bar">
                  <button aria-label="사진 추가" onClick={() => setLightDetailTool("photo")}><ImageIcon/></button>
                  <button aria-label="위치 추가" onClick={() => setLightDetailTool("location")}><MapPin/></button>
                  <button aria-label="링크 추가" onClick={() => setLightDetailTool("link")}><Link2/></button>
                  <button aria-label="투표 추가" onClick={() => setLightDetailTool("poll")}><SquareCheckBig/></button>
                  <button aria-label="게시물 인용" onClick={() => setLightDetailTool("quote")}><MessageSquareQuote/></button>
                  <button aria-label="이모티콘 추가" onClick={() => addLightDetailKey("🙂")}><Smile/></button>
                  <i/>
                  <button className="ai-button" aria-label="AI 글감 추천" onClick={() => setLightDetailTool("ai")}><Sparkles/><b>AI</b></button>
                </div>
                <div className="fake-keyboard">
                  <div className="suggestions"><span>I</span><span>The</span><span>I’m</span></div>
                  {keyboardRows.map((row, rowIndex) => <div className={`key-row row-${rowIndex}`} key={row}>{rowIndex === 2 && <button className="wide-key">⬆</button>}{[...row].map(key => <button key={key} onClick={() => addLightDetailKey(key)}>{key}</button>)}{rowIndex === 2 && <button className="wide-key" onClick={removeLightDetailCharacter}>⌫</button>}</div>)}
                  <div className="key-row utility-row"><button>123</button><button onClick={() => addLightDetailKey("🙂")}>☺</button><button className="space" onClick={() => addLightDetailKey(" ")}>space <small>EN</small></button><button onClick={() => addLightDetailKey("\n")}>↵</button></div>
                  <div className="keyboard-foot"><button aria-label="키보드 언어"><Globe2/></button><button aria-label="음성 입력"><Mic/></button></div>
                </div>
              </div>
            </div>
            {lightDetailTool && <div className="phone-overlay light-detail-tool-overlay" onMouseDown={() => setLightDetailTool(null)}>
              <section className="mobile-sheet light-detail-sheet" role="dialog" aria-modal="true" aria-label="상세 글감 도구" onMouseDown={event => event.stopPropagation()}>
                <div className="sheet-handle"/><button className="sheet-close" aria-label="닫기" onClick={() => setLightDetailTool(null)}><X/></button>
                {lightDetailTool === "photo" && <><h3>사진 또는 영상</h3><p className="sheet-lead">글감에 보여줄 이미지를 선택하세요.</p><div className="light-detail-photo-grid">{photos.map((photo,index) => <button key={photo} onClick={() => { setLightDetailPhoto(photo); setLightDetailTool(null); }}><img src={photo} alt={`추천 사진 ${index + 1}`}/></button>)}</div></>}
                {lightDetailTool === "location" && <><h3>위치</h3><div className="place-list">{["판교역", "서울숲", "한강공원"].map(place => <button key={place} onClick={() => { setLightDetailLocation(place); setLightDetailTool(null); }}><span><MapPin/></span><div><b>{place}</b><small>추천 위치</small></div><i><Plus/></i></button>)}</div></>}
                {lightDetailTool === "link" && <><h3>링크</h3><label className="sheet-input">URL 입력<input defaultValue="https://brunch.co.kr/" autoFocus/></label><div className="link-preview"><span><Link2/></span><div><b>같이 보고 싶은 이야기</b><small>brunch.co.kr</small></div></div><button className="sheet-primary" onClick={() => { setLightDetailLink("https://brunch.co.kr/"); setLightDetailTool(null); }}>링크 추가</button></>}
                {lightDetailTool === "poll" && <><h3>투표</h3><label className="sheet-input">질문<input defaultValue="오늘의 선택은?"/></label><label className="sheet-input">선택지 1<input defaultValue="천천히 더 생각해보기"/></label><label className="sheet-input">선택지 2<input defaultValue="지금 바로 도전하기"/></label><button className="sheet-primary" onClick={() => { setLightDetailPoll(true); setLightDetailTool(null); }}>투표 추가</button></>}
                {lightDetailTool === "quote" && <><h3>인용할 글</h3><button className="light-quote-option" onClick={() => { setLightDetailQuote(true); setLightDetailTool(null); }}><span>🌙</span><div><b>밤산책</b><p>오늘 하루 중 가장 좋았던 순간은 언제였나요?</p></div><ChevronRight/></button></>}
                {lightDetailTool === "ai" && <><div className="ai-head"><span><Sparkles/></span><div><h3>AI 글감 추천</h3><p>지금 가볍게 나누기 좋은 주제예요.</p></div></div><div className="ai-topics">{["오늘 가장 기억에 남은 순간", "요즘 나를 웃게 한 것", "누군가에게 묻고 싶은 고민"].map(topic => <button key={topic} onClick={() => { setLightDetailText(current => `${current}${current ? "\n" : ""}${topic}`); setLightDetailTool(null); }}>#{topic}<span>＋</span></button>)}</div></>}
              </section>
            </div>}
            {exitPrompt === "light" && <DraftSaveDialog onCancel={() => setExitPrompt(null)} onSave={saveLightDetailDraft}/>}
            <div className="home-indicator"/>
          </div>}
          <div className="home-indicator"/>
        </section>
      </section>
    </main>
  );
}

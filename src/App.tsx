import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Paintbrush,
  Camera, CameraOff,
  MessageCircle, Video,
  Check, CheckCheck,
  MessageSquare,
  Copy, Dice3,
  Smile, Key, Image,
  Lock,
  Mic, MicOff,
  Paperclip,
  Phone, PhoneOff,
  Plus, QrCode,
  Search, Wrench,
  Shield,
  Trash2,
  User, UserPlus,
  Volume2, VolumeX,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ============================================================
   CONSTANTS
   ============================================================ */
const COLORS = ["#7c3aed", "#0ea5e9", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6"];

interface ThemeStyle {
  name: string;
  emoji: string;
  glass: boolean;
  bg: string;
  panel: string;
  panelSolid: string;
  text: string;
  sub: string;
  bubbleMe: string;
  bubbleThem: string;
  accent: string;
  border: string;
  wallpaper: string;
}

const THEMES: Record<string, ThemeStyle> = {
  "liquid-glass": {
    name: "Liquid Glass", emoji: "🫧", glass: true,
    bg: "linear-gradient(160deg,#0b1020 0%,#1a2540 45%,#0b1020 100%)",
    panel: "rgba(255,255,255,0.07)", panelSolid: "#101627", text: "#f4f7ff", sub: "#9fb0d0",
    bubbleMe: "linear-gradient(135deg,rgba(124,58,237,0.85),rgba(14,165,233,0.7))",
    bubbleThem: "rgba(255,255,255,0.10)", accent: "#8b9fff", border: "rgba(255,255,255,0.12)",
    wallpaper: "radial-gradient(circle at 20% 20%,rgba(124,58,237,0.25),transparent 40%),radial-gradient(circle at 80% 70%,rgba(14,165,233,0.25),transparent 45%)",
  },
  "neon-cyber": {
    name: "Neon Cyber", emoji: "🌃", glass: false,
    bg: "#05060a", panel: "#0c0e16", panelSolid: "#0c0e16", text: "#e8fbff", sub: "#5f6b8c",
    bubbleMe: "linear-gradient(135deg,#00f0ff,#7c3aed)", bubbleThem: "#131622",
    accent: "#00f0ff", border: "#1b2236", wallpaper: "linear-gradient(180deg,#05060a,#05060a)",
  },
  "midnight-ocean": {
    name: "Midnight Ocean", emoji: "🌊", glass: true,
    bg: "linear-gradient(170deg,#020617 0%,#0c1e3d 50%,#042f2e 100%)",
    panel: "rgba(15,30,55,0.55)", panelSolid: "#0a1628", text: "#e2f0ff", sub: "#7da3c9",
    bubbleMe: "linear-gradient(135deg,#0ea5e9,#06b6d4)", bubbleThem: "rgba(30,55,90,0.5)",
    accent: "#22d3ee", border: "rgba(56,130,180,0.25)",
    wallpaper: "radial-gradient(circle at 30% 10%,rgba(14,165,233,0.18),transparent 50%),radial-gradient(circle at 70% 90%,rgba(6,182,212,0.18),transparent 50%)",
  },
  "aurora": {
    name: "Aurora", emoji: "🌌", glass: true,
    bg: "linear-gradient(160deg,#0f0c29,#302b63,#24243e)",
    panel: "rgba(255,255,255,0.06)", panelSolid: "#15122e", text: "#f0eaff", sub: "#a59fd0",
    bubbleMe: "linear-gradient(135deg,#a855f7,#ec4899)", bubbleThem: "rgba(255,255,255,0.08)",
    accent: "#c084fc", border: "rgba(168,85,247,0.25)",
    wallpaper: "radial-gradient(circle at 15% 25%,rgba(168,85,247,0.25),transparent 45%),radial-gradient(circle at 85% 75%,rgba(236,72,153,0.22),transparent 50%)",
  },
  "sunset": {
    name: "Sunset Glow", emoji: "🌅", glass: true,
    bg: "linear-gradient(160deg,#1a0a1f,#3d1326,#2a0e1a)",
    panel: "rgba(255,200,150,0.06)", panelSolid: "#1f0d18", text: "#ffe9df", sub: "#c9a08e",
    bubbleMe: "linear-gradient(135deg,#f59e0b,#ef4444)", bubbleThem: "rgba(255,255,255,0.07)",
    accent: "#fb923c", border: "rgba(251,146,60,0.2)",
    wallpaper: "radial-gradient(circle at 20% 80%,rgba(245,158,11,0.22),transparent 50%),radial-gradient(circle at 80% 20%,rgba(239,68,68,0.18),transparent 50%)",
  },
  "matrix": {
    name: "Matrix", emoji: "🟢", glass: false,
    bg: "#000402", panel: "#031008", panelSolid: "#031008", text: "#3fff7a", sub: "#1d8c45",
    bubbleMe: "linear-gradient(135deg,#00ff66,#00aa44)", bubbleThem: "#04150b",
    accent: "#00ff66", border: "#0a2a16", wallpaper: "#000402",
  },
};

const EMOJIS = ["😀","😂","🥰","😎","🤔","😢","😡","👍","👎","🙏","🔥","💯","✨","🎉","❤️","💜","💙","💚","🫧","👻","🤖","🦊","🌈","⚡","💀","🥷","🛡️","🔑","📞","🎥","📸","🎤"];

const WALLPAPERS = [
  { id: "none", label: "None", val: "transparent" },
  { id: "dots", label: "Dots", val: "radial-gradient(rgba(255,255,255,0.08) 1px,transparent 1px) 0 0/20px 20px" },
  { id: "grid", label: "Grid", val: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px) 0 0/24px 24px" },
  { id: "blur", label: "Aurora Glow", val: "radial-gradient(circle at 25% 30%,rgba(124,58,237,0.15),transparent 40%),radial-gradient(circle at 75% 70%,rgba(14,165,233,0.15),transparent 40%)" },
];

const THEME_IDS = Object.keys(THEMES);

/* ============================================================
   UTILITIES
   ============================================================ */
function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, setVal] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return Math.floor(d / 60000) + "m";
  if (d < 86400000) return Math.floor(d / 3600000) + "h";
  return Math.floor(d / 86400000) + "d";
}
function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function shortId(id: string): string { return id.slice(0, 8).toUpperCase(); }
function randName(): string {
  const a = ["Ghost","Shadow","Phantom","Cipher","Echo","Nova","Raven","Onyx","Frost","Vortex","Specter","Pulse"];
  const b = ["Walker","Runner","Hunter","Knight","Wolf","Falcon","Drift","Spark","Byte","Flux","Blade","Wave"];
  return a[Math.floor(Math.random() * a.length)] + " " + b[Math.floor(Math.random() * b.length)] + " " + Math.floor(Math.random() * 90 + 10);
}

/* ============================================================
   TYPES
   ============================================================ */
interface Profile {
  id: string;
  name: string;
  color: string;
}

interface Peer {
  id: string;
  name: string;
  color: string;
  lastSeen: number;
  online: boolean;
}

interface Message {
  id: string;
  from: string;
  to: string;
  ts: number;
  status: string;
  kind: string;
  text?: string;
  media?: string;
  dur?: number;
}

interface Settings {
  theme: string;
  accent: string;
  enterToSend: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  soundOnSend: boolean;
  notifications: boolean;
  blockUnknown: boolean;
  autoDelete: boolean;
  fontSize: number;
  blur: number;
  showOnline: boolean;
  encryptLabel: boolean;
  wallpaper: string;
}

/* ============================================================
   CHAT ENGINE — BroadcastChannel messaging + WebRTC calls
   ============================================================ */
const CHANNEL = "ghostchat-net-v1";

function useChatEngine(profile: Profile | null, onMessage: (m: Message) => void) {
  const chRef = useRef<BroadcastChannel | null>(null);
  const [peers, setPeers] = useState<Record<string, Peer>>({});
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [incomingCall, setIncomingCall] = useState<{from: string; kind: string; offer: string} | null>(null);
  const iceRef = useRef(null);
  const onReadRef = useRef<((from: string, ids: string[]) => void) | null>(null);

  const send = useCallback((w: any) => {
    try { chRef.current?.postMessage(w); } catch {}
  }, []);

  useEffect(() => {
    if (!profile) return;
    const ch = new BroadcastChannel(CHANNEL);
    chRef.current = ch;
    ch.postMessage({ t: "hello", profile });

    const beat = setInterval(() => ch.postMessage({ t: "ping", profile }), 4000);

    const handler = (e: MessageEvent) => {
      const w = e.data;
      if (!w || w.t === undefined) return;
      switch (w.t) {
        case "hello":
        case "ping": {
          if (w.profile.id === profile.id) return;
          setPeers(prev => ({ ...prev, [w.profile.id]: { id: w.profile.id, name: w.profile.name, color: w.profile.color, lastSeen: Date.now(), online: true } }));
          if (w.t === "hello") ch.postMessage({ t: "ping", profile });
          break;
        }
        case "bye":
          setPeers(prev => { const n = { ...prev }; delete n[w.id]; return n; });
          break;
        case "msg": {
          if (w.msg.to !== profile.id && w.msg.to !== "*") return;
          onMessage(w.msg);
          send({ t: "read", from: profile.id, to: w.msg.from, ids: [w.msg.id] });
          break;
        }
        case "read":
          if (w.to === profile.id && onReadRef.current) onReadRef.current(w.from, w.ids);
          break;
        case "typing":
          if (w.to !== profile.id) return;
          setTyping(prev => ({ ...prev, [w.from]: w.on }));
          if (w.on) setTimeout(() => setTyping(prev => ({ ...prev, [w.from]: false })), 4000);
          break;
        case "call":
          if (w.to !== profile.id) return;
          setIncomingCall({ from: w.from, kind: w.kind, offer: w.offer });
          break;
        case "answer":
        case "ice":
        case "call-end":
        case "call-reject":
          window.dispatchEvent(new CustomEvent("ghost-call", { detail: w }));
          break;
      }
    };
    ch.addEventListener("message", handler);

    const onUnload = () => { ch.postMessage({ t: "bye", id: profile.id }); };
    window.addEventListener("beforeunload", onUnload);

    const prune = setInterval(() => {
      setPeers(prev => {
        const n: Record<string, Peer> = {};
        for (const [id, p] of Object.entries(prev)) n[id] = { ...p, online: Date.now() - p.lastSeen < 12000 };
        return n;
      });
    }, 5000);

    return () => {
      clearInterval(beat); clearInterval(prune);
      ch.removeEventListener("message", handler);
      ch.postMessage({ t: "bye", id: profile.id });
      window.removeEventListener("beforeunload", onUnload);
      ch.close();
    };
  }, [profile, onMessage, send]);

  return { peers, typing, send, incomingCall, setIncomingCall, iceRef, onReadRef };
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function GAvatar({ name, color, size, online }: { name: string; color: string; size?: number; online?: boolean }) {
  const sz = size || 40;
  const init = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="relative shrink-0" style={{ width: sz, height: sz }}>
      <div className="flex h-full w-full items-center justify-center rounded-full font-bold text-white"
        style={{ background: "linear-gradient(135deg," + color + ",#00000040)", fontSize: sz * 0.38 }}>
        {init}
      </div>
      {online !== undefined && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black/30"
          style={{ background: online ? "#22c55e" : "#64748b" }} />
      )}
    </div>
  );
}

function Glass({ theme, children, className, solid, onClick, style }: { theme: string; children: React.ReactNode; className?: string; solid?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  const T = THEMES[theme];
  return (
    <div onClick={onClick} className={(className || "") + " rounded-2xl border"}
      style={{
        background: solid ? T.panelSolid : T.panel,
        borderColor: T.border,
        backdropFilter: T.glass ? "blur(18px) saturate(1.4)" : undefined,
        WebkitBackdropFilter: T.glass ? "blur(18px) saturate(1.4)" : undefined,
        ...style,
      }}>
      {children}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function GhostChatApp() {
  const [profile, setProfile] = useLocalStorage<Profile | null>("gc_profile", null);
  const [settings, setSettings] = useLocalStorage<Settings>("gc_settings", {
    theme: "liquid-glass", accent: "#8b9fff", enterToSend: true, readReceipts: true,
    typingIndicators: true, soundOnSend: true, notifications: true, blockUnknown: false,
    autoDelete: false, fontSize: 15, blur: 18, showOnline: true, encryptLabel: true, wallpaper: "blur",
  });
  const [messages, setMessages] = useLocalStorage<Record<string, Message[]>>("gc_msgs", {});
  const [activePeer, setActivePeer] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showCall, setShowCall] = useState<{peerId: string; kind: string; initiator: boolean} | null>(null);
  const [search, setSearch] = useState("");

  const onMessage = useCallback((m: Message) => {
    setMessages(prev => {
      const key = m.from === profile?.id ? m.to : m.from;
      const list = prev[key] || [];
      if (list.some(x => x.id === m.id)) return prev;
      return { ...prev, [key]: [...list, m] };
    });
  }, [profile, setMessages]);

  const engine = useChatEngine(profile, onMessage);
  const { peers, typing, send, incomingCall, setIncomingCall } = engine;

  useEffect(() => {
    if (!profile) return;
    engine.onReadRef.current = (from: string, ids: string[]) => {
      setMessages(prev => {
        const list = prev[from];
        if (!list) return prev;
        const n = list.map(m => ids.includes(m.id) ? { ...m, status: "read" } : m);
        return { ...prev, [from]: n };
      });
    };
  }, [profile, engine, setMessages]);

  useEffect(() => {
    if (!profile || !activePeer) return;
    const list = messages[activePeer] || [];
    const unread = list.filter(m => m.to === profile.id && m.status !== "read");
    if (unread.length) {
      send({ t: "read", from: profile.id, to: activePeer, ids: unread.map(m => m.id) });
      setMessages(prev => ({ ...prev, [activePeer]: list.map(m => m.to === profile.id ? { ...m, status: "read" } : m) }));
    }
  }, [activePeer, messages, profile, send, setMessages]);

  useEffect(() => {
    if (incomingCall && profile) {
      setShowCall({ peerId: incomingCall.from, kind: incomingCall.kind, initiator: false });
    }
  }, [incomingCall, profile]);

  if (!profile) return <Welcome onCreate={(p: Profile) => setProfile(p)} theme={settings.theme} />;

  const T = THEMES[settings.theme];
  const peerList = Object.values(peers).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const active = activePeer ? peers[activePeer] : null;
  const activeMsgs = activePeer ? (messages[activePeer] || []) : [];

  const handleSend = (msg: { kind: string; text?: string; media?: string; dur?: number }) => {
    if (!profile || !activePeer) return;
    const full: Message = {
      id: uuidv4(), from: profile.id, to: activePeer, ts: Date.now(), status: "sent", kind: msg.kind || "text",
      text: msg.text, media: msg.media, dur: msg.dur,
    };
    setMessages(prev => ({ ...prev, [activePeer]: [...(prev[activePeer] || []), full] }));
    send({ t: "msg", msg: full });
    if (settings.soundOnSend) try { new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=").play().catch(()=>{}); } catch {}
  };

  const handleTyping = (on: boolean) => {
    if (!profile || !activePeer || !settings.typingIndicators) return;
    send({ t: "typing", from: profile.id, to: activePeer, on });
  };

  const startCall = (kind: string) => {
    if (!activePeer) return;
    setShowCall({ peerId: activePeer, kind, initiator: true });
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans" style={{ background: T.bg, color: T.text, fontSize: settings.fontSize }}>
      <style>{`*{scrollbar-width:thin;scrollbar-color:${T.border} transparent}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}`}</style>
      <div className="flex h-full">
        <Sidebar
          theme={settings.theme} profile={profile} peers={peerList} messages={messages}
          activePeer={activePeer} setActivePeer={setActivePeer} search={search} setSearch={setSearch}
          onOpenSettings={() => setShowSettings(true)} onOpenProfile={() => setShowProfile(true)}
          onOpenAdd={() => setShowAdd(true)} showOnline={settings.showOnline} typing={typing}
        />

        <div className="flex flex-1 flex-col" style={{ borderLeft: "1px solid " + T.border }}>
          {active ? (
            <ChatPanel
              theme={settings.theme} peer={active} profile={profile} messages={activeMsgs}
              onSend={handleSend} onTyping={handleTyping} typing={typing[active.id]}
              onCall={startCall} settings={settings} wallpaper={WALLPAPERS.find(w => w.id === settings.wallpaper)?.val}
              send={send}
            />
          ) : (
            <EmptyState theme={settings.theme} profile={profile} onAdd={() => setShowAdd(true)} />
          )}
        </div>
      </div>

      <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} theme={settings.theme}
        settings={settings} setSettings={setSettings} onResetProfile={() => {
          if (confirm("Reset profile? This generates a new anonymous identity. Your chats stay.")) {
            setProfile({ id: uuidv4(), name: randName(), color: COLORS[Math.floor(Math.random()*COLORS.length)] });
          }
        }} onClearChats={() => { if (confirm("Delete all messages?")) setMessages({}); }} />

      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} theme={settings.theme}
        profile={profile} setProfile={setProfile} />

      <AddContactModal open={showAdd} onClose={() => setShowAdd(false)} theme={settings.theme}
        profile={profile} peers={peerList} />

      <AnimatePresence>
        {showCall && (
          <CallScreen
            key="call" theme={settings.theme} peerId={showCall.peerId} kind={showCall.kind}
            initiator={showCall.initiator} profile={profile} peers={peers} send={send}
            incomingOffer={incomingCall} onClearIncoming={() => setIncomingCall(null)}
            onClose={() => { setShowCall(null); setIncomingCall(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   WELCOME / ONBOARDING
   ============================================================ */
function Welcome({ onCreate, theme }: { onCreate: (p: Profile) => void; theme: string }) {
  const [name, setName] = useState(randName());
  const [color, setColor] = useState(COLORS[0]);
  const T = THEMES[theme];
  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: T.bg }}>
      <Glass theme={theme} className="w-full max-w-md p-8 text-center" style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#0ea5e9)" }}>
            <Key className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">GhostChat</h1>
          <p className="mt-1 text-sm" style={{ color: T.sub }}>Anonymous messaging · No login · No phone · No email</p>
        </motion.div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <GAvatar name={name || "?"} color={color} size={56} />
            <div className="flex-1 text-left">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="border-0 bg-transparent text-lg font-semibold focus-visible:ring-0" style={{ color: T.text }} />
              <p className="text-xs" style={{ color: T.sub }}>ID: <span className="font-mono">{shortId("TEMP-" + uuidv4())}</span> (auto)</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setName(randName())} style={{ color: T.sub }}>
              <Dice3 className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} className="h-8 w-8 rounded-full transition"
                style={{ background: c, outline: color === c ? "3px solid white" : "none", outlineOffset: 2 }} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: T.sub }}>
            {[["🛡️","E2E style"],["🫧","Liquid Glass"],["🎥","Video calls"],["🎤","Voice msgs"],["👤","Anonymous"],["🎨","6 themes"]].map(arr => (
              <div key={arr[1]} className="rounded-xl p-2" style={{ background: T.panel, border: "1px solid " + T.border }}>
                <div className="text-lg">{arr[0]}</div><div>{arr[1]}</div>
              </div>
            ))}
          </div>

          <Button className="w-full text-base font-semibold" size="lg"
            style={{ background: "linear-gradient(135deg," + color + ",#00000050)", color: "white" }}
            onClick={() => onCreate({ id: uuidv4(), name: name || randName(), color })}>
            <Key className="mr-2 h-5 w-5" /> Generate Anonymous ID
          </Button>
          <p className="text-[11px]" style={{ color: T.sub }}>Open this app in multiple tabs/windows to chat with others on this device. Each tab is a different anonymous identity.</p>
        </div>
      </Glass>
    </div>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function Sidebar({ theme, profile, peers, messages, activePeer, setActivePeer, search, setSearch,
  onOpenSettings, onOpenProfile, onOpenAdd, showOnline, typing }: {
  theme: string; profile: Profile; peers: Peer[]; messages: Record<string, Message[]>;
  activePeer: string | null; setActivePeer: (id: string) => void; search: string;
  setSearch: (s: string) => void; onOpenSettings: () => void; onOpenProfile: () => void;
  onOpenAdd: () => void; showOnline: boolean; typing: Record<string, boolean>;
}) {
  const T = THEMES[theme];
  const sorted = [...peers].sort((a, b) => {
    const la = (messages[a.id] || []).slice(-1)[0]?.ts || 0;
    const lb = (messages[b.id] || []).slice(-1)[0]?.ts || 0;
    return lb - la;
  });
  return (
    <div className="flex w-[340px] flex-col" style={{ background: T.panel, borderRight: "1px solid " + T.border, backdropFilter: T.glass ? "blur(18px)" : undefined }}>
      <div className="flex items-center gap-2 p-3" style={{ borderBottom: "1px solid " + T.border }}>
        <button onClick={onOpenProfile} className="rounded-full transition hover:opacity-80">
          <GAvatar name={profile.name} color={profile.color} size={42} online={showOnline} />
        </button>
        <div className="flex-1 text-left">
          <div className="font-semibold leading-tight">{profile.name}</div>
          <div className="flex items-center gap-1 text-[11px]" style={{ color: T.sub }}>
            <Shield className="h-3 w-3" /> {shortId(profile.id)} · anonymous
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onOpenAdd} style={{ color: T.text }}><Plus className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" onClick={onOpenSettings} style={{ color: T.text }}><Wrench className="h-5 w-5" /></Button>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: T.panel, border: "1px solid " + T.border }}>
          <Search className="h-4 w-4" style={{ color: T.sub }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..."
            className="w-full bg-transparent text-sm outline-none" style={{ color: T.text }} />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm" style={{ color: T.sub }}>
            <UserPlus className="mx-auto mb-2 h-10 w-10 opacity-40" />
            No chats yet.<br />Open a new tab of this app to create another identity, or share your ID.
          </div>
        ) : sorted.map(p => {
          const msgs = (messages[p.id] || []);
          const last = msgs[msgs.length - 1];
          const unread = msgs.filter(m => m.to === profile.id && m.status !== "read").length;
          const isTyping = typing[p.id];
          return (
            <button key={p.id} onClick={() => setActivePeer(p.id)}
              className="mb-1 flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition"
              style={{ background: activePeer === p.id ? T.panel : "transparent", border: "1px solid " + (activePeer === p.id ? T.border : "transparent") }}>
              <GAvatar name={p.name} color={p.color} size={46} online={showOnline ? p.online : undefined} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="text-[10px]" style={{ color: T.sub }}>{last ? fmtTime(last.ts) : ""}</span>
                </div>
                <div className="truncate text-xs" style={{ color: T.sub }}>
                  {isTyping ? <span style={{ color: T.accent }}>typing...</span> :
                   last ? (last.kind === "image" ? "📷 Photo" : last.kind === "voice" ? "🎤 Voice" : last.kind === "video" ? "🎥 Video" : last.text || "") :
                   <span style={{ color: T.accent }}>{shortId(p.id)}</span>}
                </div>
              </div>
              {unread > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white"
                  style={{ background: T.accent }}>{unread}</div>
              )}
            </button>
          );
        })}
      </ScrollArea>

      <div className="p-3 text-center text-[10px]" style={{ color: T.sub, borderTop: "1px solid " + T.border }}>
        <Wifi className="mr-1 inline h-3 w-3" /> GhostChat · peer-to-peer · {peers.length} online
      </div>
    </div>
  );
}

/* ============================================================
   CHAT PANEL
   ============================================================ */
function ChatPanel({ theme, peer, profile, messages, onSend, onTyping, typing, onCall, settings, wallpaper, send }: {
  theme: string; peer: Peer; profile: Profile; messages: Message[];
  onSend: (msg: { kind: string; text?: string; media?: string; dur?: number }) => void;
  onTyping: (on: boolean) => void; typing: boolean | undefined;
  onCall: (kind: string) => void; settings: Settings;
  wallpaper: string | undefined; send: (w: any) => void;
}) {
  const T = THEMES[theme];
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recDur, setRecDur] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const vidInput = useRef<HTMLInputElement>(null);
  const mediaRec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingSent = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const submit = () => {
    if (!draft.trim()) return;
    onSend({ kind: "text", text: draft.trim() });
    setDraft("");
    onTyping(false);
    typingSent.current = false;
  };

  const onType = (v: string) => {
    setDraft(v);
    if (settings.typingIndicators && !typingSent.current && v) {
      onTyping(true); typingSent.current = true;
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => { onTyping(false); typingSent.current = false; }, 2000);
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => onSend({ kind: "image", media: r.result as string });
    r.readAsDataURL(f);
    setShowAttach(false); e.target.value = "";
  };
  const onVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => onSend({ kind: "video", media: r.result as string });
    r.readAsDataURL(f);
    setShowAttach(false); e.target.value = "";
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const mr = new MediaRecorder(stream);
      mediaRec.current = mr;
      mr.ondataavailable = ev => chunks.current.push(ev.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        onSend({ kind: "voice", media: url, dur: recDur });
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true); setRecDur(0);
      recTimer.current = setInterval(() => setRecDur(d => d + 1), 1000);
    } catch { alert("Microphone access denied"); }
  };
  const stopRec = () => {
    mediaRec.current?.stop();
    setRecording(false);
    if (recTimer.current) clearInterval(recTimer.current);
  };

  return (
    <div className="flex h-full flex-col" style={{ background: wallpaper, position: "relative" }}>
      <div className="flex items-center gap-3 p-3" style={{ background: T.panel, borderBottom: "1px solid " + T.border, backdropFilter: T.glass ? "blur(18px)" : undefined }}>
        <GAvatar name={peer.name} color={peer.color} size={42} online={settings.showOnline ? peer.online : undefined} />
        <div className="flex-1">
          <div className="font-semibold leading-tight">{peer.name}</div>
          <div className="text-[11px]" style={{ color: typing ? T.accent : T.sub }}>
            {typing ? "typing..." : (settings.showOnline ? (peer.online ? "online" : "last seen " + timeAgo(peer.lastSeen)) : shortId(peer.id))}
          </div>
        </div>
        {settings.encryptLabel && (
          <Badge variant="outline" className="hidden sm:flex" style={{ borderColor: T.border, color: T.sub }}>
            <Lock className="mr-1 h-3 w-3" /> encrypted
          </Badge>
        )}
        <Button variant="ghost" size="icon" onClick={() => onCall("audio")} style={{ color: T.text }}><Phone className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" onClick={() => onCall("video")} style={{ color: T.text }}><Video className="h-5 w-5" /></Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-1.5">
          {messages.length === 0 && (
            <div className="mt-20 text-center text-sm" style={{ color: T.sub }}>
              <MessageCircle className="mx-auto mb-2 h-12 w-12 opacity-30" />
              No messages yet. Say hi to {peer.name}!<br />
              <span className="text-xs">This is a real peer connection — open another tab to chat.</span>
            </div>
          )}
          {messages.map((m, i) => {
            const mine = m.from === profile.id;
            const prev = messages[i - 1];
            const showAvatar = !mine && (!prev || prev.from !== m.from);
            return <MessageBubble key={m.id} m={m} mine={mine} theme={theme} showAvatar={showAvatar} peer={peer} settings={settings} />;
          })}
        </div>
      </div>

      <AnimatePresence>
        {showEmoji && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden" style={{ background: T.panel, borderTop: "1px solid " + T.border }}>
            <div className="grid grid-cols-8 gap-1 p-3">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => { setDraft(d => d + e); setShowEmoji(false); }}
                  className="rounded-lg p-1.5 text-xl transition hover:scale-125" style={{ background: T.panel }}>{e}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAttach && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden" style={{ background: T.panel, borderTop: "1px solid " + T.border }}>
            <div className="flex gap-3 p-3">
              <button onClick={() => imgInput.current?.click()} className="flex flex-1 flex-col items-center gap-1 rounded-xl p-3 transition hover:opacity-80" style={{ background: T.panel, border: "1px solid " + T.border }}>
                <Image className="h-6 w-6" style={{ color: T.accent }} /><span className="text-xs">Photo</span>
              </button>
              <button onClick={() => vidInput.current?.click()} className="flex flex-1 flex-col items-center gap-1 rounded-xl p-3 transition hover:opacity-80" style={{ background: T.panel, border: "1px solid " + T.border }}>
                <Video className="h-6 w-6" style={{ color: T.accent }} /><span className="text-xs">Video</span>
              </button>
              <button onClick={startRec} className="flex flex-1 flex-col items-center gap-1 rounded-xl p-3 transition hover:opacity-80" style={{ background: T.panel, border: "1px solid " + T.border }}>
                <Mic className="h-6 w-6" style={{ color: T.accent }} /><span className="text-xs">Voice</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recording && (
          <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="flex items-center gap-3 p-3" style={{ background: "#ef444420", borderTop: "1px solid #ef4444" }}>
            <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-300">Recording... {Math.floor(recDur/60)}:{String(recDur%60).padStart(2,"0")}</span>
            <div className="flex-1" />
            <Button size="sm" variant="ghost" onClick={stopRec} className="text-red-300">Stop & Send</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 p-3" style={{ background: T.panel, borderTop: "1px solid " + T.border, backdropFilter: T.glass ? "blur(18px)" : undefined }}>
        <Button variant="ghost" size="icon" onClick={() => { setShowEmoji(s => !s); setShowAttach(false); }} style={{ color: T.text }}>
          <Smile className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => { setShowAttach(s => !s); setShowEmoji(false); }} style={{ color: T.text }}>
          <Paperclip className="h-5 w-5" />
        </Button>
        <textarea
          value={draft} onChange={e => onType(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && settings.enterToSend) { e.preventDefault(); submit(); } }}
          placeholder="Message..." rows={1}
          className="max-h-32 flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: T.panelSolid, border: "1px solid " + T.border, color: T.text }}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={submit} disabled={!draft.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-40"
          style={{ background: T.accent, color: "#000" }}>
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>

      <input ref={imgInput} type="file" accept="image/*" hidden onChange={onImage} />
      <input ref={vidInput} type="file" accept="video/*" hidden onChange={onVideo} />
    </div>
  );
}

/* ============================================================
   MESSAGE BUBBLE
   ============================================================ */
function MessageBubble({ m, mine, theme, showAvatar, peer, settings }: {
  m: Message; mine: boolean; theme: string; showAvatar: boolean; peer: Peer; settings: Settings;
}) {
  const T = THEMES[theme];
  if (m.kind === "system") {
    return <div className="py-1 text-center text-[11px]" style={{ color: T.sub }}>{m.text}</div>;
  }
  return (
    <div className={"flex gap-2 " + (mine ? "justify-end" : "justify-start")}>
      {!mine && (showAvatar ? <GAvatar name={peer.name} color={peer.color} size={28} /> : <div className="w-7" />)}
      <div className="max-w-[75%]">
        <div className="rounded-2xl px-3.5 py-2 text-sm" style={{
          background: mine ? T.bubbleMe : T.bubbleThem,
          color: mine ? "#fff" : T.text,
          borderTopRightRadius: mine ? 6 : 16,
          borderTopLeftRadius: mine ? 16 : 6,
        }}>
          {m.kind === "text" && <span className="whitespace-pre-wrap break-words">{m.text}</span>}
          {m.kind === "image" && <img src={m.media} alt="" className="mb-1 max-h-60 max-w-full rounded-xl" />}
          {m.kind === "video" && <video src={m.media} controls className="mb-1 max-h-60 max-w-full rounded-xl" />}
          {m.kind === "voice" && <VoicePlayer url={m.media!} dur={m.dur || 0} theme={theme} mine={mine} />}
        </div>
        <div className={"mt-0.5 flex items-center gap-1 text-[10px] " + (mine ? "justify-end" : "")} style={{ color: T.sub }}>
          {fmtTime(m.ts)}
          {mine && settings.readReceipts && (m.status === "read" ? <CheckCheck className="h-3 w-3" style={{ color: T.accent }} /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}

function VoicePlayer({ url, dur, theme, mine }: { url: string; dur: number; theme: string; mine: boolean }) {
  const T = THEMES[theme];
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);
  return (
    <div className="flex items-center gap-2 py-1">
      <button onClick={() => { if (ref.current) { if (playing) ref.current.pause(); else ref.current.play(); } }} className="rounded-full p-1">
        {playing ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
      <div className="h-1 flex-1 rounded-full" style={{ background: mine ? "rgba(255,255,255,0.3)" : T.border }}>
        <motion.div className="h-full rounded-full" style={{ background: mine ? "#fff" : T.accent }}
          animate={{ width: playing ? "100%" : "20%" }} transition={{ duration: dur || 3 }} />
      </div>
      <span className="text-[10px]">{Math.floor((dur||0)/60)}:{String((dur||0)%60).padStart(2,"0")}</span>
      <audio ref={ref} src={url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} hidden />
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ theme, profile, onAdd }: { theme: string; profile: Profile; onAdd: () => void }) {
  const T = THEMES[theme];
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl"
          style={{ background: "linear-gradient(135deg," + profile.color + ",#00000040)" }}>
          <MessageSquare className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-xl font-semibold">Welcome, {profile.name}</h2>
        <p className="mt-2 max-w-sm text-sm" style={{ color: T.sub }}>
          Select a chat or add a new contact to start messaging.<br />
          Your identity is fully anonymous — no phone, no email, no account.
        </p>
        <Button className="mt-4" onClick={onAdd} style={{ background: T.accent, color: "#000" }}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </motion.div>
    </div>
  );
}

/* ============================================================
   SETTINGS DRAWER
   ============================================================ */
function SettingsDrawer({ open, onClose, theme, settings, setSettings, onResetProfile, onClearChats }: {
  open: boolean; onClose: () => void; theme: string; settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>; onResetProfile: () => void; onClearChats: () => void;
}) {
  const T = THEMES[theme];
  const s = settings;
  const upd = (k: string, v: any) => setSettings({ ...s, [k]: v });
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="overflow-y-auto" style={{ background: T.panelSolid, borderLeft: "1px solid " + T.border, color: T.text, width: 420, maxWidth: "90vw" } as React.CSSProperties}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-5 px-1 pb-10">
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: T.sub }}><Paintbrush className="h-4 w-4" /> Appearance</h3>
            <div className="grid grid-cols-2 gap-2">
              {THEME_IDS.map(id => {
                const th = THEMES[id];
                return (
                  <button key={id} onClick={() => upd("theme", id)}
                    className="rounded-xl p-3 text-left transition" style={{ background: th.bg, border: "2px solid " + (s.theme === id ? th.accent : "transparent") }}>
                    <div className="text-sm font-medium" style={{ color: th.text }}>{th.emoji} {th.name}</div>
                    <div className="mt-2 flex gap-1">
                      <span className="h-4 w-4 rounded-full" style={{ background: th.accent }} />
                      <span className="h-4 w-4 rounded-full" style={{ background: th.bubbleMe }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <Row label="Accent color" theme={theme}>
              <div className="flex gap-1.5">
                {["#8b9fff","#00f0ff","#22d3ee","#c084fc","#fb923c","#00ff66","#f472b6"].map(c => (
                  <button key={c} onClick={() => upd("accent", c)} className="h-6 w-6 rounded-full" style={{ background: c, outline: s.accent === c ? "2px solid white" : "none", outlineOffset: 1 }} />
                ))}
              </div>
            </Row>
            <Row label="Font size" theme={theme}>
              <div className="w-32"><Slider value={[s.fontSize]} min={12} max={20} step={1} onValueChange={v => upd("fontSize", v[0])} /></div>
            </Row>
            <Row label="Wallpaper" theme={theme}>
              <Select value={s.wallpaper} onValueChange={v => upd("wallpaper", v)}>
                <SelectTrigger className="w-36" style={{ background: T.panel, borderColor: T.border, color: T.text }}><SelectValue /></SelectTrigger>
                <SelectContent style={{ background: T.panelSolid, color: T.text }}>
                  {WALLPAPERS.map(w => <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Row>
          </section>

          <Separator style={{ background: T.border }} />
          <h3 className="flex items-center gap-2 text-sm font-semibold" style={{ color: T.sub }}><Shield className="h-4 w-4" /> Privacy & Messaging</h3>
          <Toggle label="Read receipts" desc="Show double-check marks" theme={theme} checked={s.readReceipts} onChange={v => upd("readReceipts", v)} />
          <Toggle label="Typing indicators" desc="Show when you're typing" theme={theme} checked={s.typingIndicators} onChange={v => upd("typingIndicators", v)} />
          <Toggle label="Enter to send" desc="Press Enter to send message" theme={theme} checked={s.enterToSend} onChange={v => upd("enterToSend", v)} />
          <Toggle label="Sound on send" desc="Play a subtle sound" theme={theme} checked={s.soundOnSend} onChange={v => upd("soundOnSend", v)} />
          <Toggle label="Notifications" desc="Desktop notifications" theme={theme} checked={s.notifications} onChange={v => upd("notifications", v)} />
          <Toggle label="Block unknown" desc="Ignore messages from unknown IDs" theme={theme} checked={s.blockUnknown} onChange={v => upd("blockUnknown", v)} />
          <Toggle label="Show online status" desc="Display presence dots" theme={theme} checked={s.showOnline} onChange={v => upd("showOnline", v)} />
          <Toggle label="Encryption badge" desc="Show lock label in header" theme={theme} checked={s.encryptLabel} onChange={v => upd("encryptLabel", v)} />

          <Separator style={{ background: T.border }} />
          <h3 className="flex items-center gap-2 text-sm font-semibold" style={{ color: T.sub }}><Trash2 className="h-4 w-4" /> Data</h3>
          <Button variant="outline" className="w-full justify-start" style={{ borderColor: T.border, color: T.text }} onClick={onClearChats}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear all chats
          </Button>
          <Button variant="outline" className="w-full justify-start" style={{ borderColor: T.border, color: T.text }} onClick={onResetProfile}>
            <Key className="mr-2 h-4 w-4" /> Generate new anonymous ID
          </Button>
          <p className="text-center text-[10px]" style={{ color: T.sub }}>GhostChat v1.0 · No servers · No accounts · No tracking</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
function Row({ label, children, theme }: { label: string; children: React.ReactNode; theme: string }) {
  const T = THEMES[theme];
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: T.text }}>{label}</span>
      {children}
    </div>
  );
}
function Toggle({ label, desc, checked, onChange, theme }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; theme: string }) {
  const T = THEMES[theme];
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium" style={{ color: T.text }}>{label}</div>
        <div className="text-[11px]" style={{ color: T.sub }}>{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/* ============================================================
   PROFILE MODAL
   ============================================================ */
function ProfileModal({ open, onClose, theme, profile, setProfile }: {
  open: boolean; onClose: () => void; theme: string; profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}) {
  const T = THEMES[theme];
  const [name, setName] = useState(profile.name);
  const [color, setColor] = useState(profile.color);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setName(profile.name); setColor(profile.color); }, [profile]);
  const save = () => { setProfile({ ...profile, name: name || profile.name, color }); onClose(); };
  const copyId = () => { navigator.clipboard?.writeText(profile.id); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent style={{ background: T.panelSolid, border: "1px solid " + T.border, color: T.text }}>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Your Profile</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col items-center gap-2">
            <GAvatar name={name || profile.name} color={color} size={80} />
            <div className="flex gap-2">{COLORS.map(c => <button key={c} onClick={() => setColor(c)} className="h-7 w-7 rounded-full" style={{ background: c, outline: color === c ? "2px solid white" : "none" }} />)}</div>
          </div>
          <div>
            <label className="text-xs" style={{ color: T.sub }}>Display name</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" style={{ background: T.panel, borderColor: T.border, color: T.text }} />
          </div>
          <div>
            <label className="text-xs" style={{ color: T.sub }}>Your anonymous ID</label>
            <button onClick={copyId} className="mt-1 flex w-full items-center justify-between rounded-lg p-3 text-left" style={{ background: T.panel, border: "1px solid " + T.border }}>
              <span className="font-mono text-sm">{shortId(profile.id)}</span>
              {copied ? <Check className="h-4 w-4" style={{ color: T.accent }} /> : <Copy className="h-4 w-4" style={{ color: T.sub }} />}
            </button>
            <p className="mt-1 text-[11px]" style={{ color: T.sub }}>Share this so others can recognize you. No personal info required.</p>
          </div>
          <Button className="w-full" onClick={save} style={{ background: T.accent, color: "#000" }}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   ADD CONTACT MODAL
   ============================================================ */
function AddContactModal({ open, onClose, theme, profile, peers }: {
  open: boolean; onClose: () => void; theme: string; profile: Profile; peers: Peer[];
}) {
  const T = THEMES[theme];
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(profile.id + "|" + profile.name + "|" + profile.color); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent style={{ background: T.panelSolid, border: "1px solid " + T.border, color: T.text }}>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Add Contact</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-xl p-4 text-center" style={{ background: T.panel, border: "1px solid " + T.border }}>
            <QrCode className="mx-auto mb-2 h-10 w-10" style={{ color: T.accent }} />
            <p className="text-sm">Open this app in another browser tab or window to create another anonymous identity.</p>
            <p className="mt-1 text-xs" style={{ color: T.sub }}>Each tab becomes a new peer and appears here automatically.</p>
          </div>
          <div>
            <label className="text-xs" style={{ color: T.sub }}>Your connection link</label>
            <button onClick={copy} className="mt-1 flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left" style={{ background: T.panel, border: "1px solid " + T.border }}>
              <span className="truncate font-mono text-xs">{profile.id}</span>
              {copied ? <Check className="h-4 w-4 shrink-0" style={{ color: T.accent }} /> : <Copy className="h-4 w-4 shrink-0" style={{ color: T.sub }} />}
            </button>
          </div>
          <div>
            <label className="text-xs" style={{ color: T.sub }}>Discovered peers ({peers.length})</label>
            <div className="mt-1 max-h-40 space-y-1 overflow-y-auto">
              {peers.length === 0 ? <p className="p-3 text-center text-xs" style={{ color: T.sub }}>No peers online. Open another tab!</p> :
                peers.map(p => (
                  <div key={p.id} className="flex items-center gap-2 rounded-lg p-2" style={{ background: T.panel, border: "1px solid " + T.border }}>
                    <GAvatar name={p.name} color={p.color} size={32} online={p.online} />
                    <div className="flex-1 text-left"><div className="text-sm font-medium">{p.name}</div><div className="text-[10px]" style={{ color: T.sub }}>{shortId(p.id)}</div></div>
                    <Badge variant="outline" style={{ borderColor: T.border, color: p.online ? "#22c55e" : T.sub }}>{p.online ? "online" : "offline"}</Badge>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   CALL SCREEN — WebRTC via BroadcastChannel signaling
   ============================================================ */
function CallScreen({ theme, peerId, kind, initiator, profile, peers, send, incomingOffer, onClearIncoming, onClose }: {
  theme: string; peerId: string; kind: string; initiator: boolean; profile: Profile;
  peers: Record<string, Peer>; send: (w: any) => void; incomingOffer: {from: string; kind: string; offer: string} | null;
  onClearIncoming: () => void; onClose: () => void;
}) {
  const T = THEMES[theme];
  const peer = peers[peerId];
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState(initiator ? "calling" : "ringing");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(kind === "audio");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingIce = useRef<RTCIceCandidate[]>([]);

  const RTC_CONF: RTCConfiguration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  const endCall = useCallback((reason: string) => {
    try { send({ t: "call-end", from: profile.id, to: peerId }); } catch {}
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    setStatus(reason);
    setTimeout(() => onClose(), 400);
  }, [send, profile, peerId, onClose]);

  const setupPC = useCallback(async () => {
    const pc = new RTCPeerConnection(RTC_CONF);
    pcRef.current = pc;
    pc.ontrack = (e) => { if (remoteRef.current) remoteRef.current.srcObject = e.streams[0]; };
    pc.onicecandidate = (e) => {
      if (e.candidate) send({ t: "ice", from: profile.id, to: peerId, ice: JSON.stringify(e.candidate), dir: initiator ? "out" : "in" });
    };
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: kind === "video" });
    localStreamRef.current = stream;
    if (localRef.current) localRef.current.srcObject = stream;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    return pc;
  }, [kind, profile, peerId, send, initiator]);

  useEffect(() => {
    if (!initiator) return;
    (async () => {
      try {
        const pc = await setupPC();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        send({ t: "call", from: profile.id, to: peerId, kind, offer: JSON.stringify(offer) });
      } catch (e) { endCall("ended"); }
    })();
  }, []);

  useEffect(() => {
    if (initiator || !incomingOffer) return;
    (async () => {
      try {
        const pc = await setupPC();
        await pc.setRemoteDescription(JSON.parse(incomingOffer.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        send({ t: "answer", from: profile.id, to: peerId, answer: JSON.stringify(answer) });
        setStatus("connected");
        onClearIncoming();
      } catch (e) { endCall("ended"); }
    })();
  }, [incomingOffer]);

  useEffect(() => {
    const h = (e: Event) => {
      const w = (e as CustomEvent).detail;
      if (w.from !== peerId || w.to !== profile.id) return;
      if (w.t === "answer" && initiator) {
        pcRef.current?.setRemoteDescription(JSON.parse(w.answer)).then(() => setStatus("connected")).catch(() => {});
      } else if (w.t === "ice") {
        const ice = JSON.parse(w.ice);
        if (pcRef.current?.remoteDescription) pcRef.current.addIceCandidate(ice).catch(()=>{});
        else pendingIce.current.push(ice);
      } else if (w.t === "call-end") { endCall("ended"); }
      else if (w.t === "call-reject") { endCall("rejected"); }
    };
    window.addEventListener("ghost-call", h);
    return () => window.removeEventListener("ghost-call", h);
  }, [peerId, profile, initiator, endCall]);

  useEffect(() => {
    if (status === "connected" && pendingIce.current.length) {
      pendingIce.current.forEach(ice => pcRef.current?.addIceCandidate(ice).catch(()=>{}));
      pendingIce.current = [];
    }
  }, [status]);

  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => {
    if (initiator && status === "calling") {
      const t = setTimeout(() => endCall("ended"), 30000);
      return () => clearTimeout(t);
    }
  }, [initiator, status, endCall]);

  const toggleMute = () => {
    const s = localStreamRef.current;
    if (s) { s.getAudioTracks().forEach(t => t.enabled = muted); setMuted(m => !m); }
  };
  const toggleCam = () => {
    const s = localStreamRef.current;
    if (s) { s.getVideoTracks().forEach(t => t.enabled = camOff); setCamOff(c => !c); }
  };

  const fmtDur = Math.floor(elapsed/60) + ":" + String(elapsed%60).padStart(2,"0");
  const statusText = status === "calling" ? "Calling..." : status === "ringing" ? "Incoming call..." : status === "connected" ? fmtDur : status === "rejected" ? "Rejected" : "Call ended";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}>
      {kind === "video" && status === "connected" ? (
        <video ref={remoteRef} autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center">
          <GAvatar name={peer?.name || "?"} color={peer?.color || "#7c3aed"} size={120} />
        </div>
      )}
      <div className="z-10 flex flex-col items-center gap-2 p-6 text-white">
        <h2 className="text-2xl font-bold">{peer?.name || "Unknown"}</h2>
        <p className="text-sm text-white/70">{statusText}</p>
      </div>

      {kind === "video" && status === "connected" && (
        <div className="fixed bottom-24 right-6 h-40 w-28 overflow-hidden rounded-xl border-2 border-white/30">
          <video ref={localRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        </div>
      )}
      {kind === "audio" && (
        <video ref={localRef} autoPlay playsInline muted hidden />
      )}

      <div className="absolute bottom-10 flex items-center gap-4">
        <button onClick={toggleMute} className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20">
          {muted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
        </button>
        {kind === "video" && (
          <button onClick={toggleCam} className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20">
            {camOff ? <CameraOff className="h-6 w-6 text-white" /> : <Camera className="h-6 w-6 text-white" />}
          </button>
        )}
        <button onClick={() => endCall("ended")} className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 transition hover:bg-red-600">
          <PhoneOff className="h-7 w-7 text-white" />
        </button>
      </div>

      {!initiator && status === "ringing" && (
        <motion.div initial={{ y: 60 }} animate={{ y: 0 }} className="absolute bottom-28 flex gap-6">
          <button onClick={() => endCall("rejected")} className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
            <PhoneOff className="h-7 w-7 text-white" />
          </button>
          <button onClick={() => { setStatus("connected"); }} className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <Phone className="h-7 w-7 text-white" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

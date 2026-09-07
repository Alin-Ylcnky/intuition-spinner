import { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  name: string;
  url: string;
}

const tracks: Track[] = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    url: 'https://raw.githubusercontent.com/Alin-Ylcnky/alchemind-audio/main/Cosmic%20vibes%201.mp3'
  },
  {
    id: 'bloom',
    name: 'Bloom',
    url: 'https://raw.githubusercontent.com/Alin-Ylcnky/alchemind-audio/main/Cosmic%20vibes%202.mp3'
  },
  {
    id: 'equinox',
    name: 'Equinox',
    url: 'https://raw.githubusercontent.com/Alin-Ylcnky/alchemind-audio/main/Future%20blooms1.mp3'
  },
  {
    id: 'dream',
    name: 'Dream',
    url: 'https://raw.githubusercontent.com/Alin-Ylcnky/alchemind-audio/main/Future%20blooms2.mp3'
  },
  {
    id: 'light',
    name: 'Light',
    url: 'https://raw.githubusercontent.com/Alin-Ylcnky/alchemind-audio/main/SpringEquinox%20%201.mp3'
  }
];

export const useAudio = () => {
 const [isPlaying,setIsPlaying]=useState(false),[volume,setVolume]=useState(.3),[isMuted,setIsMuted]=useState(false),[currentTrack,setCurrentTrack]=useState(tracks[0]),[error,setError]=useState('');
 const audioRef=useRef<HTMLAudioElement|null>(null);
 const intent=useRef(false),request=useRef(0);
 useEffect(()=>{const a=new Audio();a.loop=true;a.preload='none';audioRef.current=a;const fail=()=>{setError('The music could not load. Try another track.');setIsPlaying(false);intent.current=false};a.addEventListener('error',fail);return()=>{request.current++;a.pause();a.removeEventListener('error',fail);audioRef.current=null}},[]);
 useEffect(()=>{const a=audioRef.current;if(!a)return;const sequence=++request.current;a.src=currentTrack.url;setError('');if(intent.current){a.play().then(()=>{if(sequence===request.current)setIsPlaying(true)}).catch(()=>{if(sequence===request.current){setIsPlaying(false);intent.current=false;setError('The music could not start. Try another track.')}})}},[currentTrack]);
 useEffect(()=>{if(audioRef.current)audioRef.current.volume=isMuted?0:volume},[volume,isMuted]);
 const togglePlay=()=>{const a=audioRef.current;if(!a)return;const sequence=++request.current;if(intent.current){intent.current=false;a.pause();setIsPlaying(false)}else{intent.current=true;setError('');a.play().then(()=>{if(sequence===request.current)setIsPlaying(true)}).catch(()=>{if(sequence===request.current){intent.current=false;setIsPlaying(false);setError('The music could not start. Try another track.')}})}};
 const adjustVolume=(delta:number)=>{setVolume(v=>Math.max(0,Math.min(1,v+delta)));if(delta>0)setIsMuted(false)};
 const changeTrack=(id:string)=>{const track=tracks.find(t=>t.id===id);if(track)setCurrentTrack(track)};
 const toggleMute=()=>setIsMuted(v=>!v);
 return {isPlaying,volume,isMuted,currentTrack,tracks,error,togglePlay,adjustVolume,changeTrack,toggleMute};
};

import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'72px', color:'#FCFBF8', background:'#121212', fontFamily:'sans-serif' }}><div style={{ display:'flex', fontSize:20, letterSpacing:5, textTransform:'uppercase' }}>Speaker | Author | Entrepreneur</div><div style={{ display:'flex', flexDirection:'column' }}><div style={{ fontSize:82, fontWeight:700, letterSpacing:-5 }}>Seamas Vincent</div><div style={{ display:'flex', fontSize:48, fontFamily:'serif', marginTop:18 }}>A wider view of what we build.</div></div><div style={{ display:'flex', width:100, height:8, background:'#FFBF00', boxShadow:'0 0 24px rgba(255,191,0,.55)' }} /></div>, size);
}

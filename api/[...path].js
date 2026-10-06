export default async function handler(req,res) {
  const base=String(process.env.ROMA_API_BASE||"").replace(/\/$/,"");
  if(!base) return res.status(500).json({success:false,error:"ROMA_API_BASE is not configured"});

  const incoming=new URL(req.url,"https://vercel.local");
  const path=incoming.pathname.replace(/^\/api/,"");
  const target=base+path+(incoming.search||"");

  const headers={};
  for(const [key,value] of Object.entries(req.headers||{})){
    if(!["host","connection","content-length"].includes(key) && value) headers[key]=Array.isArray(value)?value.join(","):value;
  }

  const init={method:req.method,headers};
  if(!["GET","HEAD"].includes(req.method)){
    init.body=JSON.stringify(req.body??{});
    init.headers["content-type"]="application/json";
  }

  try{
    const response=await fetch(target,init);
    const text=await response.text();
    res.status(response.status);
    const type=response.headers.get("content-type");
    if(type) res.setHeader("content-type",type);
    res.send(text);
  }catch(error){
    res.status(502).json({success:false,error:"Pairing backend unavailable"});
  }
}
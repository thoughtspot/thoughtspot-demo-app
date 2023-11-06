import React, { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"

interface BrowseProps{
    tsURL: string,
    myLiveboardId: string | null,
    setMyLiveboardId: (id: string | null) => void
}
export default function BrowsePage(props: BrowseProps){
    const {
        tsURL,
        myLiveboardId,
        setMyLiveboardId,
    } = props
    const [liveboards, setLiveboards] = useState([])
    useEffect(()=>{
        setMyLiveboardId(null)
        fetch(tsURL+"/callosum/v1/tspublic/v1/metadata/list?type=PINBOARD_ANSWER_BOOK&category=MY",
        {
          credentials: 'include',
        })
        .then(response => response.json()).then(
          data =>setLiveboards(data.headers))
    },[])
    return (
    <div className="flex flex-col p-5 space-y-1">
       {liveboards.map((liveboard: any)=>(
           <>
           {(!myLiveboardId || myLiveboardId == liveboard.id) && (
           <ContentItem name={liveboard.name} id={liveboard.id} description={liveboard.description} myLiveboardId={myLiveboardId} setMyLiveboardId={setMyLiveboardId}></ContentItem>
           )}
           </>
       ))}
    </div>
    )
}
interface ContentProps {
    name: string,
    id: string,
    description: string,
    myLiveboardId: string | null,
    setMyLiveboardId: (id: string | null) => void
}
function ContentItem(props: ContentProps){
    const {
        name,
        id,
        description,
        myLiveboardId,
        setMyLiveboardId
    } = props
    return (
        <div className='hover:cursor-pointer' style={{display:"flex",flexDirection:"row",padding:15,maxHeight:250,marginBottom:25,background:"#ffffff",borderRadius:"25px",boxShadow:"0 0 15 #efefef"}}>
            <div className="flex  justify-start flex-col w-3/4 pl-4" onClick={()=>setMyLiveboardId(id)} > 
                <div className="flex font-bold text-lg">
                    {name}
                </div>
                <div className="flex align-items-start">
                    {description}
                </div>
            </div>
            <div onClick={()=>setMyLiveboardId(null)} className="flex w-1/4 justify-end items-center">
                {id == myLiveboardId && (
                    <FiX></FiX>
                )}
            </div>
            
        </div>       
    )
}